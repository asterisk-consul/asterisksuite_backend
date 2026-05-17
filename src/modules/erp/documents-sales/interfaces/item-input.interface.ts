export interface TaxInput {
  tax_id: string;

  tax_rate: number;

  tax_amount: number;

  calculation_level: string;

  is_included_in_price: boolean;
}

export interface ItemInput {
  product_id: string | null;

  quantity: number;

  currency: string;

  exchange_rate: number;

  original_unit_price: number;

  unit_price: number;

  price: number;

  exempt_amount: number;

  taxable_base: number;

  total_taxes: number;

  total: number;

  taxes: TaxInput[];
}
