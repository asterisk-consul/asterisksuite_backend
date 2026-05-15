// src/modules/master-data/products/costing/costing.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CostingTreeService } from './costing-tree.service';

import { CostingCalculatorService } from './costing-calculator.service';

import { CostingHistoryService } from './costing-history.service';

import { CalculatedCost } from './interfaces/calculated-cost.interface';

import { round2 } from './utils/costing.utils';

@Injectable()
export class CostingService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly treeService: CostingTreeService,

    private readonly calculatorService: CostingCalculatorService,

    private readonly historyService: CostingHistoryService,
  ) {}

  async calculateProductCost(
    productId: string,
    currencyId: string,
    saveSnapshot = true,
  ): Promise<CalculatedCost> {
    const product = await this.prisma.products.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const breakdown = await this.treeService.buildTree(productId);

    const materialCost =
      this.calculatorService.calculateMaterialCost(breakdown);

    const laborCost = this.calculatorService.calculateLaborCost(materialCost);

    const overheadCost =
      this.calculatorService.calculateOverheadCost(materialCost);

    const totalCost = round2(materialCost + laborCost + overheadCost);

    if (saveSnapshot) {
      const flat = this.treeService.flattenTree(breakdown);

      await this.historyService.saveSnapshot({
        product_id: productId,

        currency_id: currencyId,

        material_cost: materialCost,

        labor_cost: laborCost,

        overhead_cost: overheadCost,

        total_cost: totalCost,

        breakdown: flat.map((item) => ({
          component_product_id: item.product_id,

          quantity: item.quantity,

          unit_cost: item.unit_cost,

          total_cost: item.total_cost,

          level: item.level,
        })),
      });

      await this.prisma.products.update({
        where: {
          id: productId,
        },
        data: {
          current_cost: totalCost,
        },
      });
    }

    return {
      product_id: productId,

      material_cost: materialCost,

      labor_cost: laborCost,

      overhead_cost: overheadCost,

      total_cost: totalCost,

      breakdown,
    };
  }

  async getCostHistory(productId: string) {
    return this.prisma.product_costs.findMany({
      where: {
        product_id: productId,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        breakdowns: true,
        currencies: true,
      },
    });
  }
}
