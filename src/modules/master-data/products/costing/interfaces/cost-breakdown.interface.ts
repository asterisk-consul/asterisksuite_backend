// src/modules/master-data/products/costing/interfaces/cost-breakdown.interface.ts

export interface CostBreakdownItem {
  product_id: string;

  product_name: string;

  quantity: number;

  unit_cost: number;

  total_cost: number;

  level: number;

  children?: CostBreakdownItem[];
}
