import { IsOptional, IsDateString, IsUUID, IsEnum } from 'class-validator';

export enum DocumentTypeFilter {
  INVOICE = 'INVOICE',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
}

export class QuerySalesDto {
  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @IsOptional()
  @IsEnum(DocumentTypeFilter)
  documentTypeFilter?: DocumentTypeFilter;
}
