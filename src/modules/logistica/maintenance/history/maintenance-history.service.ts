import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { MaintenanceAssetType } from '../enums/maintenance.enums';

@Injectable()
export class MaintenanceHistoryService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async getVehicleHistory(vehicleId: string) {
    const [orders, tires, plans] = await Promise.all([
      this.prisma.maintenance_orders.findMany({
        where: { vehicle_id: vehicleId, deleted_at: null },
        include: {
          tasks: { where: { deleted_at: null } },
          parts: { where: { deleted_at: null }, include: { product: { select: { name: true } } } },
          labor: { where: { deleted_at: null } },
          services: { where: { deleted_at: null }, include: { supplier: { select: { name: true } } } },
          status_history: { orderBy: { changed_at: 'desc' } },
        },
        orderBy: { reported_at: 'desc' },
      }),
      this.prisma.tires.findMany({
        where: { current_vehicle_id: vehicleId, deleted_at: null },
        include: {
          movements: { where: { deleted_at: null }, orderBy: { date: 'desc' } },
          positions_history: { where: { deleted_at: null }, orderBy: { installed_at: 'desc' } },
        },
      }),
      this.prisma.maintenance_plan_assets.findMany({
        where: { asset_id: vehicleId, deleted_at: null },
        include: { plan: { where: { deleted_at: null } } },
      }),
    ]);

    return { orders, tires, plans };
  }

  async getTireHistory(tireId: string) {
    const tire = await this.prisma.tires.findFirst({
      where: { id: tireId, deleted_at: null },
      include: {
        product: { select: { id: true, name: true, sku: true } },
        purchase_document: { select: { id: true, number: true, date: true, total: true, party_id: true } },
        purchase_supplier: { select: { id: true, name: true } },
        current_vehicle: { select: { id: true, plate: true, brand: true, model: true } },
        current_position: { select: { id: true, position_number: true, axle: true, side: true } },
        current_warehouse: { select: { id: true, name: true, code: true } },
        current_tire_shop: { select: { id: true, name: true } },
        movements: {
          where: { deleted_at: null },
          orderBy: { date: 'asc' },
          include: {
            vehicle: { select: { id: true, plate: true } },
            position: { select: { id: true, position_number: true, axle: true, side: true } },
          },
        },
        positions_history: {
          where: { deleted_at: null },
          orderBy: { installed_at: 'asc' },
          include: {
            position: { select: { id: true, position_number: true, axle: true, side: true } },
            vehicle: { select: { id: true, plate: true, brand: true, model: true } },
          },
        },
        maintenance_orders: {
          where: { deleted_at: null },
          orderBy: { reported_at: 'desc' },
          include: {
            tasks: { where: { deleted_at: null } },
            parts: { where: { deleted_at: null }, include: { product: { select: { name: true } } } },
            services: { where: { deleted_at: null }, include: { supplier: { select: { name: true } } } },
          },
        },
      },
    });

    if (!tire) return null;

    // Calcular métricas
    const movements = tire.movements || [];
    const installations = movements.filter((m) => m.movement_type === 'INSTALLATION');
    const removals = movements.filter((m) => m.movement_type === 'REMOVAL');
    const repairs = movements.filter((m) => ['REPAIR', 'RETREAD'].includes(m.movement_type));

    let totalKm = 0;
    for (let i = 0; i < installations.length; i++) {
      const install = installations[i];
      const removal = removals.find((r) => r.date > install.date && r.vehicle_id === install.vehicle_id);
      if (install.odometer && removal?.odometer) {
        totalKm += Number(removal.odometer) - Number(install.odometer);
      }
    }

    const totalRepairCost = tire.maintenance_orders
      .filter((o) => o.actual_cost)
      .reduce((sum, o) => sum + Number(o.actual_cost || 0), 0);

    return {
      ...tire,
      metrics: {
        total_kilometers: totalKm,
        installation_count: tire.installation_count || 0,
        vehicle_count: tire.vehicle_count || 0,
        repair_count: repairs.length,
        retread_count: tire.retread_count || 0,
        total_repair_cost: totalRepairCost,
        total_retread_cost: Number(tire.total_retread_cost || 0),
        purchase_cost: Number(tire.purchase_unit_cost || 0),
        total_cost: Number(tire.purchase_unit_cost || 0) + totalRepairCost + Number(tire.total_retread_cost || 0),
        cost_per_km: totalKm > 0 ? (Number(tire.purchase_unit_cost || 0) + totalRepairCost + Number(tire.total_retread_cost || 0)) / totalKm : 0,
      },
    };
  }

  async getOrderHistory(orderId: string) {
    return this.prisma.maintenance_orders.findFirst({
      where: { id: orderId, deleted_at: null },
      include: {
        tasks: { where: { deleted_at: null }, orderBy: { created_at: 'asc' } },
        parts: { where: { deleted_at: null }, include: { product: { select: { name: true, sku: true } } } },
        labor: { where: { deleted_at: null } },
        services: { where: { deleted_at: null }, include: { supplier: { select: { name: true } } } },
        status_history: { where: { deleted_at: null }, orderBy: { changed_at: 'desc' } },
        vehicle: { select: { id: true, plate: true, brand: true, model: true, type: true } },
        tire: { select: { id: true, serial_number: true, product: { select: { name: true } } } },
        supplier: { select: { id: true, name: true } },
      },
    });
  }
}
