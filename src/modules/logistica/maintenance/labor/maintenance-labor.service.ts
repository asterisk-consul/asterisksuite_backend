import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMaintenanceLaborDto } from './dto/maintenance-labor.dto';
import { UpdateMaintenanceLaborDto } from './dto/maintenance-labor.dto';
import { omitUndefined } from '@/common/utils/object.utils';

@Injectable()
export class MaintenanceLaborService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findByOrder(orderId: string) {
    return this.prisma.maintenance_labor.findMany({
      where: { maintenance_order_id: orderId, deleted_at: null },
      include: {
        employee: { select: { id: true, first_name: true, last_name: true } },
      },
    });
  }

  async findOne(id: string) {
    const labor = await this.prisma.maintenance_labor.findFirst({
      where: { id, deleted_at: null },
    });
    if (!labor) throw new NotFoundException('Mano de obra no encontrada');
    return labor;
  }

  async create(dto: CreateMaintenanceLaborDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.maintenance_orders.findFirst({
        where: { id: dto.maintenance_order_id, deleted_at: null },
      });
      if (!order) throw new BadRequestException('Orden de mantenimiento no encontrada');

      if (!dto.employee_id && !dto.supplier_id) {
        throw new BadRequestException('Se requiere employee_id o supplier_id');
      }

      const labor = await tx.maintenance_labor.create({
        data: {
          ...dto,
          hours: Number(dto.hours),
          hourly_cost: Number(dto.hourly_cost),
          total_cost: Number(dto.hours) * Number(dto.hourly_cost),
          created_by: userId,
        },
      });

      await this.recalculateOrderCosts(tx, dto.maintenance_order_id);

      return labor;
    });
  }

  async update(id: string, dto: UpdateMaintenanceLaborDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await this.findOne(id);

      const hours = dto.hours ? Number(dto.hours) : Number(existing.hours);
      const hourlyCost = dto.hourly_cost ? Number(dto.hourly_cost) : Number(existing.hourly_cost);

      await tx.maintenance_labor.update({
        where: { id },
        data: omitUndefined({
          employee_id: dto.employee_id,
          supplier_id: dto.supplier_id,
          description: dto.description,
          hours,
          hourly_cost: hourlyCost,
          total_cost: hours * hourlyCost,
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

      await tx.maintenance_labor.update({
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
