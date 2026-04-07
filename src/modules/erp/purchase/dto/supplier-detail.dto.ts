// src/modules/erp/purchases/dto/supplier-detail.dto.ts
export interface SupplierDetailDto {
  supplierId: number;
  supplierCode: string;
  supplierName: string;
  totalBySupplier: number;
  transactionCount: number;
  lastPurchaseDate: Date;
}
