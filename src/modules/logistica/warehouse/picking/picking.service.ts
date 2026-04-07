import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import { CreatePickingDto } from './dto/create-picking.dto';
import { CreatePickingOrderDto } from './dto/create-picking-order.dto';
import { ExecutePickingDto } from './dto/execute-picking-order.dto';
import { TransferPalletDto } from './dto/transfer-pallet.dto';

@Injectable()
export class PickingService {
  constructor(private prisma: PrismaService) {}

  /* ============================================================
     CREATE SIMPLE PICKING (DESCUENTA STOCK DIRECTO)
  ============================================================ */

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

        if (!stock) throw new BadRequestException('Producto sin stock');

        const qty = new Prisma.Decimal(item.quantity);

        if (stock.quantity.lessThan(qty))
          throw new BadRequestException('Stock insuficiente');

        await tx.warehouse_stock.update({
          where: { id: stock.id },
          data: {
            quantity: stock.quantity.minus(qty),
          },
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

  /* ============================================================
     TRANSFERENCIA DE PALLET ENTRE DEPÓSITOS
  ============================================================ */

  async transfer(dto: TransferPalletDto) {
    return this.prisma.$transaction(async (tx) => {
      const pallet = await tx.pallets.findUnique({
        where: { id: dto.pallet_id },
        include: { pallet_items: true },
      });

      if (!pallet) throw new BadRequestException('Pallet no encontrado');

      if (pallet.warehouse_id !== dto.from_warehouse_id)
        throw new BadRequestException('El pallet no está en ese depósito');

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
            reference_type: 'PALLET_TRANSFER',
            reference_id: pallet.id,
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
            reference_type: 'PALLET_TRANSFER',
            reference_id: pallet.id,
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

  /* ============================================================
     EJECUTAR PICKING ORDER
  ============================================================ */

  async executePicking(dto: ExecutePickingDto) {
    return this.prisma.$transaction(async (tx) => {
      const pickingOrder = await tx.picking_orders.findUnique({
        where: { id: dto.picking_order_id },
        include: { picking_items: true },
      });

      if (!pickingOrder) throw new BadRequestException('Picking no encontrado');

      if (pickingOrder.status !== 'CREATED')
        throw new BadRequestException('Picking ya ejecutado o inválido');

      for (const source of dto.sources) {
        const qty = new Prisma.Decimal(source.quantity);

        const pickingItem = await tx.picking_items.findUnique({
          where: { id: source.picking_item_id },
        });

        if (!pickingItem)
          throw new BadRequestException('Picking item inválido');

        const pickedSoFar =
          pickingItem.quantity_picked ?? new Prisma.Decimal(0);

        const remaining = pickingItem.quantity_required.minus(pickedSoFar);

        if (remaining.lessThan(qty))
          throw new BadRequestException(
            'Cantidad supera lo requerido en el picking item',
          );

        // 1️⃣ Registrar fuente
        await tx.picking_sources.create({
          data: {
            picking_item_id: source.picking_item_id,
            pallet_id: source.pallet_id,
            quantity: qty,
          },
        });

        // 2️⃣ Actualizar cantidad pickeada
        await tx.picking_items.update({
          where: { id: source.picking_item_id },
          data: {
            quantity_picked: pickedSoFar.plus(qty),
          },
        });

        // 3️⃣ Ajustar stock físico y reservado
        const stock = await tx.warehouse_stock.findUnique({
          where: {
            warehouse_id_product_id: {
              warehouse_id: pickingOrder.warehouse_id,
              product_id: pickingItem.product_id,
            },
          },
        });

        if (!stock) throw new BadRequestException('Stock inconsistente');

        if (stock.reserved_quantity.lessThan(qty))
          throw new BadRequestException(
            'Reserva inconsistente para el producto',
          );

        await tx.warehouse_stock.update({
          where: { id: stock.id },
          data: {
            quantity: stock.quantity.minus(qty),
            reserved_quantity: stock.reserved_quantity.minus(qty),
          },
        });

        // 4️⃣ Movimiento real
        await tx.warehouse_stock_movements.create({
          data: {
            warehouse_id: pickingOrder.warehouse_id,
            product_id: pickingItem.product_id,
            movement_type: 'PICKING',
            direction: 'OUT',
            quantity: qty,
            reference_type: 'PICKING_ORDER',
            reference_id: pickingOrder.id,
            created_by: dto.user_id,
          },
        });
      }

      // 5️⃣ Validar pallet resultado
      const resultPallet = await tx.pallets.findUnique({
        where: { id: dto.result_pallet_id },
      });

      if (!resultPallet)
        throw new BadRequestException('Pallet resultado inválido');

      await tx.picking_results.create({
        data: {
          picking_order_id: dto.picking_order_id,
          pallet_id: dto.result_pallet_id,
        },
      });

      // 6️⃣ Cambiar estado
      await tx.picking_orders.update({
        where: { id: dto.picking_order_id },
        data: { status: 'COMPLETED' },
      });

      return { completed: true };
    });
  }

  /* ============================================================
     CREAR PICKING ORDER (RESERVA STOCK)
  ============================================================ */

  async createPickingOrder(dto: CreatePickingOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const pickingOrder = await tx.picking_orders.create({
        data: {
          warehouse_id: dto.warehouse_id,
          status: 'CREATED',
          created_by: dto.created_by,
          dispatch_order_id: dto.dispatch_order_id,
        },
      });

      for (const item of dto.items) {
        const qty = new Prisma.Decimal(item.quantity);

        const stock = await tx.warehouse_stock.findUnique({
          where: {
            warehouse_id_product_id: {
              warehouse_id: dto.warehouse_id,
              product_id: item.product_id,
            },
          },
        });

        if (!stock) throw new BadRequestException('Producto sin stock');

        const available = stock.quantity.minus(stock.reserved_quantity);

        if (available.lessThan(qty))
          throw new BadRequestException('Stock disponible insuficiente');

        await tx.picking_items.create({
          data: {
            picking_order_id: pickingOrder.id,
            product_id: item.product_id,
            quantity_required: qty,
            quantity_picked: new Prisma.Decimal(0),
          },
        });

        await tx.warehouse_stock.update({
          where: { id: stock.id },
          data: {
            reserved_quantity: stock.reserved_quantity.plus(qty),
          },
        });
      }

      return pickingOrder;
    });
  }
}
