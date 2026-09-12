import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateMaintenancePlanDto,
  UpdateMaintenancePlanDto,
  AssignPlanToAssetDto,
  CheckDueMaintenancesDto,
} from './dto/maintenance-plan.dto';
import {
  MaintenanceAssetType,
  MaintenanceCategory,
  MaintenanceType,
  MaintenancePriority,
  PlanIntervalType,
  MaintenanceStatus,
} from '../enums/maintenance.enums';
import { omitUndefined } from '@/common/utils/object.utils';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';

@Injectable()
export class MaintenancePlansService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findAll() {
    return this.prisma.maintenance_plans.findMany({
      where: { deleted_at: null },
      include: {
        assets: {
          where: { deleted_at: null },
          include: {
            plan: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.maintenance_plans.findFirst({
      where: { id, deleted_at: null },
      include: {
        assets: {
          where: { deleted_at: null },
        },
      },
    });
    if (!plan) throw new NotFoundException('Plan de mantenimiento no encontrado');
    return plan;
  }

  async create(dto: CreateMaintenancePlanDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const plan = await tx.maintenance_plans.create({
        data: {
          ...dto,
          company_id: this.getCompanyId(),
          estimated_hours: dto.estimated_hours ? Number(dto.estimated_hours) : null,
          estimated_cost: dto.estimated_cost ? Number(dto.estimated_cost) : null,
          default_tasks: dto.default_tasks,
          created_by: userId,
        },
      });

      if (dto.default_tasks?.length) {
        // Las tareas por defecto se almacenan en JSON, se expanden al generar órdenes
      }

      return plan;
    });
  }

  async update(id: string, dto: UpdateMaintenancePlanDto, userId: string) {
    await this.findOne(id);

    return this.prisma.maintenance_plans.update({
      where: { id },
      data: omitUndefined({
        ...dto,
        estimated_hours: dto.estimated_hours ? Number(dto.estimated_hours) : undefined,
        estimated_cost: dto.estimated_cost ? Number(dto.estimated_cost) : undefined,
        default_tasks: dto.default_tasks,
        updated_by: userId,
      }),
    });
  }

  async assignToAsset(dto: AssignPlanToAssetDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const plan = await tx.maintenance_plans.findFirst({
        where: { id: dto.plan_id, deleted_at: null },
      });
      if (!plan) throw new BadRequestException('Plan no encontrado');

      const existing = await tx.maintenance_plan_assets.findFirst({
        where: { plan_id: dto.plan_id, asset_id: dto.asset_id, deleted_at: null },
      });
      if (existing) throw new BadRequestException('El plan ya está asignado a este activo');

      const nextDue = this.calculateNextDue(plan, null, null);

      return tx.maintenance_plan_assets.create({
        data: {
          plan_id: dto.plan_id,
          asset_id: dto.asset_id,
          next_due_at: nextDue.nextDueAt,
          next_due_odometer: nextDue.nextDueOdometer,
          created_by: userId,
        },
      });
    });
  }

  async unassignFromAsset(planId: string, assetId: string, userId: string) {
    return this.prisma.maintenance_plan_assets.update({
      where: { plan_id_asset_id: { plan_id: planId, asset_id: assetId } },
      data: { deleted_at: new Date(), deleted_by: userId },
    });
  }

  async checkDueMaintenances(dto: CheckDueMaintenancesDto) {
    const where: any = { deleted_at: null, active: true };
    if (dto.vehicle_id) where.asset_id = dto.vehicle_id;

    const planAssets = await this.prisma.maintenance_plan_assets.findMany({
      where,
      include: { plan: true },
    });

    const now = dto.as_of_date ? new Date(dto.as_of_date) : new Date();
    const due: any[] = [];

    for (const pa of planAssets) {
      let isDue = false;
      let reason = '';

      if (pa.plan.interval_type === PlanIntervalType.INTERVAL_DAYS && pa.next_due_at && pa.next_due_at <= now) {
        isDue = true;
        reason = `Vencido por días (${pa.next_due_at.toLocaleDateString()})`;
      } else if (pa.plan.interval_type === PlanIntervalType.INTERVAL_MONTHS && pa.next_due_at && pa.next_due_at <= now) {
        isDue = true;
        reason = `Vencido por meses (${pa.next_due_at.toLocaleDateString()})`;
      } else if (pa.plan.interval_type === PlanIntervalType.FIXED_DATE && pa.plan.fixed_date && pa.plan.fixed_date <= now) {
        isDue = true;
        reason = `Fecha fija vencida`;
      }

      // Para intervalos por KM, necesitaríamos el kilometraje actual del vehículo
      // Esto se puede integrar con el módulo de trips o última orden de mantenimiento

      if (isDue) {
        due.push({
          plan_asset: pa,
          plan: pa.plan,
          reason,
        });
      }
    }

    return due;
  }

