// src/modules/erp/purchases/dto/query-purchases.dto.ts
import { IsOptional, IsInt, IsDateString, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPurchasesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId?: number;

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
}
