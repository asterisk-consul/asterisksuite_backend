import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsUUID, IsEnum, IsInt, Min, Max, IsString, MaxLength } from 'class-validator';

export enum DocumentTypeFilter {
  INVOICE = 'INVOICE',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
  ORDER = 'ORDER',
  QUOTE = 'QUOTE',
  REMITO = 'REMITO',
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

  @IsOptional()
  @IsString()
  @MaxLength(20)
  pointOfSale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currencyCode?: string;

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
