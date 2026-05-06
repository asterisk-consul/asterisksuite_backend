export interface ProductSummaryDto {
  productId: string;
  productCode: string;
  productName: string;
  productCategory: string;
  totalSales: number;
  totalTaxes: number;
  totalExempt: number;
  transactionCount: number;
  invoiceCount: number;
  creditNoteCount: number;
  firstSalesDate: Date | null;
  lastSalesDate: Date | null;
  avgPurchaseValue: number;
}

export interface GlobalSalesSummaryResponseDto {
  globalTotal: number;
  globalTaxes: number;
  globalExempt: number;
  globalSalesTotal: number;
  globalTransactionCount: number;
  grandTotal: number;
  negTotal: number;
  totalProducts: number;
  products: ProductSummaryDto[];
}
