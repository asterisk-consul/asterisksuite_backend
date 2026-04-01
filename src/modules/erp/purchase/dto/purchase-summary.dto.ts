// src/modules/erp/purchases/dto/purchase-summary-response.dto.ts
export interface ProductSummaryDto {
  productId: number;
  productCode: string;
  productName: string;
  productCategory: string;
  totalPurchases: number;
  totalTaxes: number;
  transactionCount: number;
  invoiceCount: number;
  creditNoteCount: number;
  firstPurchaseDate: Date | null;
  lastPurchaseDate: Date | null;
  avgPurchaseValue: number;
}

export interface GlobalPurchaseSummaryResponseDto {
  globalTotal: number;
  globalTaxes: number;
  globalTransactionCount: number;
  totalProducts: number;
  products: ProductSummaryDto[];
}
