import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMaintenancePartDto } from './dto/maintenance-part.dto';
import { UpdateMaintenancePartDto } from './dto/maintenance-part.dto';
import { omitUndefined } from '@/common/utils/object.utils';

@Injectable()
export class MaintenancePartsService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findByOrder(orderId: string) {
    return this.prisma.maintenance_parts.findMany({
      where: { maintenance_order_id: orderId, deleted_at: null },
      include: { product: { select: { id: true, name: true, sku: true, unit: true } } },
    });
  }

  async findOne(id: string) {
    const part = await this.prisma.maintenance_parts.findFirst({
      where: { id, deleted_at: null },
      include: { product: { select: { id: true, name: true, sku: true, unit: true } } },
    });
    if (!part) throw new NotFoundException('Repuesto no encontrado');
    return part;
  }

  async create(dto: CreateMaintenancePartDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.maintenance_orders.findFirst({
        where: { id: dto.maintenance_order_id, deleted_at: null },
      });
      if (!order) throw new BadRequestException('Orden de mantenimiento no encontrada');

      const stock = await tx.warehouse_stock.findUnique({
        where: { warehouse_id_product_id: { warehouse_id: dto.warehouse_id, product_id: dto.product_id } },
      });

      if (!stock || Number(stock.quantity) < Number(dto.quantity)) {
        throw new BadRequestException('Stock insuficiente en el depósito seleccionado');
      }

      const part = await tx.maintenance_parts.create({
        data: {
          ...dto,
          quantity: Number(dto.quantity),
          unit_cost: Number(dto.unit_cost),
          total_cost: Number(dto.quantity) * Number(dto.unit_cost),
          created_by: userId,
        },
      });

      await tx.warehouse_stock.update({
        where: { warehouse_id_product_id: { warehouse_id: dto.warehouse_id, product_id: dto.product_id } },
        data: { quantity: { decrement: Number(dto.quantity) }, updated_by: userId },
      });

      await tx.warehouse_stock_movements.create({
        data: {
          warehouse_id: dto.warehouse_id,
          product_id: dto.product_id,
          movement_type: 'MAINTENANCE_CONSUMPTION',
          direction: 'OUT',
          quantity: Number(dto.quantity),
          reference_type: 'MAINTENANCE_ORDER',
          reference_id: dto.maintenance_order_id,
          notes: `Consumo por mantenimiento ${order.number}`,
          created_by: userId,
        },
      });

      await this.recalculateOrderCosts(tx, dto.maintenance_order_id);

      return part;
    });
  }

  async update(id: string, dto: UpdateMaintenancePartDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await this.findOne(id);
      const oldQuantity = Number(existing.quantity);
      const oldUnitCost = Number(existing.unit_cost);

      const newQuantity = dto.quantity ? Number(dto.quantity) : oldQuantity;
      const newUnitCost = dto.unit_cost ? Number(dto.unit_cost) : oldUnitCost;

      if (dto.warehouse_id && dto.warehouse_id !== existing.warehouse_id) {
        // Mover stock entre depósitos
        const newStock = await tx.warehouse_stock.findUnique({
          where: { warehouse_id_product_id: { warehouse_id: dto.warehouse_id, product_id: existing.product_id } },
        });
        if (!newStock || Number(newStock.quantity) < newQuantity) {
          throw new BadRequestException('Stock insuficiente en el depósito de destino');
        }

        await tx.warehouse_stock.update({
          where: { warehouse_id_product_id: { warehouse_id: existing.warehouse_id, product_id: existing.product_id } },
          data: { quantity: { increment: oldQuantity }, updated_by: userId },
        });

        await tx.warehouse_stock.update({
          where: { warehouse_id_product_id: { warehouse_id: dto.warehouse_id, product_id: existing.product_id } },
          data: { quantity: { decrement: newQuantity }, updated_by: userId },
        });
      } else if (newQuantity !== oldQuantity) {
        const diff = newQuantity - oldQuantity;
        await tx.warehouse_stock.update({
          where: { warehouse_id_product_id: { warehouse_id: existing.warehouse_id, product_id: existing.product_id } },
          data: { quantity: { decrement: diff }, updated_by: userId },
        });
      }

      await tx.maintenance_parts.update({
        where: { id },
        data: omitUndefined({
          quantity: newQuantity,
          unit_cost: newUnitCost,
          total_cost: newQuantity * newUnitCost,
          warehouse_id: dto.warehouse_id,
          document_id: dto.document_id,
          updated_by: userId,
        }),
      });

      await this.recalculateOrderCosts(tx, existing.maintenance_order_id);
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await this.findOne(id);

      await tx.warehouse_stock.update({
        where: { warehouse_id_product_id: { warehouse_id: existing.warehouse_id, product_id: existing.product_id } },
        data: { quantity: { increment: Number(existing.quantity) }, updated_by: userId },
      });

      await tx.warehouse_stock_movements.create({
        data: {
          warehouse_id: existing.warehouse_id,
          product_id: existing.product_id,
          movement_type: 'MAINTENANCE_RETURN',
          direction: 'IN',
          quantity: Number(existing.quantity),
          reference_type: 'MAINTENANCE_ORDER',
          reference_id: existing.maintenance_order_id,
          notes: `Devolución por eliminación de repuesto en mantenimiento`,
          created_by: userId,
        },
      });

      await tx.maintenance_parts.update({
        where: { id },
        data: { deleted_at: new Date(), deleted_by: userId },
      });

      await this.recalculateOrderCosts(tx, existing.maintenance_order_id);
    });
  }

  private async recalculateOrderCosts(tx: any, orderId: string) {
    const parts = await tx.maintenance_parts.aggregate({
      where: { maintenance_order_id: orderId, deleted_at: null },
      _sum: { total_cost: true },
    });

    const labor = await tx.maintenance_labor.aggregate({
      where: { maintenance_order_id: orderId, deleted_at: null },
      _sum: { total_cost: true },
    });

    const services = await tx.maintenance_services.aggregate({
      where: { maintenance_order_id: orderId, deleted_at: null },
      _sum: { total_cost: true },
    });

    const partsCost = Number(parts._sum.total_cost || 0);
    const laborCost = Number(labor._sum.total_cost || 0);
    const servicesCost = Number(services._sum.total_cost || 0);
    const actualCost = partsCost + laborCost + servicesCost;

    await tx.maintenance_orders.update({
      where: { id: orderId },
      data: { parts_cost: partsCost, labor_cost: laborCost, services_cost: servicesCost, actual_cost: actualCost },
    });
  }
}
