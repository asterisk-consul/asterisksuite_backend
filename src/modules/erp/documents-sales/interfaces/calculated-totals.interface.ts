export interface DocumentTaxSummary {
  tax_id: string;

  tax_rate: number;

  taxable_base: number;

  tax_amount: number;
}

export interface CalculatedTotals {
  subtotal: number;

  exempt_amount: number;

  taxable_base: number;

  total_taxes: number;

  total: number;

  documentTaxes: DocumentTaxSummary[];
}
