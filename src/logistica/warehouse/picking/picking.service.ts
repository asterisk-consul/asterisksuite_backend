import { Injectable, BadRequestException } from '@nestjs/common';
import { LogisticaPrismaService } from 'src/prisma/prisma-logistica.service';
import { Prisma } from 'src/generated/prisma-logistica/client';
import { CreatePickingDto } from './dto/create-picking.dto';
import { TransferPalletDto } from './dto/transfer-pallet.dto';

@Injectable()
export class PickingService {
  constructor(private prisma: LogisticaPrismaService) {}

  async create(dto: CreatePickingDto) {
    return this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        const stock = await tx.warehouse_stock.findUnique({
          where: {
            warehouse_id_product_id: {
              warehouse_id: dto.warehouse_id,
              product_id: item.product_id,
            },
          },
        });

        if (!stock) {
          throw new BadRequestException('Producto sin stock');
        }

        const qty = new Prisma.Decimal(item.quantity);

        if (stock.quantity.lessThan(qty)) {
          throw new BadRequestException('Stock insuficiente');
        }

        const newQty = stock.quantity.minus(qty);

        await tx.warehouse_stock.update({
          where: { id: stock.id },
          data: { quantity: newQty },
        });

        await tx.warehouse_stock_movements.create({
          data: {
            warehouse_id: dto.warehouse_id,
            product_id: item.product_id,
            movement_type: 'PICKING',
            direction: 'OUT',
            quantity: qty,
            reference_type: 'PICKING',
            created_by: dto.created_by,
          },
        });
      }

      return { success: true };
    });
  }
  async transfer(dto: TransferPalletDto) {
    return this.prisma.$transaction(async (tx) => {
      const pallet = await tx.pallets.findUnique({
        where: { id: dto.pallet_id },
        include: { pallet_items: true },
      });

      if (!pallet) {
        throw new Error('Pallet no encontrado');
      }

      if (pallet.warehouse_id !== dto.from_warehouse_id) {
        throw new Error('El pallet no está en ese depósito');
      }

      for (const item of pallet.pallet_items) {
        const qty = new Prisma.Decimal(item.quantity);

        // OUT origen
        await tx.warehouse_stock_movements.create({
          data: {
            warehouse_id: dto.from_warehouse_id,
            product_id: item.product_id,
            movement_type: 'TRANSFER',
            direction: 'OUT',
            quantity: qty,
            created_by: dto.user_id,
          },
        });

        // IN destino
        await tx.warehouse_stock_movements.create({
          data: {
            warehouse_id: dto.to_warehouse_id,
            product_id: item.product_id,
            movement_type: 'TRANSFER',
            direction: 'IN',
            quantity: qty,
            created_by: dto.user_id,
          },
        });
      }

      await tx.pallets.update({
        where: { id: dto.pallet_id },
        data: { warehouse_id: dto.to_warehouse_id },
      });

      return { transferred: true };
    });
  }
}
