// src/modules/erp/purchases/dto/tax-detail.dto.ts
export interface TaxDetailDto {
  taxId: number;
  taxCode: string;
  taxName: string;
  taxRate: number;
  totalTaxByProduct: number;
  taxableBase: number;
}
