import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ProductCostSource } from '@/generated/prisma/enums';
import { Prisma } from '@/generated/prisma/client';
import { CostRateSnapshot } from './interfaces/calculated-cost.interface';

export interface BreakdownInput {
  component_product_id: string;
  component_variant_id?: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  level: number;
  children?: BreakdownInput[];
}

@Injectable()
export class CostingHistoryService {
  constructor(private readonly db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async saveSnapshot(data: {
    product_id: string;
    currency_id: string;
    cost_source: ProductCostSource;
    material_cost: number;
    labor_cost: number;
    overhead_cost: number;
    total_cost: number;
    cost_template_id?: string | null;
    cost_rates_snapshot?: Record<string, CostRateSnapshot>;
    breakdown: BreakdownInput[];
  }) {
    const version = await this.prisma.product_costs.count({
      where: { product_id: data.product_id },
    });

    // Crear el snapshot sin breakdowns primero
    const snapshot = await this.prisma.product_costs.create({
      data: {
        product_id: data.product_id,
        currency_id: data.currency_id,
        cost_source: data.cost_source,
        material_cost: data.material_cost,
        labor_cost: data.labor_cost,
        overhead_cost: data.overhead_cost,
        total_cost: data.total_cost,
        version: version + 1,
        cost_template_id: data.cost_template_id ?? null,
        cost_rates_snapshot: data.cost_rates_snapshot
          ? (data.cost_rates_snapshot as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });

    // Insertar breakdowns recursivamente preservando parent_id
    await this.insertBreakdowns(data.breakdown, snapshot.id, null);

    return this.prisma.product_costs.findUnique({
      where: { id: snapshot.id },
      include: { breakdowns: true },
    });
  }

  private async insertBreakdowns(
    items: BreakdownInput[],
    productCostId: string,
    parentBreakdownId: string | null,
  ): Promise<void> {
    for (const item of items) {
      const created = await this.prisma.product_cost_breakdowns.create({
        data: {
          product_cost_id: productCostId,
          component_product_id: item.component_product_id,
          component_variant_id: item.component_variant_id ?? null,
          quantity: item.quantity,
          unit_cost: item.unit_cost,
          total_cost: item.total_cost,
          level: item.level,
          parent_breakdown_id: parentBreakdownId,
        },
      });

      // Insertar hijos con el id del padre recién creado
      if (item.children?.length) {
        await this.insertBreakdowns(item.children, productCostId, created.id);
      }
    }
  }
}
