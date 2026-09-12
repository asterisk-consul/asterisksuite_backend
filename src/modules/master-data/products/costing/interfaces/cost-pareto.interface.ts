// interfaces/cost-pareto.interface.ts

// interfaces/cost-pareto.interface.ts

export interface ParetoItem {
  product_id: string;

  variant_id: string | null;

  product_name: string;

  // ← AGREGAR ESTO
  product_sku?: string | null;

  // ← AGREGAR ESTO
  variant_name?: string | null;

  // ← AGREGAR ESTO
  variant_sku?: string | null;

  total_quantity: number;

  total_cost: number;

  occurrences: number;

  cost_source?: string;

  percentage: number;

  cumulative: number;

  is_vital: boolean;
}

export interface CostParetoResult {
  product_id: string;
  currency_id: string;
  total_cost: number;
  items: ParetoItem[];
  // resumen
  vital_items_count: number; // ítems que explican el 80%
  vital_items_percentage: number; // qué % del total de ítems son los vitales
}
