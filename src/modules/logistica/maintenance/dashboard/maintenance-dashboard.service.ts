import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { MaintenanceStatus, MaintenancePriority } from '../enums/maintenance.enums';

@Injectable()
export class MaintenanceDashboardService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async getOverview() {
    const [
      ordersByStatus,
      ordersByPriority,
      costsThisMonth,
      costsThisYear,
      fleetStatus,
      overdueCount,
      criticalCount,
      waitingPartsCount,
    ] = await Promise.all([
      this.getOrdersByStatus(),
      this.getOrdersByPriority(),
      this.getCostsThisMonth(),
      this.getCostsThisYear(),
      this.getFleetStatus(),
      this.getOverdueCount(),
      this.getCriticalCount(),
      this.getWaitingPartsCount(),
    ]);

    return {
      orders: {
        by_status: ordersByStatus,
        by_priority: ordersByPriority,
        pending: ordersByStatus.PENDING || 0,
        critical: criticalCount,
        high_priority: ordersByPriority.HIGH || 0,
        in_progress: ordersByStatus.IN_PROGRESS || 0,
        waiting_parts: waitingPartsCount,
        overdue: overdueCount,
      },
      costs: {
        this_month: costsThisMonth,
        this_year: costsThisYear,
      },
      fleet: fleetStatus,
    };
  }

  async getUpcomingMaintenances(limit = 10) {
    return this.prisma.maintenance_orders.findMany({
      where: {
        deleted_at: null,
        status: { in: ['PENDING', 'SCHEDULED'] },
        scheduled_at: { not: null, gte: new Date() },
      },
      include: {
        vehicle: { select: { id: true, plate: true, brand: true, model: true } },
        tire: { select: { id: true, serial_number: true, product: { select: { name: true } } } },
      },
      orderBy: { scheduled_at: 'asc' },
      take: limit,
    });
  }

  async getOverdueMaintenances(limit = 10) {
    return this.prisma.maintenance_orders.findMany({
      where: {
        deleted_at: null,
        status: { in: ['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'WAITING_PARTS', 'WAITING_SUPPLIER'] },
        scheduled_at: { not: null, lt: new Date() },
      },
      include: {
        vehicle: { select: { id: true, plate: true, brand: true, model: true } },
        tire: { select: { id: true, serial_number: true, product: { select: { name: true } } } },
      },
      orderBy: { scheduled_at: 'asc' },
      take: limit,
    });
  }

  private async getOrdersByStatus() {
    const result = await this.prisma.maintenance_orders.groupBy({
      by: ['status'],
      where: { deleted_at: null },
      _count: { id: true },
    });
    return result.reduce((acc, curr) => ({ ...acc, [curr.status]: curr._count.id }), {});
  }

  private async getOrdersByPriority() {
    const result = await this.prisma.maintenance_orders.groupBy({
      by: ['priority'],
      where: { deleted_at: null, status: { in: ['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'WAITING_PARTS', 'WAITING_SUPPLIER'] } },
      _count: { id: true },
    });
    return result.reduce((acc, curr) => ({ ...acc, [curr.priority]: curr._count.id }), {});
  }

  private async getCostsThisMonth() {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const result = await this.prisma.maintenance_orders.aggregate({
      where: { deleted_at: null, actual_cost: { not: null }, completed_at: { gte: monthStart } },
      _sum: { actual_cost: true },
    });
    return Number(result._sum.actual_cost || 0);
  }

  private async getCostsThisYear() {
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const result = await this.prisma.maintenance_orders.aggregate({
      where: { deleted_at: null, actual_cost: { not: null }, completed_at: { gte: yearStart } },
      _sum: { actual_cost: true },
    });
    return Number(result._sum.actual_cost || 0);
  }

  private async getFleetStatus() {
    const [total, inMaintenance, outOfService] = await Promise.all([
      this.prisma.vehicles.count({ where: { deleted_at: null, active: true } }),
      this.prisma.maintenance_orders.findMany({
        where: {
          deleted_at: null,
          status: { in: ['IN_PROGRESS', 'WAITING_PARTS', 'WAITING_SUPPLIER'] },
          vehicle_unavailable: true,
        },
        distinct: ['vehicle_id'],
        select: { vehicle_id: true },
      }),
      this.prisma.vehicles.count({
        where: { deleted_at: null, active: false },
      }),
    ]);

    return {
      total_vehicles: total,
      in_maintenance: inMaintenance.length,
      out_of_service: outOfService,
      available: total - inMaintenance.length,
    };
  }

  private async getOverdueCount() {
    return this.prisma.maintenance_orders.count({
      where: {
        deleted_at: null,
        status: { in: ['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'WAITING_PARTS', 'WAITING_SUPPLIER'] },
        scheduled_at: { lt: new Date() },
      },
    });
  }

  private async getCriticalCount() {
    return this.prisma.maintenance_orders.count({
      where: {
        deleted_at: null,
        status: { in: ['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'WAITING_PARTS', 'WAITING_SUPPLIER'] },
        priority: 'CRITICAL',
      },
    });
  }

  private async getWaitingPartsCount() {
    return this.prisma.maintenance_orders.count({
      where: { deleted_at: null, status: 'WAITING_PARTS' },
    });
  }
}