  async generateDueOrders(dto: CheckDueMaintenancesDto, userId: string) {
    const due = await this.checkDueMaintenances(dto);
    const created: any[] = [];

    for (const d of due) {
      const order = await this.prisma.$transaction(async (tx) => {
        const sequence = await this.getNextSequenceNumber(tx, 'MAINTENANCE_ORDER', userId);
        const number = `MO-${String(sequence).padStart(6, '0')}`;

        const tasks = d.plan.default_tasks as any[] || [];

        const order = await tx.maintenance_orders.create({
          data: {
            company_id: this.getCompanyId(),
            number,
            asset_type: d.plan.asset_type,
            asset_id: d.plan_asset.asset_id,
            vehicle_id: d.plan.asset_type === 'VEHICLE' ? d.plan_asset.asset_id : null,
            category: d.plan.category,
            maintenance_type: d.plan.maintenance_type,
            priority: d.plan.priority,
            status: MaintenanceStatus.SCHEDULED,
            title: d.plan.name,
            description: `Mantenimiento preventivo generado automáticamente desde plan: ${d.plan.name}`,
            scheduled_at: new Date(),
            reported_by: userId,
            estimated_hours: d.plan.estimated_hours,
            estimated_cost: d.plan.estimated_cost,
            created_by: userId,
          },
        });

        if (tasks.length) {
          await tx.maintenance_tasks.createMany({
            data: tasks.map((t) => ({
              maintenance_order_id: order.id,
              description: t.description,
              estimated_hours: t.estimated_hours ? Number(t.estimated_hours) : null,
              created_by: userId,
            })),
          });
        }

        await tx.maintenance_status_history.create({
          data: {
            maintenance_order_id: order.id,
            from_status: null,
            to_status: MaintenanceStatus.SCHEDULED,
            changed_by: userId,
            comment: 'Orden generada automáticamente por plan preventivo',
          },
        });

        // Actualizar next_due
        const nextDue = this.calculateNextDue(d.plan, new Date(), null);
        await tx.maintenance_plan_assets.update({
          where: { plan_id_asset_id: { plan_id: d.plan.id, asset_id: d.plan_asset.asset_id } },
          data: {
            last_executed_at: new Date(),
            next_due_at: nextDue.nextDueAt,
            next_due_odometer: nextDue.nextDueOdometer,
          },
        });

        return order;
      });

      created.push(order);
    }

    return { generated: created.length, orders: created };
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    return this.prisma.maintenance_plans.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: userId },
    });
  }

  private calculateNextDue(plan: any, lastExecutedAt: Date | null, lastOdometer: number | null) {
    let nextDueAt: Date | null = null;
    let nextDueOdometer: number | null = null;

    if (plan.interval_type === PlanIntervalType.INTERVAL_DAYS && plan.interval_days) {
      const base = lastExecutedAt || new Date();
      nextDueAt = new Date(base.getTime() + plan.interval_days * 24 * 60 * 60 * 1000);
    } else if (plan.interval_type === PlanIntervalType.INTERVAL_MONTHS && plan.interval_months) {
      const base = lastExecutedAt || new Date();
      nextDueAt = new Date(base);
      nextDueAt.setMonth(nextDueAt.getMonth() + plan.interval_months);
    } else if (plan.interval_type === PlanIntervalType.FIXED_DATE && plan.fixed_date) {
      nextDueAt = new Date(plan.fixed_date);
      // Para fecha fija, el próximo año
      nextDueAt.setFullYear(nextDueAt.getFullYear() + 1);
    } else if (plan.interval_type === PlanIntervalType.INTERVAL_KM && plan.interval_km) {
      nextDueOdometer = (lastOdometer || 0) + plan.interval_km;
    }

    return { nextDueAt, nextDueOdometer };
  }

  private async getNextSequenceNumber(tx: any, sequenceName: string, userId: string): Promise<number> {
    const sequence = await tx.document_sequences.findFirst({
      where: { name: sequenceName, active: true, deleted_at: null },
    });
    if (!sequence) throw new BadRequestException(`Secuencia ${sequenceName} no configurada`);

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
