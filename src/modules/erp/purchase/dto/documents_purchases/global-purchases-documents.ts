import { PurchasesDocumentsResponseDto } from './purchases-documents-response';
export interface GlobalPurchaseDocumentsResponseDto {
  grandTotal: number;
  documents: PurchasesDocumentsResponseDto[];
}
