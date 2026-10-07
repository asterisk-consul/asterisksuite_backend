import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateObligationDto {
  @IsUUID() party_id!: string;
  @IsIn(['TAX', 'UTILITY', 'SERVICE', 'FINANCIAL', 'OTHER']) category!: string;
  @IsOptional() @IsIn(['FISCAL_INVOICE', 'DIRECT_EXPENSE']) treatment?: string;
  @IsOptional() @IsUUID() service_product_id?: string;
  @IsOptional() @IsUUID() expense_account_id?: string;
  @IsOptional() @Type(() => Number) @IsNumber() net_amount?: number;
  @IsString() description!: string;
  @IsDateString() due_date!: string;
  @IsOptional() @IsDateString() issue_date?: string;
  @IsOptional() @IsDateString() second_due_date?: string;
  @Type(() => Number) @IsNumber() estimated_amount!: number;
  @IsOptional() @Type(() => Number) @IsNumber() amount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() second_due_amount?: number;
  @IsString() currency_code!: string;
  @IsOptional() @Type(() => Number) @IsNumber() exchange_rate?: number;
  @IsOptional() @IsString() reference?: string;
  @IsOptional() @IsUUID() document_id?: string;
  @IsOptional() @IsUUID() payment_id?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsArray() @IsInt({ each: true }) notification_days?: number[];
}

export class UpdateObligationDto {
  @IsOptional() @IsUUID() party_id?: string;
  @IsOptional() @IsIn(['TAX', 'UTILITY', 'SERVICE', 'FINANCIAL', 'OTHER']) category?: string;
  @IsOptional() @IsIn(['FISCAL_INVOICE', 'DIRECT_EXPENSE']) treatment?: string;
  @IsOptional() @IsUUID() service_product_id?: string;
  @IsOptional() @IsUUID() expense_account_id?: string;
  @IsOptional() @Type(() => Number) @IsNumber() net_amount?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() due_date?: string;
  @IsOptional() @IsDateString() issue_date?: string;
  @IsOptional() @IsDateString() second_due_date?: string;
  @IsOptional() @Type(() => Number) @IsNumber() estimated_amount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() amount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() second_due_amount?: number;
  @IsOptional() @IsString() currency_code?: string;
  @IsOptional() @Type(() => Number) @IsNumber() exchange_rate?: number;
  @IsOptional() @IsString() reference?: string;
  @IsOptional() @IsUUID() document_id?: string;
  @IsOptional() @IsUUID() payment_id?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsArray() @IsInt({ each: true }) notification_days?: number[];
}

export class CreateObligationTemplateDto {
  @IsString() name!: string;
  @IsUUID() party_id!: string;
  @IsIn(['TAX', 'UTILITY', 'SERVICE', 'FINANCIAL', 'OTHER']) category!: string;
  @IsOptional() @IsIn(['FISCAL_INVOICE', 'DIRECT_EXPENSE']) treatment?: string;
  @IsOptional() @IsUUID() service_product_id?: string;
  @IsOptional() @IsUUID() expense_account_id?: string;
  @IsOptional() @Type(() => Number) @IsNumber() net_amount?: number;
  @IsIn(['MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL', 'CUSTOM']) frequency!: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(24) interval_months?: number;
  @IsDateString() start_date!: string;
  @IsOptional() @IsDateString() end_date?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(120) occurrences?: number;
  @Type(() => Number) @IsInt() @Min(1) @Max(31) due_day!: number;
  @Type(() => Number) @IsNumber() estimated_amount!: number;
  @IsString() currency_code!: string;
  @IsOptional() @IsBoolean() variable_amount?: boolean;
  @IsOptional() @IsArray() @IsInt({ each: true }) notification_days?: number[];
  @IsOptional() @IsString() description?: string;
}
