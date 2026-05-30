import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { ProductCostSource } from '@/generated/prisma/enums';

import { Prisma } from '@/generated/prisma/client';

import { CostRateSnapshot } from './interfaces/calculated-cost.interface';

@Injectable()
export class CostingHistoryService {
  constructor(private readonly prisma: PrismaService) {}

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

    breakdown: {
      component_product_id: string;

      component_variant_id?: string;

      quantity: number;

      unit_cost: number;

      total_cost: number;

      level: number;
    }[];
  }) {
    const version = await this.prisma.product_costs.count({
      where: {
        product_id: data.product_id,
      },
    });

    return this.prisma.product_costs.create({
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

        breakdowns: {
          create: data.breakdown,
        },
      },

      include: {
        breakdowns: true,
      },
    });
  }
}
