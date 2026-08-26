import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMaintenanceOrderDto } from './dto/create-maintenance-order.dto';
import { UpdateMaintenanceOrderDto } from './dto/update-maintenance-order.dto';
import { FilterMaintenanceOrdersDto } from './dto/filter-maintenance-orders.dto';
import { ChangeStatusDto, BulkUpdateStatusDto } from './dto/change-status.dto';
import { MaintenanceStatus, MaintenancePriority } from '../enums/maintenance.enums';
import { omitUndefined } from '@/common/utils/object.utils';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';

@Injectable()
export class MaintenanceOrdersService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findAll(filters: FilterMaintenanceOrdersDto) {
    const {
      date_from,
      date_to,
      vehicle_id,
      tire_id,
      category,
      maintenance_type,
      priority,
      status,
      supplier_id,
      assigned_to,
      asset_type,
      asset_id,
      page = 1,
      limit = 20,
      sort_by = 'reported_at',
      sort_order = 'desc',
    } = filters;

    const where: any = {
      deleted_at: null,
    };

    if (date_from || date_to) {
      where.reported_at = {};
      if (date_from) where.reported_at.gte = new Date(date_from);
      if (date_to) where.reported_at.lte = new Date(date_to);
    }

    if (vehicle_id) where.vehicle_id = vehicle_id;
    if (tire_id) where.tire_id = tire_id;
    if (category) where.category = category;
    if (maintenance_type) where.maintenance_type = maintenance_type;
    if (priority) where.priority = priority;
    if (status) where.status = status;
    if (supplier_id) where.supplier_id = supplier_id;
    if (assigned_to) where.assigned_to = assigned_to;
    if (asset_type) where.asset_type = asset_type;
    if (asset_id) where.asset_id = asset_id;

