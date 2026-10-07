import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpsertReplenishmentPolicyDto } from './dto/upsert-replenishment-policy.dto';

@Injectable()
export class ReplenishmentService {
  constructor(private readonly db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private async validate(dto: UpsertReplenishmentPolicyDto) {
    if (dto.target_stock < dto.reorder_point) {
      throw new BadRequestException('El stock objetivo debe ser igual o mayor al punto de reposición');
    }
    const [product, warehouse] = await Promise.all([
      this.prisma.products.findFirst({ where: { id: dto.product_id, deleted_at: null } }),
      this.prisma.warehouses.findFirst({ where: { id: dto.warehouse_id, deleted_at: null } }),
    ]);
    if (!product) throw new NotFoundException('Producto no encontrado');
    if (!product.manages_stock) throw new BadRequestException('El producto no maneja stock');
    if (!warehouse) throw new NotFoundException('Depósito no encontrado');
    if (warehouse.is_virtual) throw new BadRequestException('No se pueden configurar depósitos temporales o en tránsito');
  }

  listByProduct(productId: string) {
    return this.prisma.stock_replenishment_policies.findMany({
      where: { product_id: productId, deleted_at: null },
      include: { warehouse: { select: { id: true, name: true, code: true, active: true } } },
      orderBy: [{ active: 'desc' }, { warehouse: { name: 'asc' } }],
    });
  }

  async create(dto: UpsertReplenishmentPolicyDto) {
    await this.validate(dto);
    const existing = await this.prisma.stock_replenishment_policies.findFirst({
      where: { product_id: dto.product_id, warehouse_id: dto.warehouse_id },
    });
    if (existing && !existing.deleted_at) throw new BadRequestException('Ya existe una política para este producto y depósito');
    const data = {
      preferred_supplier_id: dto.preferred_supplier_id,
      reorder_point: dto.reorder_point,
      target_stock: dto.target_stock,
      lead_time_days: dto.lead_time_days,
      active: dto.active ?? true,
      deleted_at: null,
      deleted_by: null,
    };
    return existing
      ? this.prisma.stock_replenishment_policies.update({ where: { id: existing.id }, data })
      : this.prisma.stock_replenishment_policies.create({ data: { ...data, product_id: dto.product_id, warehouse_id: dto.warehouse_id } });
  }

  async update(id: string, dto: UpsertReplenishmentPolicyDto) {
    await this.validate(dto);
    const policy = await this.prisma.stock_replenishment_policies.findFirst({ where: { id, deleted_at: null } });
    if (!policy) throw new NotFoundException('Política de reposición no encontrada');
    return this.prisma.stock_replenishment_policies.update({
      where: { id },
      data: {
        product_id: dto.product_id,
        warehouse_id: dto.warehouse_id,
        preferred_supplier_id: dto.preferred_supplier_id,
        reorder_point: dto.reorder_point,
        target_stock: dto.target_stock,
        lead_time_days: dto.lead_time_days,
        active: dto.active ?? true,
      },
    });
  }

  async remove(id: string) {
    const policy = await this.prisma.stock_replenishment_policies.findFirst({ where: { id, deleted_at: null } });
    if (!policy) throw new NotFoundException('Política de reposición no encontrada');
    return this.prisma.stock_replenishment_policies.update({ where: { id }, data: { deleted_at: new Date(), active: false } });
  }

  async report(query: { search?: string; warehouse_id?: string; status?: string; product_type?: string; include_unconfigured?: string | boolean; page?: number; limit?: number }) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 25, 1), 100);
    const policies = await this.prisma.stock_replenishment_policies.findMany({
      where: {
        deleted_at: null,
        active: true,
        ...(query.warehouse_id ? { warehouse_id: query.warehouse_id } : {}),
        product: {
          deleted_at: null,
          active: true,
          manages_stock: true,
          ...(query.product_type ? { product_type: query.product_type as any } : {}),
          ...(query.search ? { OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { sku: { contains: query.search, mode: 'insensitive' } },
          ] } : {}),
        },
      },
      include: {
        warehouse: { select: { id: true, name: true, code: true } },
        product: {
          select: {
            id: true, name: true, sku: true, product_type: true,
            unit: { select: { symbol: true } },
            warehouse_stock: {
              where: { deleted_at: null },
              select: {
                warehouse_id: true, quantity: true, reserved_quantity: true,
                warehouses: { select: { is_virtual: true, active: true, deleted_at: true } },
              },
            },
          },
        },
      },
      orderBy: [{ product: { name: 'asc' } }, { warehouse: { name: 'asc' } }],
    });

    const policyCount = new Map<string, number>();
    for (const policy of policies) policyCount.set(policy.product_id, (policyCount.get(policy.product_id) ?? 0) + 1);
    const virtualIds = [...new Set(policies.flatMap(policy => policy.product.warehouse_stock
      .filter(row => row.warehouses.is_virtual)
      .map(row => row.warehouse_id)))];
    const containers = virtualIds.length ? await this.prisma.international_containers.findMany({
      where: { transit_warehouse_id: { in: virtualIds }, deleted_at: null },
      select: {
        transit_warehouse_id: true, estimated_arrival_date: true, actual_arrival_date: true,
        operation: { select: { estimated_arrival_date: true, actual_arrival_date: true } },
      },
    }) : [];
    const arrivals = new Map<string, any>(containers
      .filter(container => container.transit_warehouse_id)
      .map(container => [container.transit_warehouse_id!, container]));
    const number = (value: unknown) => Number(value ?? 0);

    let rows = policies.map(policy => {
      const physical = policy.product.warehouse_stock.find(row => row.warehouse_id === policy.warehouse_id);
      const physicalStock = number(physical?.quantity);
      const reserved = number(physical?.reserved_quantity);
      const availableNow = Math.max(physicalStock - reserved, 0);
      const horizon = new Date();
      horizon.setDate(horizon.getDate() + policy.lead_time_days);
      const transitRows = policy.product.warehouse_stock.filter(row => row.warehouses.is_virtual && row.warehouses.active && !row.warehouses.deleted_at);
      const transitTotal = transitRows.reduce((sum, row) => sum + Math.max(number(row.quantity) - number(row.reserved_quantity), 0), 0);
      const arrivingWithinLeadTime = transitRows.reduce((sum, row) => {
        const container = arrivals.get(row.warehouse_id);
        const arrival = container?.actual_arrival_date ?? container?.estimated_arrival_date
          ?? container?.operation.actual_arrival_date ?? container?.operation.estimated_arrival_date;
        return arrival && new Date(arrival) <= horizon
          ? sum + Math.max(number(row.quantity) - number(row.reserved_quantity), 0)
          : sum;
      }, 0);
      const assignedTransit = policyCount.get(policy.product_id) === 1 ? arrivingWithinLeadTime : 0;
      const projected = availableNow + assignedTransit;
      const reorderPoint = number(policy.reorder_point);
      const targetStock = number(policy.target_stock);
      const status = availableNow <= 0 ? 'CRITICAL'
        : projected <= reorderPoint ? 'REORDER'
          : availableNow <= reorderPoint && projected > reorderPoint ? 'COVERED'
            : 'OK';
      return {
        id: policy.id,
        product: { id: policy.product.id, name: policy.product.name, sku: policy.product.sku, type: policy.product.product_type },
        warehouse: policy.warehouse,
        unit: policy.product.unit?.symbol ?? 'u.',
        reorder_point: reorderPoint,
        target_stock: targetStock,
        lead_time_days: policy.lead_time_days,
        physical_stock: physicalStock,
        reserved,
        available_now: availableNow,
        transit_total: transitTotal,
        arriving_within_lead_time: arrivingWithinLeadTime,
        transit_assigned: assignedTransit,
        transit_pending_assignment: policyCount.get(policy.product_id)! > 1 ? arrivingWithinLeadTime : 0,
        projected_available: projected,
        suggested_quantity: Math.max(targetStock - projected, 0),
        status,
      };
    });

    const unconfiguredProducts = !query.warehouse_id ? await this.prisma.products.findMany({
      where: {
        deleted_at: null,
        active: true,
        manages_stock: true,
        stock_replenishment_policies: { none: { deleted_at: null, active: true } },
        ...(query.product_type ? { product_type: query.product_type as any } : {}),
        ...(query.search ? { OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { sku: { contains: query.search, mode: 'insensitive' } },
        ] } : {}),
      },
      select: { id: true, name: true, sku: true, product_type: true, unit: { select: { symbol: true } } },
      orderBy: { name: 'asc' },
    }) : [];
    const unconfiguredRows = unconfiguredProducts.map(product => ({
      id: `unconfigured:${product.id}`,
      product: { id: product.id, name: product.name, sku: product.sku, type: product.product_type },
      warehouse: null as any,
      unit: product.unit?.symbol ?? 'u.',
      reorder_point: 0,
      target_stock: 0,
      lead_time_days: 0,
      physical_stock: 0,
      reserved: 0,
      available_now: 0,
      transit_total: 0,
      arriving_within_lead_time: 0,
      transit_assigned: 0,
      transit_pending_assignment: 0,
      projected_available: 0,
      suggested_quantity: 0,
      status: 'UNCONFIGURED',
    }));
    const summary: Record<string, number> = {};
    for (const row of rows) summary[row.status] = (summary[row.status] ?? 0) + 1;
    summary.UNCONFIGURED = unconfiguredRows.length;
    const includeUnconfigured = query.include_unconfigured === true
      || query.include_unconfigured === 'true'
      || query.status === 'UNCONFIGURED';
    if (includeUnconfigured) rows.push(...unconfiguredRows);
    if (query.status) rows = rows.filter(row => row.status === query.status);
    const total = rows.length;
    return { data: rows.slice((page - 1) * limit, page * limit), meta: { total, page, limit, pages: Math.ceil(total / limit), summary } };
  }
}
