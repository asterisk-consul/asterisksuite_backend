export interface CostBreakdownItem {
  product_id: string;

  variant_id?: string;

  product_name: string;
  product_sku?: string | null;
  variant_name?: string | null;
  variant_sku?: string | null;

  quantity: number;

  unit_cost: number;

  total_cost: number;

  level: number;

  currency_id?: string;

  cost_source?: string;

  children?: CostBreakdownItem[];
}
