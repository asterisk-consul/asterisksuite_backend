export interface ResolvedComponent {
  product_id: string;

  variant_id?: string;

  quantity: number;

  surface_m2?: number;

  volume_m3?: number;

  calculated_weight_kg?: number;
}
