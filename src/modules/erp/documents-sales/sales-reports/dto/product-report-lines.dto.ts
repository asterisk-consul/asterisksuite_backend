export interface ProductReportLineDto {
  id: string;
  documentId: string;
  documentDate: Date;
  documentNumber: string;
  documentReference: string;
  documentTypeCode: string;
  documentTypeName: string;
  documentCategory: string | null;
  documentStatus: number;
  partyName: string;
  currencyCode: string;
  quantity: number;
  unitPrice: number;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface ProductReportLinesResponseDto {
  page: number;
  pageSize: number;
  total: number;
  items: ProductReportLineDto[];
}
