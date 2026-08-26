import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMaintenanceServiceDto } from './dto/maintenance-service.dto';
import { UpdateMaintenanceServiceDto } from './dto/maintenance-service.dto';
import { omitUndefined } from '@/common/utils/object.utils';

@Injectable()
export class MaintenanceServicesService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findByOrder(orderId: string) {
    return this.prisma.maintenance_services.findMany({
      where: { maintenance_order_id: orderId, deleted_at: null },
      include: { supplier: { select: { id: true, name: true } }, document: { select: { id: true, number: true } } },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.maintenance_services.findFirst({
      where: { id, deleted_at: null },
    });
    if (!service) throw new NotFoundException('Servicio externo no encontrado');
    return service;
  }

  async create(dto: CreateMaintenanceServiceDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.maintenance_orders.findFirst({
        where: { id: dto.maintenance_order_id, deleted_at: null },
      });
      if (!order) throw new BadRequestException('Orden de mantenimiento no encontrada');

      const service = await tx.maintenance_services.create({
        data: {
          ...dto,
          quantity: Number(dto.quantity),
          unit_cost: Number(dto.unit_cost),
          total_cost: Number(dto.quantity) * Number(dto.unit_cost),
          created_by: userId,
        },
      });

      await this.recalculateOrderCosts(tx, dto.maintenance_order_id);

      return service;
    });
  }

  async update(id: string, dto: UpdateMaintenanceServiceDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await this.findOne(id);

      const quantity = dto.quantity ? Number(dto.quantity) : Number(existing.quantity);
      const unitCost = dto.unit_cost ? Number(dto.unit_cost) : Number(existing.unit_cost);

      await tx.maintenance_services.update({
        where: { id },
        data: omitUndefined({
          description: dto.description,
          quantity,
          unit_cost: unitCost,
          total_cost: quantity * unitCost,
          supplier_id: dto.supplier_id,
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

      await tx.maintenance_services.update({
        where: { id },
        data: { deleted_at: new Date(), deleted_by: userId },
      });

      await this.recalculateOrderCosts(tx, existing.maintenance_order_id);
    });
  }

  private async recalculateOrderCosts(tx: any, orderId: string) {
    const [parts, labor, services] = await Promise.all([
      tx.maintenance_parts.aggregate({
        where: { maintenance_order_id: orderId, deleted_at: null },
        _sum: { total_cost: true },
      }),
      tx.maintenance_labor.aggregate({
        where: { maintenance_order_id: orderId, deleted_at: null },
        _sum: { total_cost: true },
      }),
      tx.maintenance_services.aggregate({
        where: { maintenance_order_id: orderId, deleted_at: null },
        _sum: { total_cost: true },
      }),
    ]);

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
