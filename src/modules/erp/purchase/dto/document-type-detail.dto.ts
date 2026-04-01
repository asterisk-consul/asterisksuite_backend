// src/modules/erp/purchases/dto/document-type-detail.dto.ts
export interface DocumentTypeDetailDto {
  documentTypeId: number;
  documentTypeCode: string;
  documentTypeName: string;
  totalByDocumentType: number;
  transactionCount: number;
}
