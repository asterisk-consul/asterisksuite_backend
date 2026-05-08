import { SalesDocumentsResponseDto } from './sales-documents-response.dto';
export interface GlobalSalesDocumentsResponseDto {
  grandTotal: number;
  documents: SalesDocumentsResponseDto[];
}
