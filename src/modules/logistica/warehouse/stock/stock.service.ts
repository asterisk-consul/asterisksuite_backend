import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async getStockByWarehouse(warehouseId: string) {
    return this.prisma.warehouse_stock.findMany({
      where: { warehouse_id: warehouseId },
      include: { products: true },
      orderBy: { updated_at: 'desc' },
    });
  }

  async getMovements(warehouseId: string) {
    return this.prisma.warehouse_stock_movements.findMany({
      where: { warehouse_id: warehouseId },
      include: {
        products: true,
        users: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async createMovement(dto: CreateStockMovementDto) {
    return this.prisma.$transaction(async (tx) => {
      const qty = new Prisma.Decimal(dto.quantity);
      const signedQty = dto.direction === 'IN' ? qty : qty.neg();

      const movement = await tx.warehouse_stock_movements.create({
        data: {
          ...dto,
          quantity: qty,
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
}
