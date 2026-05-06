export interface SalesDocumentsResponseDto {
  ref: string;
  number: string;
  date: Date;

  supplierName: string;
  supplierCode: string;

  documentTypeCode: string;
  documentTypeName: string;

  documentSubtotal: number;
  taxAmount: number;
  totalExempt: number;

  documentTotal: number;

  taxCode: string;
  taxName: string;

  sequenceNumber: string;

  transactionType: string;
  adjustedValue: number;
}
