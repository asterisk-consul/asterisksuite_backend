// src/modules/master-data/products/costing/costing-calculator.service.ts

import { Injectable } from '@nestjs/common';

import { CostBreakdownItem } from './interfaces/cost-breakdown.interface';

import { round2 } from './utils/costing.utils';

@Injectable()
export class CostingCalculatorService {
  calculateMaterialCost(breakdown: CostBreakdownItem[]): number {
    const flat = this.flatten(breakdown);

    return round2(flat.reduce((acc, item) => acc + item.total_cost, 0));
  }

  calculateLaborCost(materialCost: number): number {
    return round2(materialCost * 0.1);
  }

  calculateOverheadCost(materialCost: number): number {
    return round2(materialCost * 0.05);
  }

  private flatten(items: CostBreakdownItem[]): CostBreakdownItem[] {
    const result: CostBreakdownItem[] = [];

    for (const item of items) {
      result.push(item);

      if (item.children?.length) {
        result.push(...this.flatten(item.children));
      }
    }

    return result;
  }
}
