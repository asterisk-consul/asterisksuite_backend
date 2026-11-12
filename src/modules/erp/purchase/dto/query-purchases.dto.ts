// src/modules/erp/purchases/dto/query-purchases.dto.ts
import {
  IsOptional,
  IsInt,
  IsDateString,
  Min,
  Max,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum DocumentTypeFilter {
  INVOICE = 'INVOICE',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
  ORDER = 'ORDER',
  QUOTE = 'QUOTE',
  REMITO = 'REMITO',
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

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
