export interface TaxDetailDto {
  taxId: number;
  taxCode: string;
  taxName: string;
  taxRate: number;
  totalTaxByProduct: number;
  taxableBase: number;
}
