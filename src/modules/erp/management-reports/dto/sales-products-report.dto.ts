import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const salesProductsOrderStatuses = [1, 2, 3, 4, 5, 6, 7] as const;
export const salesProductsGroupTypes = ['CATEGORY', 'PRODUCT', 'POINT_OF_SALE'] as const;

export class SalesProductsReportDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsUUID('4', { each: true })
  company_ids!: string[];

  @IsDateString()
  date_from!: string;

  @IsDateString()
  date_to!: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsIn(salesProductsOrderStatuses, { each: true })
  ov_statuses?: number[];

  @IsOptional()
  @IsString()
  @MaxLength(160)
  search?: string;
}

export class SalesProductsReportDetailDto extends SalesProductsReportDto {
  @IsUUID('4')
  company_id!: string;

  @IsIn(salesProductsGroupTypes)
  group_type!: typeof salesProductsGroupTypes[number];

  @IsString()
  @MaxLength(260)
  group_key!: string;

  @IsString()
  @MaxLength(10)
  currency_code!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  page_size = 25;
}

export class ExportSalesProductsReportDto extends SalesProductsReportDto {}
