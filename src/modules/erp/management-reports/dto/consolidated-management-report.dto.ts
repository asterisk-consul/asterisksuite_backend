import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsIn, IsOptional, IsUUID } from 'class-validator';

export const consolidatedReportViews = ['consolidated', 'customers', 'suppliers', 'hr', 'treasury', 'documents', 'inventory'] as const;
export type ConsolidatedReportView = typeof consolidatedReportViews[number];

export class ConsolidatedManagementReportDto {
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
  @IsIn(consolidatedReportViews)
  view?: ConsolidatedReportView;
}

export class ExportConsolidatedManagementReportDto extends ConsolidatedManagementReportDto {
  @Transform(({ value }) => String(value).toLowerCase())
  @IsIn(['pdf', 'xlsx', 'csv'])
  format!: 'pdf' | 'xlsx' | 'csv';
}
