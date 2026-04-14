// src/modules/erp/purchases/dto/purchase-movement-response.dto.ts

export interface PurchaseMovementResponseDto {
  ref: string;
  number: string;
  date: Date;
  supplierName: string;
  supplierCode: string;
  productId: string;
  productCode: string;
  productName: string;
  documentTypeCode: string;
  documentTypeName: string;
  quantity: number;
  unitPrice: number;
  itemSubtotal: number;
  documentSubtotal: number;
  documentTotal: number;
  taxCode: string;
  taxName: string;
  taxAmount: number;
  sequenceNumber: string;
  transactionType: string;
  adjustedValue: number;
}
