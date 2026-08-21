import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { requestContext } from '@/common/context/request-context';

@Injectable()
export class StockService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private get userId(): string | undefined {
    return requestContext.getStore()?.userId;
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