    const [data, total] = await Promise.all([
      this.prisma.maintenance_orders.findMany({
        where,
        include: {
          vehicle: { select: { id: true, plate: true, brand: true, model: true } },
          tire: { select: { id: true, serial_number: true, status: true } },
          supplier: { select: { id: true, name: true } },
        },
        orderBy: { [sort_by]: sort_order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.maintenance_orders.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, tx?: any) {
    const prisma = tx || this.prisma;
    const order = await prisma.maintenance_orders.findFirst({
      where: { id, deleted_at: null },
      include: {
        tasks: { where: { deleted_at: null }, orderBy: { created_at: 'asc' } },
        parts: {
          where: { deleted_at: null },
          include: { product: { select: { id: true, name: true, sku: true, unit: true } } },
        },
        labor: { where: { deleted_at: null } },
        services: {
          where: { deleted_at: null },
          include: { supplier: { select: { id: true, name: true } } },
        },
        status_history: {
          orderBy: { changed_at: 'desc' },
        },
        vehicle: { select: { id: true, plate: true, brand: true, model: true, year: true, type: true } },
        tire: { select: { id: true, serial_number: true, status: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Orden de mantenimiento no encontrada');
    }

    return order;
  }

  async getStats() {
    const [counts, costData] = await Promise.all([
      this.prisma.maintenance_orders.groupBy({
        by: ['status'],
        where: { deleted_at: null },
        _count: { id: true },
      }),
      this.prisma.maintenance_orders.aggregate({
        where: {
          deleted_at: null,
          actual_cost: { not: null },
          completed_at: {
            gte: new Date(new Date().getFullYear(), 0, 1),
          },
        },
        _sum: { actual_cost: true },
      }),
    ]);

    const stats: any = {
      total: 0,
      pending: 0,
      scheduled: 0,
      in_progress: 0,
      waiting_parts: 0,
      waiting_supplier: 0,
      completed: 0,
      cancelled: 0,
      critical: 0,
      high: 0,
      overdue: 0,
      this_month_cost: 0,
      this_year_cost: Number(costData._sum.actual_cost || 0),
    };

    for (const c of counts) {
      stats.total += c._count.id;
      const key = c.status.toLowerCase();
      if (stats.hasOwnProperty(key)) {
        stats[key] = c._count.id;
      }
    }

    const [priorityCounts, overdueCount] = await Promise.all([
      this.prisma.maintenance_orders.groupBy({
        by: ['priority'],
        where: { deleted_at: null, status: { in: ['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'WAITING_PARTS', 'WAITING_SUPPLIER'] } },
        _count: { id: true },
      }),
      this.prisma.maintenance_orders.count({
        where: {
          deleted_at: null,
          status: { in: ['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'WAITING_PARTS', 'WAITING_SUPPLIER'] },
          scheduled_at: { lt: new Date() },
        },
      }),
    ]);

    for (const p of priorityCounts) {
      const key = p.priority.toLowerCase();
      if (stats.hasOwnProperty(key)) {
        stats[key] = p._count.id;
      }
    }

    stats.overdue = overdueCount;

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthCost = await this.prisma.maintenance_orders.aggregate({
      where: { deleted_at: null, actual_cost: { not: null }, completed_at: { gte: monthStart } },
      _sum: { actual_cost: true },
    });
    stats.this_month_cost = Number(monthCost._sum.actual_cost || 0);

    return stats;
  }

  async create(dto: CreateMaintenanceOrderDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const sequence = await this.getNextSequenceNumber(tx, 'MAINTENANCE_ORDER', userId);
      const number = `MO-${String(sequence).padStart(6, '0')}`;

      const order = await tx.maintenance_orders.create({
        data: {
          company_id: this.getCompanyId(),
          number,
          asset_type: dto.asset_type,
          asset_id: dto.asset_id,
          vehicle_id: dto.vehicle_id,
          tire_id: dto.tire_id,
          category: dto.category,
          maintenance_type: dto.maintenance_type,
          priority: dto.priority ?? MaintenancePriority.MEDIUM,
          status: MaintenanceStatus.PENDING,
          title: dto.title,
          description: dto.description,
          reported_problem: dto.reported_problem,
          scheduled_at: dto.scheduled_at ? new Date(dto.scheduled_at) : null,
          odometer: dto.odometer ? Number(dto.odometer) : null,
          reported_by: dto.reported_by ?? userId,
          assigned_to: dto.assigned_to,
          supplier_id: dto.supplier_id,
          estimated_cost: dto.estimated_cost ? Number(dto.estimated_cost) : null,
          vehicle_unavailable: dto.vehicle_unavailable ?? false,
          unavailable_from: dto.unavailable_from ? new Date(dto.unavailable_from) : null,
          unavailable_until: dto.unavailable_until ? new Date(dto.unavailable_until) : null,
          notes: dto.notes,
          created_by: userId,
        },
      });

      if (dto.tasks?.length) {
        await tx.maintenance_tasks.createMany({
          data: dto.tasks.map((t) => ({
            maintenance_order_id: order.id,
            description: t.description,
            assigned_to: t.assigned_to,
            estimated_hours: t.estimated_hours ? Number(t.estimated_hours) : null,
            notes: t.notes,
            created_by: userId,
          })),
        });
      }

      if (dto.parts?.length) {
        await tx.maintenance_parts.createMany({
          data: dto.parts.map((p) => ({
            maintenance_order_id: order.id,
            product_id: p.product_id,
            warehouse_id: p.warehouse_id,
            quantity: Number(p.quantity),
            unit_cost: Number(p.unit_cost),
            total_cost: Number(p.quantity) * Number(p.unit_cost),
            created_by: userId,
          })),
        });
      }

      if (dto.labor?.length) {
        await tx.maintenance_labor.createMany({
          data: dto.labor.map((l) => ({
            maintenance_order_id: order.id,
            employee_id: l.employee_id,
            description: l.description,
            hours: Number(l.hours),
            hourly_cost: Number(l.hourly_cost),
            total_cost: Number(l.hours) * Number(l.hourly_cost),
            created_by: userId,
          })),
        });
      }

      if (dto.services?.length) {
        await tx.maintenance_services.createMany({
          data: dto.services.map((s) => ({
            maintenance_order_id: order.id,
            supplier_id: s.supplier_id,
            description: s.description,
            quantity: Number(s.quantity),
            unit_cost: Number(s.unit_cost),
            total_cost: Number(s.quantity) * Number(s.unit_cost),
            document_id: s.document_id,
            created_by: userId,
          })),
        });
      }

      await this.createStatusHistory(tx, order.id, null, MaintenanceStatus.PENDING, userId, 'Orden creada');

      return this.findOne(order.id, tx);
    });
  }

  async update(id: string, dto: UpdateMaintenanceOrderDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.maintenance_orders.findFirst({
        where: { id, deleted_at: null },
      });

      if (!existing) {
        throw new NotFoundException('Orden de mantenimiento no encontrada');
      }

      const oldStatus = existing.status;

      await tx.maintenance_orders.update({
        where: { id },
        data: omitUndefined({
          asset_type: dto.asset_type,
          asset_id: dto.asset_id,
          vehicle_id: dto.vehicle_id,
          tire_id: dto.tire_id,
          category: dto.category,
          maintenance_type: dto.maintenance_type,
          priority: dto.priority,
          status: dto.status,
          title: dto.title,
          description: dto.description,
          reported_problem: dto.reported_problem,
          diagnosis: dto.diagnosis,
          solution: dto.solution,
          scheduled_at: dto.scheduled_at ? new Date(dto.scheduled_at) : undefined,
          started_at: dto.started_at ? new Date(dto.started_at) : undefined,
          completed_at: dto.completed_at ? new Date(dto.completed_at) : undefined,
          odometer: dto.odometer ? Number(dto.odometer) : undefined,
          assigned_to: dto.assigned_to,
          supplier_id: dto.supplier_id,
          estimated_cost: dto.estimated_cost ? Number(dto.estimated_cost) : undefined,
          vehicle_unavailable: dto.vehicle_unavailable,
          unavailable_from: dto.unavailable_from ? new Date(dto.unavailable_from) : undefined,
          unavailable_until: dto.unavailable_until ? new Date(dto.unavailable_until) : undefined,
          notes: dto.notes,
          updated_by: userId,
        }),
      });

      if (dto.status && dto.status !== oldStatus) {
        await this.createStatusHistory(tx, id, oldStatus, dto.status, userId);
      }

      return this.findOne(id, tx);
    });
  }

  async changeStatus(id: string, dto: ChangeStatusDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.maintenance_orders.findFirst({
        where: { id, deleted_at: null },
      });

      if (!order) {
        throw new NotFoundException('Orden de mantenimiento no encontrada');
      }

      const validTransitions = this.getValidTransitions(order.status);
      if (!validTransitions.includes(dto.to_status)) {
        throw new BadRequestException(
          `Transición de estado inválida: ${order.status} → ${dto.to_status}`
        );
      }

      const updateData: any = {
        status: dto.to_status,
        updated_by: userId,
      };

      if (dto.to_status === MaintenanceStatus.IN_PROGRESS && !order.started_at) {
        updateData.started_at = new Date();
      }
      if (dto.to_status === MaintenanceStatus.COMPLETED && !order.completed_at) {
        updateData.completed_at = new Date();
        await this.recalculateCosts(tx, id);
      }
      if (dto.to_status === MaintenanceStatus.CANCELLED) {
        updateData.completed_at = new Date();
      }

      await tx.maintenance_orders.update({
        where: { id },
        data: updateData,
      });

      await this.createStatusHistory(tx, id, order.status, dto.to_status, userId, dto.comment);

      return this.findOne(id, tx);
    });
  }

  async bulkChangeStatus(dto: BulkUpdateStatusDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const orders = await tx.maintenance_orders.findMany({
        where: { id: { in: dto.ids }, deleted_at: null },
      });

      for (const order of orders) {
        const validTransitions = this.getValidTransitions(order.status);
        if (!validTransitions.includes(dto.to_status)) {
          throw new BadRequestException(
            `Orden ${order.number}: transición inválida ${order.status} → ${dto.to_status}`
          );
        }

        const updateData: any = { status: dto.to_status, updated_by: userId };

        if (dto.to_status === MaintenanceStatus.IN_PROGRESS && !order.started_at) {
          updateData.started_at = new Date();
        }
        if (dto.to_status === MaintenanceStatus.COMPLETED && !order.completed_at) {
          updateData.completed_at = new Date();
        }
        if (dto.to_status === MaintenanceStatus.CANCELLED) {
          updateData.completed_at = new Date();
        }

        await tx.maintenance_orders.update({
          where: { id: order.id },
          data: updateData,
        });

        await this.createStatusHistory(tx, order.id, order.status, dto.to_status, userId, dto.comment);
      }

      return { updated: orders.length };
    });
  }

  async remove(id: string, userId: string) {
    const order = await this.prisma.maintenance_orders.findFirst({
      where: { id, deleted_at: null },
    });

    if (!order) {
      throw new NotFoundException('Orden de mantenimiento no encontrada');
    }

    if (![MaintenanceStatus.PENDING, MaintenanceStatus.CANCELLED].includes(order.status)) {
      throw new BadRequestException('Solo se pueden eliminar órdenes en estado PENDING o CANCELLED');
    }

    return this.prisma.maintenance_orders.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
        active: false,
      },
    });
  }

  private async createStatusHistory(
    tx: any,
    orderId: string,
    fromStatus: MaintenanceStatus | null,
    toStatus: MaintenanceStatus,
    userId: string,
    comment?: string
  ) {
    return tx.maintenance_status_history.create({
      data: {
        maintenance_order_id: orderId,
        from_status: fromStatus,
        to_status: toStatus,
        changed_by: userId,
        comment,
      },
    });
  }

  private async recalculateCosts(tx: any, orderId: string) {
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
      data: {
        parts_cost: partsCost,
        labor_cost: laborCost,
        services_cost: servicesCost,
        actual_cost: actualCost,
      },
    });
  }

