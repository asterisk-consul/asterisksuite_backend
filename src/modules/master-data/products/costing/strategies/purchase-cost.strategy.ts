import { Injectable } from '@nestjs/common';
import { CostingTreeService } from '../costing-tree.service';
import { CostingCalculatorService } from '../costing-calculator.service';
import {
  ICostStrategy,
  CostStrategyOptions,
} from '../interfaces/cost-strategy.interface';
import { CalculatedCost } from '../interfaces/calculated-cost.interface';

@Injectable()
export class PurchaseCostStrategy implements ICostStrategy {
  constructor(
    private readonly treeService: CostingTreeService,
    private readonly calculatorService: CostingCalculatorService,
  ) {}

  async calculate({
    productId,
    currencyId,
    templateComponents,
    costTemplateId,
  }: CostStrategyOptions): Promise<CalculatedCost> {
    const breakdown = await this.treeService.buildTree(productId, currencyId);

    const materialCost =
      this.calculatorService.calculatePurchaseCost(breakdown);

    const result = this.calculatorService.calculateFromComponents(
      materialCost,
      templateComponents,
    );

    return {
      product_id: productId,
      material_cost: result.material_cost,
      labor_cost: result.labor_cost,
      overhead_cost: result.overhead_cost,
      other_cost: result.other_cost,
      total_cost: result.total_cost,
      breakdown,
      rates_snapshot: result.rates_snapshot,
      cost_template_id: costTemplateId,
    };
  }
}
