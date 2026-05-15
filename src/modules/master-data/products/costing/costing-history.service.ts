// src/modules/master-data/products/costing/costing-history.service.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CostingHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async saveSnapshot(data: {
    product_id: string;

    currency_id: string;

    material_cost: number;

    labor_cost: number;

    overhead_cost: number;

    total_cost: number;

    breakdown: {
      component_product_id: string;

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

        material_cost: data.material_cost,

        labor_cost: data.labor_cost,

        overhead_cost: data.overhead_cost,

        total_cost: data.total_cost,

        version: version + 1,

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
