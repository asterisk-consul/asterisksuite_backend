import { IsArray, IsBoolean, IsIn, IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export const reportTemplateColumns = [
  'date', 'label', 'party_name', 'currency_code', 'amount', 'paid_amount', 'pending_amount', 'payment_state',
] as const;
export const reportTemplateVisualizations = ['KPIS', 'CHART', 'TABLE'] as const;
export const reportTemplateChartTypes = ['BAR', 'LINE', 'DONUT'] as const;

export class SaveReportTemplateDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  id?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsIn(['SALES'])
  source!: 'SALES';

  @IsArray()
  @IsIn(reportTemplateColumns, { each: true })
  columns!: Array<typeof reportTemplateColumns[number]>;

  @IsOptional()
  @IsArray()
  @IsIn(reportTemplateVisualizations, { each: true })
  visualizations?: Array<typeof reportTemplateVisualizations[number]>;

  @IsOptional()
  @IsIn(reportTemplateChartTypes)
  chart_type?: typeof reportTemplateChartTypes[number];

  @IsObject()
  query!: Record<string, unknown>;

  @IsBoolean()
  shared!: boolean;
}