  private getValidTransitions(currentStatus: MaintenanceStatus): MaintenanceStatus[] {
    const transitions: Record<MaintenanceStatus, MaintenanceStatus[]> = {
      [MaintenanceStatus.PENDING]: [
        MaintenanceStatus.SCHEDULED,
        MaintenanceStatus.IN_PROGRESS,
        MaintenanceStatus.CANCELLED,
      ],
      [MaintenanceStatus.SCHEDULED]: [
        MaintenanceStatus.IN_PROGRESS,
        MaintenanceStatus.PENDING,
        MaintenanceStatus.CANCELLED,
      ],
      [MaintenanceStatus.IN_PROGRESS]: [
        MaintenanceStatus.WAITING_PARTS,
        MaintenanceStatus.WAITING_SUPPLIER,
        MaintenanceStatus.COMPLETED,
        MaintenanceStatus.CANCELLED,
      ],
      [MaintenanceStatus.WAITING_PARTS]: [
        MaintenanceStatus.IN_PROGRESS,
        MaintenanceStatus.CANCELLED,
      ],
      [MaintenanceStatus.WAITING_SUPPLIER]: [
        MaintenanceStatus.IN_PROGRESS,
        MaintenanceStatus.CANCELLED,
      ],
      [MaintenanceStatus.COMPLETED]: [],
      [MaintenanceStatus.CANCELLED]: [MaintenanceStatus.PENDING],
    };

    return transitions[currentStatus] || [];
  }

  private async getNextSequenceNumber(tx: any, sequenceName: string, userId: string): Promise<number> {
    const sequence = await tx.document_sequences.findFirst({
      where: { name: sequenceName, active: true, deleted_at: null },
    });

    if (!sequence) {
      throw new BadRequestException(`Secuencia ${sequenceName} no configurada`);
    }

    const nextNumber = sequence.current_number + 1;
    await tx.document_sequences.update({
      where: { id: sequence.id },
      data: { current_number: nextNumber, updated_by: userId },
    });

    return nextNumber;
  }

  private getCompanyId(): string {
    const id = getCurrentCompanyId();
    if (!id) throw new BadRequestException('No se pudo resolver la empresa actual');
    return id;
  }
}
