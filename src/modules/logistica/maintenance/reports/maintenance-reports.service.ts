import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { MaintenanceStatus, MaintenanceCategory, MaintenanceType, MaintenancePriority } from '../enums/maintenance.enums';

@Injectable()
export class MaintenanceReportsService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async byVehicle(vehicleId?: string, dateFrom?: Date, dateTo?: Date) {
    const where: any = { deleted_at: null };
    if (vehicleId) where.vehicle_id = vehicleId;
    if (dateFrom || dateTo) {
      where.completed_at = {};
      if (dateFrom) where.completed_at.gte = new Date(dateFrom);
      if (dateTo) where.completed_at.lte = new Date(dateTo);
    }

    const orders = await this.prisma.maintenance_orders.findMany({
      where,
      include: {
        vehicle: { select: { id: true, plate: true, brand: true, model: true } },
        parts: { where: { deleted_at: null }, include: { product: { select: { name: true } } } },
        labor: { where: { deleted_at: null } },
        services: { where: { deleted_at: null } },
      },
    });

    const grouped = orders.reduce((acc, order) => {
      const vehicleKey = order.vehicle?.plate || 'Sin vehículo';
      if (!acc[vehicleKey]) {
        acc[vehicleKey] = {
          vehicle: order.vehicle,
          total_orders: 0,
          total_cost: 0,
          by_category: {} as Record<string, { count: number; cost: number }>,
          by_type: {} as Record<string, { count: number; cost: number }>,
          downtime_hours: 0,
        };
      }
      acc[vehicleKey].total_orders++;
      acc[vehicleKey].total_cost += Number(order.actual_cost || 0);

      const cat = order.category;
      if (!acc[vehicleKey].by_category[cat]) {
        acc[vehicleKey].by_category[cat] = { count: 0, cost: 0 };
      }
      acc[vehicleKey].by_category[cat].count++;
      acc[vehicleKey].by_category[cat].cost += Number(order.actual_cost || 0);

      const type = order.maintenance_type;
      if (!acc[vehicleKey].by_type[type]) {
        acc[vehicleKey].by_type[type] = { count: 0, cost: 0 };
      }
      acc[vehicleKey].by_type[type].count++;
      acc[vehicleKey].by_type[type].cost += Number(order.actual_cost || 0);

      if (order.vehicle_unavailable && order.unavailable_from && order.unavailable_until) {
        const diff = new Date(order.unavailable_until).getTime() - new Date(order.unavailable_from).getTime();
        acc[vehicleKey].downtime_hours += diff / (1000 * 60 * 60);
      }

      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }

  async costsByVehicle(dateFrom?: Date, dateTo?: Date) {
    const where: any = { deleted_at: null, status: 'COMPLETED', actual_cost: { not: null } };
    if (dateFrom || dateTo) {
      where.completed_at = {};
      if (dateFrom) where.completed_at.gte = new Date(dateFrom);
      if (dateTo) where.completed_at.lte = new Date(dateTo);
    }

    const orders = await this.prisma.maintenance_orders.findMany({
      where,
      include: {
        vehicle: { select: { id: true, plate: true, brand: true, model: true } },
        parts: { where: { deleted_at: null } },
        labor: { where: { deleted_at: null } },
        services: { where: { deleted_at: null } },
      },
    });

    const grouped = orders.reduce((acc, order) => {
      const vehicleKey = order.vehicle?.plate || 'Sin vehículo';
      if (!acc[vehicleKey]) {
        acc[vehicleKey] = {
          vehicle: order.vehicle,
          engine: 0,
          transmission: 0,
          brakes: 0,
          suspension: 0,
          steering: 0,
          electrical: 0,
          cooling: 0,
          lubrication: 0,
          tires: 0,
          body: 0,
          lighting: 0,
          trailer: 0,
          other: 0,
          total: 0,
        };
      }

      const cost = Number(order.actual_cost || 0);
      const catKey = order.category.toLowerCase();
      if (acc[vehicleKey].hasOwnProperty(catKey)) {
        acc[vehicleKey][catKey] += cost;
      } else {
        acc[vehicleKey].other += cost;
      }
      acc[vehicleKey].total += cost;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }

  async byCategory(dateFrom?: Date, dateTo?: Date) {
    const where: any = { deleted_at: null, status: 'COMPLETED', actual_cost: { not: null } };
    if (dateFrom || dateTo) {
      where.completed_at = {};
      if (dateFrom) where.completed_at.gte = new Date(dateFrom);
      if (dateTo) where.completed_at.lte = new Date(dateTo);
    }

    const orders = await this.prisma.maintenance_orders.findMany({
      where,
      select: { category: true, actual_cost: true },
    });

    const totalCost = orders.reduce((sum, o) => sum + Number(o.actual_cost || 0), 0);

    const grouped = orders.reduce((acc, order) => {
      const cat = order.category;
      if (!acc[cat]) {
        acc[cat] = { count: 0, cost: 0, percentage: 0 };
      }
      acc[cat].count++;
      acc[cat].cost += Number(order.actual_cost || 0);
      return acc;
    }, {} as Record<string, { count: number; cost: number; percentage: number }>);

    for (const cat of Object.keys(grouped)) {
      grouped[cat].percentage = totalCost > 0 ? (grouped[cat].cost / totalCost) * 100 : 0;
    }

    return { total: totalCost, by_category: grouped };
  }

  async byPeriod(dateFrom: Date, dateTo: Date, groupBy: 'day' | 'week' | 'month' | 'year') {
    const where: any = { deleted_at: null, status: 'COMPLETED', actual_cost: { not: null } };
    where.completed_at = { gte: dateFrom, lte: dateTo };

    const orders = await this.prisma.maintenance_orders.findMany({
      where,
      select: { completed_at: true, actual_cost: true, category: true },
    });

    const grouped = orders.reduce((acc, order) => {
      const date = new Date(order.completed_at!);
      let key: string;
      switch (groupBy) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week': {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        }
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          key = String(date.getFullYear());
          break;
      }

      if (!acc[key]) {
        acc[key] = { period: key, count: 0, cost: 0 };
      }
      acc[key].count++;
      acc[key].cost += Number(order.actual_cost || 0);
      return acc;
    }, {} as Record<string, { period: string; count: number; cost: number }>);

    return Object.values(grouped)
      .map((g: any) => ({ period: g.period, count: g.count, cost: g.cost }))
      .sort((a: any, b: any) => a.period.localeCompare(b.period));
  }

  async pendingSummary() {
    const [critical, high, overdue, upcoming] = await Promise.all([
      this.prisma.maintenance_orders.count({
        where: { deleted_at: null, status: { in: ['PENDING', 'SCHEDULED'] }, priority: 'CRITICAL' },
      }),
      this.prisma.maintenance_orders.count({
        where: { deleted_at: null, status: { in: ['PENDING', 'SCHEDULED'] }, priority: 'HIGH' },
      }),
      this.prisma.maintenance_orders.count({
        where: {
          deleted_at: null,
          status: { in: ['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'WAITING_PARTS', 'WAITING_SUPPLIER'] },
          scheduled_at: { lt: new Date() },
        },
      }),
      this.prisma.maintenance_orders.count({
        where: {
          deleted_at: null,
          status: { in: ['PENDING', 'SCHEDULED'] },
          scheduled_at: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return { critical, high, overdue, upcoming };
  }

  async tireReport(tireId?: string, dateFrom?: Date, dateTo?: Date) {
    const where: any = { deleted_at: null };
    if (tireId) where.id = tireId;
    if (dateFrom || dateTo) {
      where.created_at = {};
      if (dateFrom) where.created_at.gte = new Date(dateFrom);
      if (dateTo) where.created_at.lte = new Date(dateTo);
    }

    const tires = await this.prisma.tires.findMany({
      where,
      include: {
        product: { select: { id: true, name: true, sku: true } },
        purchase_document: { select: { id: true, number: true, date: true } },
        purchase_supplier: { select: { id: true, name: true } },
        current_vehicle: { select: { id: true, plate: true } },
        current_position: { select: { id: true, position_number: true, axle: true, side: true } },
        maintenance_orders: {
          where: { deleted_at: null },
          include: {
            parts: { where: { deleted_at: null } },
            services: { where: { deleted_at: null } },
          },
        },
        movements: {
          where: { deleted_at: null, movement_type: { in: ['INSTALLATION', 'REMOVAL'] } },
          orderBy: { date: 'asc' },
        },
      },
    });

    return tires.map((tire) => {
      const movements = tire.movements || [];
      const installations = movements.filter((m) => m.movement_type === 'INSTALLATION');
      const removals = movements.filter((m) => m.movement_type === 'REMOVAL');

      let totalKm = 0;
      for (let i = 0; i < installations.length; i++) {
        const install = installations[i];
        const removal = removals.find((r) => r.date > install.date && r.vehicle_id === install.vehicle_id);
        if (install.odometer && removal?.odometer) {
          totalKm += Number(removal.odometer) - Number(install.odometer);
        }
      }

      const repairCost = tire.maintenance_orders
        .filter((o) => o.actual_cost)
        .reduce((sum, o) => sum + Number(o.actual_cost || 0), 0);

      const purchaseCost = Number(tire.purchase_unit_cost || 0);
      const retreadCost = Number(tire.total_retread_cost || 0);
      const totalCost = purchaseCost + repairCost + retreadCost;

      return {
        tire: {
          id: tire.id,
          serial_number: tire.serial_number,
          product: tire.product,
          current_vehicle: tire.current_vehicle,
          current_position: tire.current_position,
          purchase: {
            supplier: tire.purchase_supplier,
            document: tire.purchase_document,
            cost: purchaseCost,
          },
          metrics: {
            total_kilometers: totalKm,
            days_in_use: tire.days_in_use || 0,
            installation_count: tire.installation_count || 0,
            vehicle_count: tire.vehicle_count || 0,
            repair_count: tire.repair_count || 0,
            retread_count: tire.retread_count || 0,
            total_repair_cost: repairCost,
            total_retread_cost: retreadCost,
            purchase_cost: purchaseCost,
            total_cost: totalCost,
            cost_per_km: totalKm > 0 ? totalCost / totalKm : 0,
          },
        },
      };
    });
  }

  async tirePerformance(filters: {
    brand?: string;
    model?: string;
    measure?: string;
    supplier_id?: string;
    position_number?: number;
    vehicle_id?: string;
  }) {
    const tires = await this.prisma.tires.findMany({
      where: { deleted_at: null },
      include: {
        product: true,
        purchase_supplier: true,
        current_position: true,
        current_vehicle: true,
        maintenance_orders: { where: { deleted_at: null } },
        movements: {
          where: { deleted_at: null, movement_type: { in: ['INSTALLATION', 'REMOVAL'] } },
          orderBy: { date: 'asc' },
        },
      },
    });

    // Filtrar en memoria por campos que no están en BD directamente
    let filtered = tires;
    if (filters.brand) filtered = filtered.filter((t) => t.product?.name?.toLowerCase().includes(filters.brand!.toLowerCase()));
    if (filters.supplier_id) filtered = filtered.filter((t) => t.purchase_supplier_id === filters.supplier_id);
    if (filters.position_number) filtered = filtered.filter((t) => t.current_position?.position_number === filters.position_number);
    if (filters.vehicle_id) filtered = filtered.filter((t) => t.current_vehicle_id === filters.vehicle_id);

    const grouped = filtered.reduce((acc, tire) => {
      const key = `${tire.product?.name || 'Desconocido'}`;
      if (!acc[key]) {
        acc[key] = {
          product_name: key,
          brand: tire.product?.name || '',
          total_tires: 0,
          total_km: 0,
          total_cost: 0,
          avg_km: 0,
          avg_cost_per_km: 0,
        };
      }
      acc[key].total_tires++;

      const movements = tire.movements || [];
      const installations = movements.filter((m) => m.movement_type === 'INSTALLATION');
      const removals = movements.filter((m) => m.movement_type === 'REMOVAL');

      let tireKm = 0;
      for (let i = 0; i < installations.length; i++) {
        const install = installations[i];
        const removal = removals.find((r) => r.date > install.date && r.vehicle_id === install.vehicle_id);
        if (install.odometer && removal?.odometer) {
          tireKm += Number(removal.odometer) - Number(install.odometer);
        }
      }

      const repairCost = tire.maintenance_orders
        .filter((o) => o.actual_cost)
        .reduce((sum, o) => sum + Number(o.actual_cost || 0), 0);

      const totalCost = Number(tire.purchase_unit_cost || 0) + repairCost + Number(tire.total_retread_cost || 0);

      acc[key].total_km += tireKm;
      acc[key].total_cost += totalCost;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).map((g: any) => ({
      ...g,
      avg_km: g.total_tires > 0 ? g.total_km / g.total_tires : 0,
      avg_cost_per_km: g.total_km > 0 ? g.total_cost / g.total_km : 0,
    }));
  }

  async tireByPosition(vehicleType?: string) {
    const positions = await this.prisma.vehicle_tire_positions.findMany({
      where: { deleted_at: null },
      include: {
        vehicle: { select: { id: true, type: true, plate: true } },
        position_history: {
          where: { deleted_at: null },
          include: {
            tire: {
              select: {
                id: true,
                movements: {
                  where: { deleted_at: null, movement_type: { in: ['INSTALLATION', 'REMOVAL'] } },
                  orderBy: { date: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (vehicleType) {
      positions.filter((p) => p.vehicle.type === vehicleType);
    }

    const grouped = positions.reduce((acc, pos) => {
      const key = pos.position_number;
      if (!acc[key]) {
        acc[key] = { position: key, count: 0, total_km: 0, avg_km: 0 };
      }
      acc[key].count++;

      for (const ph of pos.position_history) {
        const tire = ph.tire;
        if (!tire) continue;
        const movements = tire.movements || [];
        const installations = movements.filter((m) => m.movement_type === 'INSTALLATION');
        const removals = movements.filter((m) => m.movement_type === 'REMOVAL');

        for (let i = 0; i < installations.length; i++) {
          const install = installations[i];
          const removal = removals.find((r) => r.date > install.date && r.vehicle_id === install.vehicle_id);
          if (install.odometer && removal?.odometer) {
            acc[key].total_km += Number(removal.odometer) - Number(install.odometer);
          }
        }
      }

      return acc;
    }, {} as Record<number, { position: number; count: number; total_km: number; avg_km: number }>);

    return Object.values(grouped).map((g: any) => ({
      ...g,
      avg_km: g.count > 0 ? g.total_km / g.count : 0,
    })).sort((a: any, b: any) => a.position - b.position);
  }

  async availability(dateFrom: Date, dateTo: Date) {
    const vehicles = await this.prisma.vehicles.findMany({
      where: { deleted_at: null, active: true },
      select: { id: true, plate: true, brand: true, model: true },
    });

    const orders = await this.prisma.maintenance_orders.findMany({
      where: {
        deleted_at: null,
        vehicle_unavailable: true,
        unavailable_from: { lte: dateTo },
        unavailable_until: { gte: dateFrom },
      },
      select: { vehicle_id: true, unavailable_from: true, unavailable_until: true },
    });

    return vehicles.map((vehicle) => {
      const vehicleOrders = orders.filter((o) => o.vehicle_id === vehicle.id);
      let totalHours = 0;
      for (const o of vehicleOrders) {
        const start = new Date(Math.max(new Date(o.unavailable_from!).getTime(), dateFrom.getTime()));
        const end = new Date(Math.min(new Date(o.unavailable_until!).getTime(), dateTo.getTime()));
        totalHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }

      const periodHours = (dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60);
      const availability = periodHours > 0 ? ((periodHours - totalHours) / periodHours) * 100 : 100;

      return {
        vehicle: { id: vehicle.id, plate: vehicle.plate, brand: vehicle.brand, model: vehicle.model },
        maintenance_count: vehicleOrders.length,
        hours_out_of_service: Math.round(totalHours),
        avg_hours_per_maintenance: vehicleOrders.length > 0 ? Math.round(totalHours / vehicleOrders.length) : 0,
        availability_percentage: Math.round(availability * 100) / 100,
      };
    });
  }
}
