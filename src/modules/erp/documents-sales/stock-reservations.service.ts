import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

type Tx = any;

@Injectable()
export class StockReservationsService {
  constructor(private readonly db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private pending(row: any) {
    return new Prisma.Decimal(row.quantity_reserved)
      .minus(row.quantity_consumed ?? 0)
      .minus(row.quantity_released ?? 0);
  }

  private async lockStockRow(tx: Tx, warehouseId: string, productId: string) {
    await tx.$queryRaw(Prisma.sql`
      SELECT id
      FROM tenant.warehouse_stock
      WHERE warehouse_id = ${warehouseId}::uuid
        AND product_id = ${productId}::uuid
      FOR UPDATE
    `);
  }

  private async resolveWarehouse(tx: Tx, productId: string, requested: string | null, quantity: Prisma.Decimal) {
    const realCandidates = await tx.warehouse_stock.findMany({
      where: { product_id: productId, deleted_at: null, warehouses: { active: true, deleted_at: null, is_virtual: false } },
      orderBy: { quantity: 'desc' },
    });
    const realWithAvailability = realCandidates.filter((row: any) =>
      new Prisma.Decimal(row.quantity).minus(row.reserved_quantity).greaterThan(0),
    );

    if (requested) {
      const warehouse = await tx.warehouses.findFirst({
        where: { id: requested, active: true, deleted_at: null },
        select: { id: true, is_virtual: true },
      });
      if (!warehouse) throw new BadRequestException('El depósito de la reserva no existe o está inactivo');
      if (warehouse.is_virtual) {
        const transitContainer = await tx.international_containers.findFirst({
          where: { transit_warehouse_id: requested, deleted_at: null, status: { notIn: ['DELIVERED', 'CLOSED'] } },
          select: { id: true },
        });
        if (!transitContainer) throw new BadRequestException('El depósito virtual seleccionado no corresponde a mercadería en tránsito activa');
        if (realWithAvailability.length) {
          throw new BadRequestException('No se puede reservar stock en tránsito mientras el producto tenga disponibilidad en un depósito real');
        }
        return requested;
      }
      const requestedStock = realCandidates.find((row: any) => row.warehouse_id === requested);
      const requestedAvailable = requestedStock
        ? new Prisma.Decimal(requestedStock.quantity).minus(requestedStock.reserved_quantity)
        : new Prisma.Decimal(0);
      if (requestedAvailable.greaterThan(0)) return requested;
      // Si el depósito solicitado está vacío, primero se busca disponibilidad
      // en cualquier otro depósito real y recién después se evalúa tránsito.
    }

    const enough = realWithAvailability.find((row: any) =>
      new Prisma.Decimal(row.quantity).minus(row.reserved_quantity).greaterThanOrEqualTo(quantity),
    );
    if (enough) return enough.warehouse_id;
    if (realWithAvailability.length) return realWithAvailability[0].warehouse_id;

    const transitWarehouseIds = (await tx.international_containers.findMany({
      where: { transit_warehouse_id: { not: null }, deleted_at: null, status: { notIn: ['DELIVERED', 'CLOSED'] } },
      select: { transit_warehouse_id: true },
    })).map((container: any) => container.transit_warehouse_id).filter(Boolean);
    if (!transitWarehouseIds.length) return null;

    const transitCandidates = await tx.warehouse_stock.findMany({
      where: {
        product_id: productId,
        warehouse_id: { in: transitWarehouseIds },
        deleted_at: null,
        warehouses: { active: true, deleted_at: null, is_virtual: true },
      },
      orderBy: { quantity: 'desc' },
    });
    const transitEnough = transitCandidates.find((row: any) =>
      new Prisma.Decimal(row.quantity).minus(row.reserved_quantity).greaterThanOrEqualTo(quantity),
    );
    const transitAvailable = transitCandidates.find((row: any) =>
      new Prisma.Decimal(row.quantity).minus(row.reserved_quantity).greaterThan(0),
    );
    return transitEnough?.warehouse_id ?? transitAvailable?.warehouse_id ?? null;
  }

  async getSalesOrderAvailability(orderId: string) {
    const [order, settings] = await Promise.all([
      this.prisma.documents.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          number: true,
          warehouse_id: true,
          document_types: { select: { category: true, direction: true } },
          document_items: {
            where: { deleted_at: null, product_id: { not: null } },
            select: {
              id: true,
              product_id: true,
              warehouse_id: true,
              quantity: true,
              products: {
                select: {
                  name: true,
                  sku: true,
                  unit: { select: { symbol: true } },
                },
              },
            },
          },
        },
      }),
      this.prisma.sales_flow_settings.upsert({
        where: { settings_key: 'default' },
        update: {},
        create: { settings_key: 'default' },
      }),
    ]);

    if (!order) throw new NotFoundException('La Orden de Venta no existe');
    if (order.document_types?.category !== 'ORDER' || order.document_types.direction !== 1) {
      throw new BadRequestException('La disponibilidad detallada sólo corresponde a Órdenes de Venta');
    }

    const productIds = [...new Set(order.document_items.map((item: any) => item.product_id).filter(Boolean))] as string[];
    const stockRows = productIds.length
      ? await this.prisma.warehouse_stock.findMany({
          where: {
            product_id: { in: productIds },
            deleted_at: null,
            warehouses: { active: true, deleted_at: null },
          },
          select: {
            product_id: true,
            warehouse_id: true,
            quantity: true,
            reserved_quantity: true,
            warehouses: { select: { id: true, name: true, code: true, is_virtual: true } },
          },
        })
      : [];

    const transitWarehouseIds = [...new Set(stockRows
      .filter((row: any) => row.warehouses.is_virtual)
      .map((row: any) => row.warehouse_id))] as string[];
    const containers = transitWarehouseIds.length
      ? await this.prisma.international_containers.findMany({
          where: {
            transit_warehouse_id: { in: transitWarehouseIds },
            deleted_at: null,
            status: { notIn: ['DELIVERED', 'CLOSED'] },
          },
          select: {
            id: true,
            container_number: true,
            status: true,
            transit_warehouse_id: true,
            estimated_arrival_date: true,
            actual_arrival_date: true,
            operation: { select: { estimated_arrival_date: true, actual_arrival_date: true } },
          },
        })
      : [];
    const containerByWarehouse = new Map(containers
      .filter((container: any) => container.transit_warehouse_id)
      .map((container: any) => [container.transit_warehouse_id, container]));
    const number = (value: unknown) => Number(value ?? 0);

    const items = order.document_items.map((item: any) => {
      const rows = stockRows.filter((row: any) => row.product_id === item.product_id);
      const physicalRows = rows.filter((row: any) => !row.warehouses.is_virtual);
      const transitRows = rows.filter((row: any) => row.warehouses.is_virtual);
      const available = (row: any) => Math.max(number(row.quantity) - number(row.reserved_quantity), 0);
      const requested = number(item.quantity);
      const availableNow = physicalRows.reduce((sum: number, row: any) => sum + available(row), 0);
      const availableTransit = transitRows.reduce((sum: number, row: any) => sum + available(row), 0);

      return {
        item_id: item.id,
        product_id: item.product_id,
        name: item.products?.name ?? 'Producto',
        sku: item.products?.sku ?? null,
        unit: item.products?.unit?.symbol ?? 'u.',
        requested,
        physical_stock: physicalRows.reduce((sum: number, row: any) => sum + number(row.quantity), 0),
        reserved_physical: physicalRows.reduce((sum: number, row: any) => sum + number(row.reserved_quantity), 0),
        available_now: availableNow,
        transit_available: availableTransit,
        shortage: Math.max(requested - availableNow, 0),
        status: availableNow >= requested ? 'AVAILABLE' : availableNow > 0 ? 'PARTIAL' : 'NO_PHYSICAL_STOCK',
        warehouses: physicalRows.map((row: any) => ({
          id: row.warehouses.id,
          name: row.warehouses.name,
          code: row.warehouses.code,
          quantity: number(row.quantity),
          reserved: number(row.reserved_quantity),
          available: available(row),
        })),
        arrivals: transitRows.map((row: any) => {
          const container: any = containerByWarehouse.get(row.warehouse_id);
          return {
            container_id: container?.id ?? null,
            container_number: container?.container_number ?? null,
            status: container?.status ?? null,
            available: available(row),
            arrival_date: container?.actual_arrival_date
              ?? container?.estimated_arrival_date
              ?? container?.operation?.actual_arrival_date
              ?? container?.operation?.estimated_arrival_date
              ?? null,
          };
        }),
      };
    });

    const withoutPhysicalStock = items.filter((item: any) => item.available_now <= 0).length;
    const withShortage = items.filter((item: any) => item.available_now < item.requested).length;
    const blocksConfirmation = Boolean(
      settings.reserve_stock_on_order_confirmation
      && items.some((item: any) => {
        const totalReservable = item.available_now + item.transit_available;
        if (totalReservable <= 0) return !settings.allow_backorder_without_stock;
        return totalReservable < item.requested
          && !settings.allow_partial_stock_reservation
          && !settings.allow_backorder_without_stock;
      }),
    );

    return {
      order_id: order.id,
      items,
      summary: {
        total_items: items.length,
        available_items: items.length - withShortage,
        with_shortage: withShortage,
        without_physical_stock: withoutPhysicalStock,
        all_available: withShortage === 0,
      },
      policy: {
        reserve_on_confirmation: settings.reserve_stock_on_order_confirmation,
        allow_partial_reservation: settings.allow_partial_stock_reservation,
        allow_backorder: settings.allow_backorder_without_stock,
        blocks_confirmation: blocksConfirmation,
      },
    };
  }

  async reserveSalesOrder(tx: Tx, orderId: string, userId: string) {
    const [order, settings] = await Promise.all([
      tx.documents.findUnique({
        where: { id: orderId },
        include: {
          document_types: { select: { category: true, direction: true } },
          document_items: {
            where: { deleted_at: null },
            include: { products: { select: { name: true, sku: true } } },
          },
        },
      }),
      tx.sales_flow_settings.upsert({ where: { settings_key: 'default' }, update: {}, create: { settings_key: 'default' } }),
    ]);
    if (!order || order.document_types?.category !== 'ORDER' || order.document_types.direction !== 1) return [];
    if (!settings.reserve_stock_on_order_confirmation) return [];

    const created: any[] = [];
    for (const item of order.document_items) {
      if (!item.product_id) continue;
      const requested = new Prisma.Decimal(item.quantity);
      const productLabel = item.products?.sku
        ? `${item.products.name} (${item.products.sku})`
        : (item.products?.name ?? 'uno de los productos');
      const warehouseId = await this.resolveWarehouse(tx, item.product_id, item.warehouse_id ?? order.warehouse_id, requested);
      if (!warehouseId) {
        if (settings.allow_backorder_without_stock) continue;
        throw new BadRequestException(`No hay stock físico ni en tránsito disponible para ${productLabel}`);
      }

      await this.lockStockRow(tx, warehouseId, item.product_id);
      const stock = await tx.warehouse_stock.findUnique({
        where: { warehouse_id_product_id: { warehouse_id: warehouseId, product_id: item.product_id } },
        include: { warehouses: { select: { is_virtual: true } } },
      });
      const available = stock
        ? new Prisma.Decimal(stock.quantity).minus(stock.reserved_quantity)
        : new Prisma.Decimal(0);
      let reserveQty = requested;
      if (available.lessThan(requested)) {
        if (!settings.allow_partial_stock_reservation && !settings.allow_backorder_without_stock) {
          throw new BadRequestException(
            `Stock insuficiente para ${productLabel}: solicitado ${requested.toString()}, disponible ${available.toString()}`,
          );
        }
        reserveQty = settings.allow_partial_stock_reservation ? Prisma.Decimal.max(available, 0) : new Prisma.Decimal(0);
      }
      if (reserveQty.lessThanOrEqualTo(0)) continue;

      const existing = await tx.stock_reservations.findFirst({
        where: { source_type: 'SALES_ORDER', source_id: order.id, source_item_id: item.id, status: { in: ['ACTIVE', 'PARTIALLY_CONSUMED'] }, deleted_at: null },
      });
      if (existing) continue;

      const reservation = await tx.stock_reservations.create({
        data: {
          warehouse_id: warehouseId,
          product_id: item.product_id,
          quantity_reserved: reserveQty,
          reservation_type: 'SALES_ORDER',
          source_type: 'SALES_ORDER',
          source_id: order.id,
          source_item_id: item.id,
          party_id: order.party_id,
          reason: `Reserva automática OV #${order.number}${stock?.warehouses?.is_virtual ? ' · mercadería en tránsito' : ''}`,
          created_by: userId,
        },
      });
      await tx.warehouse_stock.update({
        where: { warehouse_id_product_id: { warehouse_id: warehouseId, product_id: item.product_id } },
        data: { reserved_quantity: { increment: reserveQty }, updated_at: new Date() },
      });
      if (!item.warehouse_id) {
        await tx.document_items.update({ where: { id: item.id }, data: { warehouse_id: warehouseId } });
      }
      created.push(reservation);
    }
    return created;
  }

  async consumeForRemito(tx: Tx, remito: any, userId: string) {
    if (!remito.parent_document_id) return;
    for (const item of remito.document_items) {
      if (!item.product_id) continue;
      let remaining = new Prisma.Decimal(item.quantity);
      let reservations = await tx.stock_reservations.findMany({
        where: {
          source_type: 'SALES_ORDER', source_id: remito.parent_document_id,
          product_id: item.product_id, status: { in: ['ACTIVE', 'PARTIALLY_CONSUMED'] }, deleted_at: null,
          ...(item.warehouse_id ? { warehouse_id: item.warehouse_id } : {}),
        },
        orderBy: { created_at: 'asc' },
      });
      if (!reservations.length && item.warehouse_id) {
        reservations = await tx.stock_reservations.findMany({
          where: {
            source_type: 'SALES_ORDER', source_id: remito.parent_document_id,
            product_id: item.product_id, status: { in: ['ACTIVE', 'PARTIALLY_CONSUMED'] }, deleted_at: null,
          },
          orderBy: { created_at: 'asc' },
        });
      }
      for (const reservation of reservations) {
        if (remaining.lessThanOrEqualTo(0)) break;
        const pending = this.pending(reservation);
        const consume = Prisma.Decimal.min(pending, remaining);
        if (consume.lessThanOrEqualTo(0)) continue;
        const consumed = new Prisma.Decimal(reservation.quantity_consumed).plus(consume);
        const newPending = pending.minus(consume);
        await tx.stock_reservations.update({
          where: { id: reservation.id },
          data: {
            quantity_consumed: consumed,
            status: newPending.isZero() ? 'CONSUMED' : 'PARTIALLY_CONSUMED',
            updated_by: userId,
          },
        });
        await tx.stock_reservation_allocations.create({
          data: { reservation_id: reservation.id, document_id: remito.id, quantity: consume, created_by: userId },
        });
        await tx.warehouse_stock.update({
          where: { warehouse_id_product_id: { warehouse_id: reservation.warehouse_id, product_id: reservation.product_id } },
          data: { reserved_quantity: { decrement: consume }, updated_at: new Date() },
        });
        if (!item.warehouse_id || item.warehouse_id !== reservation.warehouse_id) {
          await tx.document_items.update({ where: { id: item.id }, data: { warehouse_id: reservation.warehouse_id } });
          item.warehouse_id = reservation.warehouse_id;
        }
        remaining = remaining.minus(consume);
      }
    }
  }

  async restoreRemitoConsumption(tx: Tx, remitoId: string, userId: string) {
    const allocations = await tx.stock_reservation_allocations.findMany({
      where: { document_id: remitoId, status: 'CONSUMED' },
      include: { reservation: true },
    });
    for (const allocation of allocations) {
      const reservation = allocation.reservation;
      const quantity = new Prisma.Decimal(allocation.quantity);
      const consumed = Prisma.Decimal.max(new Prisma.Decimal(reservation.quantity_consumed).minus(quantity), 0);
      const pending = new Prisma.Decimal(reservation.quantity_reserved).minus(consumed).minus(reservation.quantity_released);
      await tx.stock_reservations.update({
        where: { id: reservation.id },
        data: {
          quantity_consumed: consumed,
          status: pending.greaterThan(0) ? (consumed.greaterThan(0) ? 'PARTIALLY_CONSUMED' : 'ACTIVE') : 'CONSUMED',
          updated_by: userId,
        },
      });
      await tx.warehouse_stock.update({
        where: { warehouse_id_product_id: { warehouse_id: reservation.warehouse_id, product_id: reservation.product_id } },
        data: { reserved_quantity: { increment: quantity }, updated_at: new Date() },
      });
      await tx.stock_reservation_allocations.update({
        where: { id: allocation.id }, data: { status: 'REVERSED', reversed_at: new Date() },
      });
    }
  }

  async releaseOrder(tx: Tx, orderId: string, userId: string) {
    const reservations = await tx.stock_reservations.findMany({
      where: { source_type: 'SALES_ORDER', source_id: orderId, status: { in: ['ACTIVE', 'PARTIALLY_CONSUMED'] }, deleted_at: null },
    });
    for (const reservation of reservations) {
      const pending = this.pending(reservation);
      if (pending.greaterThan(0)) {
        await tx.warehouse_stock.update({
          where: { warehouse_id_product_id: { warehouse_id: reservation.warehouse_id, product_id: reservation.product_id } },
          data: { reserved_quantity: { decrement: pending }, updated_at: new Date() },
        });
      }
      await tx.stock_reservations.update({
        where: { id: reservation.id },
        data: { quantity_released: { increment: pending }, status: 'RELEASED', updated_by: userId },
      });
    }
  }

  list(warehouseId?: string) {
    return this.prisma.stock_reservations.findMany({
      where: { ...(warehouseId ? { warehouse_id: warehouseId } : {}), deleted_at: null },
      include: { product: { select: { id: true, name: true, sku: true } }, warehouse: { select: { id: true, name: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async createManual(dto: { warehouse_id: string; product_id: string; quantity: number; reason: string; expires_at?: string; party_id?: string }, userId: string) {
    if (!dto.reason?.trim()) throw new BadRequestException('El motivo de la reserva es obligatorio');
    return this.prisma.$transaction(async tx => {
      const quantity = new Prisma.Decimal(dto.quantity);
      if (quantity.lessThanOrEqualTo(0)) throw new BadRequestException('La cantidad debe ser mayor que cero');
      const warehouse = await tx.warehouses.findFirst({ where: { id: dto.warehouse_id, active: true, deleted_at: null } });
      if (!warehouse) throw new BadRequestException('El depósito no existe o está inactivo');
      if (warehouse.is_virtual) {
        const transitContainer = await tx.international_containers.findFirst({
          where: { transit_warehouse_id: dto.warehouse_id, deleted_at: null, status: { notIn: ['DELIVERED', 'CLOSED'] } },
          select: { id: true },
        });
        if (!transitContainer) throw new BadRequestException('Solo se puede reservar un depósito virtual asociado a un contenedor activo');
        const realStocks = await tx.warehouse_stock.findMany({
          where: { product_id: dto.product_id, deleted_at: null, warehouses: { active: true, deleted_at: null, is_virtual: false } },
          select: { quantity: true, reserved_quantity: true },
        });
        if (realStocks.some((row: any) => new Prisma.Decimal(row.quantity).minus(row.reserved_quantity).greaterThan(0))) {
          throw new BadRequestException('El producto todavía tiene disponibilidad en un depósito real; no corresponde reservarlo en tránsito');
        }
      }
      await this.lockStockRow(tx, dto.warehouse_id, dto.product_id);
      const stock = await tx.warehouse_stock.findUnique({ where: { warehouse_id_product_id: { warehouse_id: dto.warehouse_id, product_id: dto.product_id } } });
      if (!stock || new Prisma.Decimal(stock.quantity).minus(stock.reserved_quantity).lessThan(quantity)) {
        throw new BadRequestException('Stock disponible insuficiente para la reserva manual');
      }
      const reservation = await tx.stock_reservations.create({
        data: {
          warehouse_id: dto.warehouse_id, product_id: dto.product_id, quantity_reserved: quantity,
          reservation_type: 'MANUAL', source_type: 'MANUAL', party_id: dto.party_id,
          reason: dto.reason.trim(), expires_at: dto.expires_at ? new Date(dto.expires_at) : null, created_by: userId,
        },
      });
      await tx.warehouse_stock.update({
        where: { warehouse_id_product_id: { warehouse_id: dto.warehouse_id, product_id: dto.product_id } },
        data: { reserved_quantity: { increment: quantity }, updated_at: new Date() },
      });
      return reservation;
    });
  }

  async releaseManual(id: string, userId: string) {
    return this.prisma.$transaction(async tx => {
      const reservation = await tx.stock_reservations.findFirst({ where: { id, reservation_type: 'MANUAL', deleted_at: null } });
      if (!reservation) throw new NotFoundException('Reserva manual no encontrada');
      if (!['ACTIVE', 'PARTIALLY_CONSUMED'].includes(reservation.status)) throw new BadRequestException('La reserva ya no está activa');
      const pending = this.pending(reservation);
      await tx.warehouse_stock.update({
        where: { warehouse_id_product_id: { warehouse_id: reservation.warehouse_id, product_id: reservation.product_id } },
        data: { reserved_quantity: { decrement: pending }, updated_at: new Date() },
      });
      return tx.stock_reservations.update({
        where: { id }, data: { quantity_released: { increment: pending }, status: 'RELEASED', updated_by: userId },
      });
    });
  }

  async releaseExpiredForClient(prisma: any) {
    const expired = await prisma.stock_reservations.findMany({
      where: {
        reservation_type: 'MANUAL',
        status: { in: ['ACTIVE', 'PARTIALLY_CONSUMED'] },
        expires_at: { lte: new Date() },
        deleted_at: null,
      },
      select: { id: true },
    });

    for (const reservation of expired) {
      await prisma.$transaction(async (tx: any) => {
        const current = await tx.stock_reservations.findUnique({ where: { id: reservation.id } });
        if (!current || !['ACTIVE', 'PARTIALLY_CONSUMED'].includes(current.status)) return;
        await this.lockStockRow(tx, current.warehouse_id, current.product_id);
        const pending = this.pending(current);
        if (pending.lessThanOrEqualTo(0)) return;
        await tx.warehouse_stock.update({
          where: { warehouse_id_product_id: { warehouse_id: current.warehouse_id, product_id: current.product_id } },
          data: { reserved_quantity: { decrement: pending }, updated_at: new Date() },
        });
        await tx.stock_reservations.update({
          where: { id: current.id },
          data: { quantity_released: { increment: pending }, status: 'EXPIRED' },
        });
      });
    }

    return expired.length;
  }
}
