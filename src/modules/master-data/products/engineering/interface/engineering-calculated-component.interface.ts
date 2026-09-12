export interface EngineeringCalculatedComponent {
  product_id: string;
  product_name: string;
  product_sku?: string | null;
  variant_id?: string | null;
  variant_name?: string | null;
  variant_sku?: string | null;
  quantity: number;
  calculated_quantity: number;
  surface_m2: number;
  volume_m3: number;
  calculated_weight_kg: number;
  waste_percentage: number;

  // Costos
  unit_cost: number;
  own_material_cost: number;
  children_cost: number;
  total_cost: number;

  // Nivel en el árbol
  level: number;

  // Hijos resueltos (solo en modo árbol)
  children?: EngineeringCalculatedComponent[];
}
