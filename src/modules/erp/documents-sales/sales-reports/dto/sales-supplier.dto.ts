export interface SupplierDetailDto {
  supplierId: number;
  supplierCode: string;
  supplierName: string;
  totalBySupplier: number;
  transactionCount: number;
  lastSalesDate: Date;
}
