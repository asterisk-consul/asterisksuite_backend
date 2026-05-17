// src/modules/master-data/products/costing/interfaces/calculated-cost.interface.ts

import { CostBreakdownItem } from './cost-breakdown.interface';

export interface CalculatedCost {
  product_id: string;

  material_cost: number;

  labor_cost: number;

  overhead_cost: number;

  total_cost: number;

  breakdown: CostBreakdownItem[];
}
