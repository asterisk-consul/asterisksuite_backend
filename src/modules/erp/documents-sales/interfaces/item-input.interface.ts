export interface TaxInput {
  tax_id: string;

  tax_rate: number;

  tax_amount: number;

  converted_tax_amount?: number | null;

  calculation_level: string;

  is_included_in_price: boolean;
}

export interface ItemInput {
  product_id: string | null;

  variant_id?: string | null;

  quantity: number;

  currency: string;

  exchange_rate: number;

  rate_type?: string | null;

  original_unit_price: number;

  unit_price: number;

  converted_unit_price?: number | null;

  price: number;

  converted_price?: number | null;

  exempt_amount: number;

  taxable_base: number;

  total_taxes: number;

  total: number;

  taxes: TaxInput[];
}
