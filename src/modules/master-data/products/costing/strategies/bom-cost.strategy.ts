import { Injectable } from '@nestjs/common';

import { CostingTreeService } from '../costing-tree.service';

import { CostingCalculatorService } from '../costing-calculator.service';

import { CalculatedCost } from '../interfaces/calculated-cost.interface';

import { round2 } from '../utils/costing.utils';

@Injectable()
export class BomCostStrategy {
  constructor(
    private readonly treeService: CostingTreeService,

    private readonly calculatorService: CostingCalculatorService,
  ) {}

  async calculate(
    productId: string,
    currencyId: string,
  ): Promise<CalculatedCost> {
    const breakdown = await this.treeService.buildTree(productId, currencyId);

    const materialCost =
      this.calculatorService.calculateMaterialCost(breakdown);

    const laborCost = this.calculatorService.calculateLaborCost(materialCost);

    const overheadCost =
      this.calculatorService.calculateOverheadCost(materialCost);

    const totalCost = round2(materialCost + laborCost + overheadCost);

    return {
      product_id: productId,

      material_cost: materialCost,

      labor_cost: laborCost,

      overhead_cost: overheadCost,

      total_cost: totalCost,

      breakdown,
    };
  }
}
