// src/modules/erp/purchases/dto/query-purchases.dto.ts
import {
  IsOptional,
  IsInt,
  IsDateString,
  Min,
  IsUUID,
  IsEnum,
} from 'class-validator';

export enum DocumentTypeFilter {
  INVOICE = 'INVOICE',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
}

export class QueryPurchasesDto {
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
  @IsUUID()
  documentTypeId?: string;

  @IsOptional()
  @IsEnum(DocumentTypeFilter)
  documentTypeFilter?: DocumentTypeFilter;
}
