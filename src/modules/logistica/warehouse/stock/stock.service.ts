import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { requestContext } from '@/common/context/request-context';
import { EngineeringService } from '@/modules/master-data/products/engineering/engineering.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class StockService {
  constructor(
    private db: PrismaService,
    private readonly engineeringService: EngineeringService,
  ) {}

  private collectProductionMaterials(
    nodes: any[],
    productionQuantity: Prisma.Decimal,
    parentMultiplier = new Prisma.Decimal(1),
  ) {
    const materials = new Map<string, { product_id: string; name: string; sku: string | null; quantity: Prisma.Decimal }>();
    for (const node of nodes) {
      const nodeMultiplier = parentMultiplier.mul(Number(node.quantity || 1));
      if (node.children?.length) {
        const nested = this.collectProductionMaterials(node.children, productionQuantity, nodeMultiplier);
        for (const item of nested.values()) {
          const current = materials.get(item.product_id);
          if (current) current.quantity = current.quantity.plus(item.quantity);
          else materials.set(item.product_id, item);
        }
        continue;
      }

      const baseQuantity = Number(node.calculated_quantity || node.quantity || 0);
      const required = productionQuantity.mul(parentMultiplier).mul(baseQuantity);
      const current = materials.get(node.product_id);
      if (current) current.quantity = current.quantity.plus(required);
      else materials.set(node.product_id, {
        product_id: node.product_id,
        name: node.product_name,
        sku: node.product_sku ?? null,
        quantity: required,
      });
    }
    return materials;
  }

  async previewProduction(productId: string, materialWarehouseId: string, outputWarehouseId: string, quantity: number, variantId?: string) {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new BadRequestException('La cantidad a fabricar debe ser mayor que cero');
    }
    if (!materialWarehouseId || !outputWarehouseId) {
      throw new BadRequestException('Seleccioná los depósitos de materiales y producto terminado');
    }
    const [product, materialWarehouse, outputWarehouse, engineering, variant] = await Promise.all([
      this.prisma.products.findFirst({ where: { id: productId, deleted_at: null, active: true } }),
      this.prisma.warehouses.findFirst({ where: { id: materialWarehouseId, deleted_at: null, active: true } }),
      this.prisma.warehouses.findFirst({ where: { id: outputWarehouseId, deleted_at: null, active: true } }),
      this.engineeringService.calculate(productId, variantId),
      variantId
        ? this.prisma.product_variants.findFirst({
            where: { id: variantId, product_id: productId, deleted_at: null, active: true },
            select: { id: true, name: true, sku: true },
          })
        : Promise.resolve(null),
    ]);
    if (!product) throw new BadRequestException('Producto no encontrado');
    if (variantId && !variant) throw new BadRequestException('La variante no existe o no pertenece al producto');
    if (!materialWarehouse) throw new BadRequestException('El depósito de materiales no existe o está inactivo');
    if (!outputWarehouse) throw new BadRequestException('El depósito de producto terminado no existe o está inactivo');
    if (!engineering.tree.length) throw new BadRequestException('El producto no tiene componentes para fabricar');

    const requirements = this.collectProductionMaterials(engineering.tree, new Prisma.Decimal(quantity));
    const stocks = await this.prisma.warehouse_stock.findMany({
      where: { warehouse_id: materialWarehouseId, product_id: { in: [...requirements.keys()] }, deleted_at: null },
    });
    const stockMap = new Map<string, any>(stocks.map(stock => [stock.product_id, stock]));
    const materials = [...requirements.values()].map(item => {
      const stock = stockMap.get(item.product_id);
      const physical = new Prisma.Decimal(stock?.quantity ?? 0);
      const reserved = new Prisma.Decimal(stock?.reserved_quantity ?? 0);
      const available = Prisma.Decimal.max(physical.minus(reserved), 0);
      return {
        ...item,
        quantity: item.quantity.toNumber(),
        stock: physical.toNumber(),
        reserved: reserved.toNumber(),
        available: available.toNumber(),
        missing: Prisma.Decimal.max(item.quantity.minus(available), 0).toNumber(),
        sufficient: available.greaterThanOrEqualTo(item.quantity),
      };
    });
    return {
      product: { id: product.id, name: product.name, sku: product.sku },
      variant: variant ?? null,
      material_warehouse: { id: materialWarehouse.id, name: materialWarehouse.name },
      output_warehouse: { id: outputWarehouse.id, name: outputWarehouse.name },
      quantity,
      can_produce: materials.every(item => item.sufficient),
      materials,
    };
  }

  async executeProduction(productId: string, materialWarehouseId: string, outputWarehouseId: string, quantity: number, variantId?: string) {
    const preview = await this.previewProduction(productId, materialWarehouseId, outputWarehouseId, quantity, variantId);
    if (!preview.can_produce) {
      const missing = preview.materials.filter(item => !item.sufficient).map(item => item.name).join(', ');
      throw new BadRequestException(`Stock insuficiente para fabricar. Faltan: ${missing}`);
    }
    const productionId = randomUUID();
    const variantLabel = preview.variant
      ? ` (${preview.variant.name ?? preview.variant.sku ?? 'variante'})`
      : '';
    return this.prisma.$transaction(async tx => {
      for (const material of preview.materials) {
        const stock = await tx.warehouse_stock.findUnique({
          where: { warehouse_id_product_id: { warehouse_id: materialWarehouseId, product_id: material.product_id } },
        });
        const required = new Prisma.Decimal(material.quantity);
        const available = stock ? stock.quantity.minus(stock.reserved_quantity) : new Prisma.Decimal(0);
        if (!stock || available.lessThan(required)) {
          throw new BadRequestException(`El stock de ${material.name} cambió y ya no alcanza`);
        }
        await tx.warehouse_stock.update({ where: { id: stock.id }, data: { quantity: stock.quantity.minus(required) } });
        await tx.warehouse_stock_movements.create({ data: {
          warehouse_id: materialWarehouseId,
          product_id: material.product_id,
          movement_type: 'PRODUCTION_CONSUME',
          direction: 'OUT',
          quantity: required,
          reference_type: 'PRODUCTION_ORDER',
          reference_id: productionId,
          notes: `Consumo para fabricar ${quantity} × ${preview.product.name}${variantLabel}`,
          created_by: this.userId,
        }});
      }

      const outputQuantity = new Prisma.Decimal(quantity);
      await tx.warehouse_stock.upsert({
        where: { warehouse_id_product_id: { warehouse_id: outputWarehouseId, product_id: productId } },
        create: { warehouse_id: outputWarehouseId, product_id: productId, quantity: outputQuantity, created_by: this.userId },
        update: { quantity: { increment: outputQuantity }, updated_by: this.userId },
      });
      await tx.warehouse_stock_movements.create({ data: {
        warehouse_id: outputWarehouseId,
        product_id: productId,
        movement_type: 'PRODUCTION_OUTPUT',
        direction: 'IN',
        quantity: outputQuantity,
        reference_type: 'PRODUCTION_ORDER',
        reference_id: productionId,
        notes: `Fabricación de ${quantity} × ${preview.product.name}${variantLabel}`,
        created_by: this.userId,
      }});
      return { ...preview, production_id: productionId, completed_at: new Date() };
    });
  }

  async getProductionHistory(limit = 25) {
    const take = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 25;
    const outputs = await this.prisma.warehouse_stock_movements.findMany({
      where: {
        reference_type: 'PRODUCTION_ORDER',
        movement_type: 'PRODUCTION_OUTPUT',
        deleted_at: null,
      },
      include: {
        products: { select: { id: true, name: true, sku: true } },
        warehouses: { select: { id: true, name: true, code: true } },
      },
      orderBy: { created_at: 'desc' },
      take,
    });
    return outputs.map(output => ({
      id: output.reference_id,
      product: output.products,
      warehouse: output.warehouses,
      quantity: Number(output.quantity),
      created_at: output.created_at,
      created_by: output.created_by,
    }));
  }

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private get userId(): string | undefined {
    return requestContext.getStore()?.userId;
  }

  async getCommercialAvailability(filters: { search?: string; days?: number; page?: number; limit?: number }) {
    const days = Number.isFinite(filters.days) ? Math.min(Math.max(filters.days!, 0), 365) : 30;
    const page = Number.isFinite(filters.page) ? Math.max(filters.page!, 1) : 1;
    const limit = Number.isFinite(filters.limit) ? Math.min(Math.max(filters.limit!, 1), 100) : 25;
    const search = filters.search?.trim();
    const where: any = {
      deleted_at: null,
      active: true,
      manages_stock: true,
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
    };

    const [total, products] = await Promise.all([
      this.prisma.products.count({ where }),
      this.prisma.products.findMany({
        where,
        select: {
          id: true,
          name: true,
          sku: true,
          unit: { select: { symbol: true } },
          warehouse_stock: {
            where: { deleted_at: null },
            select: {
              warehouse_id: true,
              quantity: true,
              reserved_quantity: true,
              warehouses: { select: { id: true, name: true, code: true, is_virtual: true, active: true, deleted_at: true } },
            },
          },
        },
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const transitWarehouseIds = [...new Set(products.flatMap(product =>
      product.warehouse_stock
        .filter(stock => stock.warehouses.is_virtual)
        .map(stock => stock.warehouse_id),
    ))];
    const containers = transitWarehouseIds.length
      ? await this.prisma.international_containers.findMany({
          where: { transit_warehouse_id: { in: transitWarehouseIds }, deleted_at: null },
          select: {
            id: true,
            operation_id: true,
            container_number: true,
            status: true,
            estimated_arrival_date: true,
            actual_arrival_date: true,
            transit_warehouse_id: true,
            operation: {
              select: {
                estimated_arrival_date: true,
                actual_arrival_date: true,
              },
            },
          },
        })
      : [];
    type TransitContainer = (typeof containers)[number];
    const containerByWarehouse = new Map<string, TransitContainer>();
    for (const container of containers) {
      if (container.transit_warehouse_id) {
        containerByWarehouse.set(container.transit_warehouse_id, container);
      }
    }
    const horizon = new Date();
    horizon.setDate(horizon.getDate() + days);

    const data = products.map(product => {
      const activeStock = product.warehouse_stock.filter(stock => stock.warehouses.active && !stock.warehouses.deleted_at);
      const physicalRows = activeStock.filter(stock => !stock.warehouses.is_virtual);
      const transitRows = activeStock.filter(stock => stock.warehouses.is_virtual && containerByWarehouse.has(stock.warehouse_id));
      const number = (value: unknown) => Number(value ?? 0);
      const available = (row: any) => Math.max(number(row.quantity) - number(row.reserved_quantity), 0);
      const physicalStock = physicalRows.reduce((sum, row) => sum + number(row.quantity), 0);
      const transitStock = transitRows.reduce((sum, row) => sum + number(row.quantity), 0);
      const reservedPhysical = physicalRows.reduce((sum, row) => sum + number(row.reserved_quantity), 0);
      const reservedTransit = transitRows.reduce((sum, row) => sum + number(row.reserved_quantity), 0);
      const reservedTotal = reservedPhysical + reservedTransit;
      const availableNow = physicalRows.reduce((sum, row) => sum + available(row), 0);
      const arrivals = transitRows.map(row => {
        const container = containerByWarehouse.get(row.warehouse_id)!;
        const hasContainerArrivalDate = Boolean(
          container.actual_arrival_date ?? container.estimated_arrival_date,
        );
        const actualArrivalDate = container.actual_arrival_date
          ?? (!hasContainerArrivalDate ? container.operation.actual_arrival_date : null);
        const estimatedArrivalDate = container.estimated_arrival_date
          ?? (!hasContainerArrivalDate ? container.operation.estimated_arrival_date : null);
        const arrivalDate = actualArrivalDate ?? estimatedArrivalDate;
        return {
          container_id: container.id,
          operation_id: container.operation_id,
          container_number: container.container_number,
          status: container.status,
          estimated_arrival_date: estimatedArrivalDate,
          actual_arrival_date: actualArrivalDate,
          arrival_date_source: arrivalDate
            ? (hasContainerArrivalDate ? 'CONTAINER' : 'OPERATION')
            : null,
          quantity: number(row.quantity),
          reserved: number(row.reserved_quantity),
          available_on_arrival: available(row),
          within_window: Boolean(arrivalDate && new Date(arrivalDate) <= horizon),
        };
      }).sort((a, b) => {
        const aDate = a.actual_arrival_date ?? a.estimated_arrival_date;
        const bDate = b.actual_arrival_date ?? b.estimated_arrival_date;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return new Date(aDate).getTime() - new Date(bDate).getTime();
      });

      const arrivingWithinDays = arrivals
        .filter(arrival => arrival.within_window)
        .reduce((sum, arrival) => sum + arrival.available_on_arrival, 0);

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        unit: product.unit?.symbol ?? 'u.',
        physical_stock: physicalStock,
        reserved_total: reservedTotal,
        reserved_physical: reservedPhysical,
        reserved_transit: reservedTransit,
        available_now: availableNow,
        transit_stock: transitStock,
        arriving_within_days: arrivingWithinDays,
        available_within_days: availableNow + arrivingWithinDays,
        warehouses: physicalRows.map(row => ({
          id: row.warehouses.id,
          name: row.warehouses.name,
          code: row.warehouses.code,
          quantity: number(row.quantity),
          reserved: number(row.reserved_quantity),
          available: available(row),
        })),
        arrivals,
      };
    });

    return { data, meta: { total, page, limit, pages: Math.ceil(total / limit), days } };
  }

  async getStockByWarehouse(warehouseId: string) {
    return this.prisma.warehouse_stock.findMany({
      where: { warehouse_id: warehouseId },
      include: { products: true },
      orderBy: { updated_at: 'desc' },
    });
  }

  async getMovements(warehouseId: string) {
    const movements = await this.prisma.warehouse_stock_movements.findMany({
      where: { warehouse_id: warehouseId },
      include: {
        products: true,
      },
      orderBy: { created_at: 'desc' },
    });

    // Resolver nombres de usuarios desde public.users
    const userIds = [...new Set(movements.map((m) => m.created_by).filter(Boolean))] as string[];

    let userMap = new Map<string, string>();
    if (userIds.length > 0) {
      const publicPrisma = this.db.getDefaultClient();
      const users = await publicPrisma.users.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true },
      });
      userMap = new Map(users.map((u) => [u.id, u.name]));
    }

    // Resolver depósitos vinculados (para transferencias)
    const linkedMovementIds = movements
      .filter((m) => m.reference_id && m.movement_type === 'TRANSFER')
      .map((m) => m.reference_id!) as string[];

    let linkedWarehouseMap = new Map<string, { id: string; name: string }>();
    if (linkedMovementIds.length > 0) {
      const linkedMovements = await this.prisma.warehouse_stock_movements.findMany({
        where: { id: { in: linkedMovementIds } },
        select: { id: true, warehouse_id: true },
      });

      const linkedWarehouseIds = [...new Set(linkedMovements.map((m) => m.warehouse_id))];

      if (linkedWarehouseIds.length > 0) {
        const warehouses = await this.prisma.warehouses.findMany({
          where: { id: { in: linkedWarehouseIds } },
          select: { id: true, name: true },
        });

        const warehouseMap = new Map(warehouses.map((w) => [w.id, w.name]));

        for (const lm of linkedMovements) {
          linkedWarehouseMap.set(lm.id, {
            id: lm.warehouse_id,
            name: warehouseMap.get(lm.warehouse_id) ?? 'Desconocido',
          } as { id: string; name: string });
        }
      }
    }

    // Calcular saldo anterior para cada movimiento
    const productIds = [...new Set(movements.map((m) => m.product_id))];
    const currentStock = await this.prisma.warehouse_stock.findMany({
      where: {
        warehouse_id: warehouseId,
        product_id: { in: productIds },
      },
    });

    const stockMap = new Map<string, number>();
    for (const s of currentStock) {
      stockMap.set(s.product_id, Number(s.quantity));
    }

    const result = movements.map((m) => {
      const currentQty = stockMap.get(m.product_id) ?? 0;
      const moveQty = Number(m.quantity);

      const balanceBefore = currentQty;

      if (m.direction === 'IN') {
        stockMap.set(m.product_id, currentQty - moveQty);
      } else {
        stockMap.set(m.product_id, currentQty + moveQty);
      }

      // Resolver depósito vinculado
      const linkedWarehouse = m.reference_id ? linkedWarehouseMap.get(m.reference_id) : null;

      return {
        ...m,
        created_by_name: m.created_by ? userMap.get(m.created_by) ?? null : null,
        balance_before: balanceBefore,
        linked_warehouse_id: linkedWarehouse?.id ?? null,
        linked_warehouse_name: linkedWarehouse?.name ?? null,
      };
    });

    return result;
  }

  async createMovement(dto: CreateStockMovementDto) {
    return this.prisma.$transaction(async (tx) => {
      const qty = new Prisma.Decimal(dto.quantity);
      const signedQty = dto.direction === 'IN' ? qty : qty.neg();

      const movement = await tx.warehouse_stock_movements.create({
        data: {
          ...dto,
          quantity: qty,
          created_by: this.userId,
        },
      });

      const stock = await tx.warehouse_stock.findUnique({
        where: {
          warehouse_id_product_id: {
            warehouse_id: dto.warehouse_id,
            product_id: dto.product_id,
          },
        },
      });

      if (!stock) {
        if (dto.direction === 'OUT') {
          throw new BadRequestException('No hay stock para descontar');
        }

        await tx.warehouse_stock.create({
          data: {
            warehouse_id: dto.warehouse_id,
            product_id: dto.product_id,
            quantity: qty,
          },
        });
      } else {
        const newQty = stock.quantity.plus(signedQty);

        if (newQty.isNegative()) {
          throw new BadRequestException('Stock negativo no permitido');
        }

        await tx.warehouse_stock.update({
          where: { id: stock.id },
          data: {
            quantity: newQty,
            updated_at: new Date(),
          },
        });
      }

      return movement;
    });
  }

  async getStockByProduct(productId: string) {
    return this.prisma.warehouse_stock.findMany({
      where: { product_id: productId },
      include: {
        products: {
          include: {
            unit: true,
          },
        },
        warehouses: {
          include: {
            units: true,
          },
        },
      },
      orderBy: { updated_at: 'desc' },
    });
  }

  async transferStock(dto: TransferStockDto) {
    return this.prisma.$transaction(async (tx) => {
      const qty = new Prisma.Decimal(dto.quantity);

      // Verificar stock en origen
      const sourceStock = await tx.warehouse_stock.findUnique({
        where: {
          warehouse_id_product_id: {
            warehouse_id: dto.from_warehouse_id,
            product_id: dto.product_id,
          },
        },
      });

      if (!sourceStock || sourceStock.quantity.lessThan(qty)) {
        throw new BadRequestException('Stock insuficiente en el depósito de origen');
      }

      // OUT en origen
      const outMovement = await tx.warehouse_stock_movements.create({
        data: {
          warehouse_id: dto.from_warehouse_id,
          product_id: dto.product_id,
          movement_type: 'TRANSFER',
          direction: 'OUT',
          quantity: qty,
          reference_type: 'STOCK_TRANSFER',
          created_by: this.userId,
        },
      });

      await tx.warehouse_stock.update({
        where: { id: sourceStock.id },
        data: {
          quantity: sourceStock.quantity.minus(qty),
          updated_at: new Date(),
        },
      });

      // IN en destino
      const inMovement = await tx.warehouse_stock_movements.create({
        data: {
          warehouse_id: dto.to_warehouse_id,
          product_id: dto.product_id,
          movement_type: 'TRANSFER',
          direction: 'IN',
          quantity: qty,
          reference_type: 'STOCK_TRANSFER',
          created_by: this.userId,
        },
      });

      // Enlazar movimientos entre sí
      await tx.warehouse_stock_movements.update({
        where: { id: outMovement.id },
        data: { reference_id: inMovement.id },
      });

      await tx.warehouse_stock_movements.update({
        where: { id: inMovement.id },
        data: { reference_id: outMovement.id },
      });

      const destStock = await tx.warehouse_stock.findUnique({
        where: {
          warehouse_id_product_id: {
            warehouse_id: dto.to_warehouse_id,
            product_id: dto.product_id,
          },
        },
      });

      if (destStock) {
        await tx.warehouse_stock.update({
          where: { id: destStock.id },
          data: {
            quantity: destStock.quantity.plus(qty),
            updated_at: new Date(),
          },
        });
      } else {
        await tx.warehouse_stock.create({
          data: {
            warehouse_id: dto.to_warehouse_id,
            product_id: dto.product_id,
            quantity: qty,
          },
        });
      }

      return { success: true };
    });
  }

  async removeStock(warehouseId: string, productId: string) {
    return this.prisma.$transaction(async (tx) => {
      const stock = await tx.warehouse_stock.findUnique({
        where: {
          warehouse_id_product_id: {
            warehouse_id: warehouseId,
            product_id: productId,
          },
        },
      });

      if (!stock) {
        throw new BadRequestException('No hay stock para eliminar');
      }

      // Crear movimiento OUT si hay stock
      if (stock.quantity.greaterThan(0)) {
        await tx.warehouse_stock_movements.create({
          data: {
            warehouse_id: warehouseId,
            product_id: productId,
            movement_type: 'REMOVAL',
            direction: 'OUT',
            quantity: stock.quantity,
            reference_type: 'STOCK_REMOVAL',
            created_by: this.userId,
          },
        });
      }

      // Eliminar el registro de stock
      await tx.warehouse_stock.delete({
        where: { id: stock.id },
      });

      return { success: true };
    });
  }
}
