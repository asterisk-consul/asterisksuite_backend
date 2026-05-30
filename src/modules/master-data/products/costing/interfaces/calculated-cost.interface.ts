// interfaces/calculated-cost.interface.ts
import { CostBreakdownItem } from './cost-breakdown.interface';

export interface CostRateSnapshot {
  name: string;
  type: string;
  value_type: string;
  rate_used: number;
  cost_applied: number;
}

export interface CalculatedCost {
  product_id: string;
  material_cost: number;
  labor_cost: number;
  overhead_cost: number;
  other_cost: number;
  total_cost: number;
  breakdown: CostBreakdownItem[];
  rates_snapshot: Record<string, CostRateSnapshot>;
  cost_template_id: string | null;
}
