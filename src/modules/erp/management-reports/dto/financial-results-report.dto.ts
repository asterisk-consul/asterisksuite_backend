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

export const financialResultsMetrics = [
  'sales_confirmed',
  'purchase_invoices',
  'sales_invoices',
  'payments',
  'collections',
  'pending_orders',
] as const;

export type FinancialResultsMetric = typeof financialResultsMetrics[number];
export const financialResultsOrderStatuses = [1, 2, 3, 4, 5, 6, 7] as const;

export class FinancialResultsSummaryDto {
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
  @IsIn(financialResultsOrderStatuses, { each: true })
  ov_statuses?: number[];
}

export class FinancialResultsDetailDto {
  @IsUUID('4')
  company_id!: string;

  @IsDateString()
  date_from!: string;

  @IsDateString()
  date_to!: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsIn(financialResultsOrderStatuses, { each: true })
  ov_statuses?: number[];

  @IsIn(financialResultsMetrics)
  metric!: FinancialResultsMetric;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  account_key?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  search?: string;

  @IsOptional()
  @IsIn(['ALL', 'UNPAID', 'PARTIAL', 'PAID'])
  payment_state?: 'ALL' | 'UNPAID' | 'PARTIAL' | 'PAID';

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

export class FinancialResultsDocumentItemsDto {
  @IsUUID('4')
  company_id!: string;

  @IsDateString()
  date_from!: string;

  @IsDateString()
  date_to!: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsIn(financialResultsOrderStatuses, { each: true })
  ov_statuses?: number[];

  @IsIn(financialResultsMetrics)
  metric!: FinancialResultsMetric;

  @IsUUID('4')
  document_id!: string;
}
