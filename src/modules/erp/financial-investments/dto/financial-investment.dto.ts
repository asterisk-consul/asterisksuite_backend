import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class InvestmentSettlementChargeDto {
  @IsString() concept_id!: string;
  @Type(() => Number) @IsNumber() @Min(0.01) amount!: number;
}

export class CreateFinancialInvestmentDto {
  @IsEnum(['FIXED_TERM', 'INVESTMENT_FUND', 'OTHER'] as const)
  type!: 'FIXED_TERM' | 'INVESTMENT_FUND' | 'OTHER';

  @IsString() name!: string;
  @IsString() @IsOptional() institution_name?: string;
  @IsString() currency_code!: string;
  @IsString() source_bank_account_id!: string;
  @IsString() @IsOptional() destination_bank_account_id?: string;
  @Type(() => Number) @IsNumber() @Min(0.01) capital_amount!: number;
  @IsString() start_date!: string;
  @IsString() @IsOptional() maturity_date?: string;
  @Type(() => Number) @IsNumber() @Min(0) @IsOptional() annual_nominal_rate?: number;
  @IsEnum(['NON_CANCELABLE', 'PRE_CANCELABLE'] as const) @IsOptional()
  liquidity_type?: 'NON_CANCELABLE' | 'PRE_CANCELABLE';
  @IsString() @IsOptional() early_cancel_available_from?: string;
  @Type(() => Number) @IsNumber() @Min(0) @IsOptional() early_cancel_annual_rate?: number;
  @Type(() => Number) @IsInt() @IsIn([360, 365]) @IsOptional() day_count_basis?: number;
  @Type(() => Number) @IsNumber() @Min(0.00000001) @IsOptional() units?: number;
  @Type(() => Number) @IsNumber() @Min(0.00000001) @IsOptional() initial_unit_value?: number;
  @IsBoolean() @IsOptional() auto_renew?: boolean;
  @IsString() @IsOptional() reference?: string;
  @IsString() @IsOptional() notes?: string;
}

export class CreateInvestmentValuationDto {
  @IsString() valuation_date!: string;
  @Type(() => Number) @IsNumber() @Min(0.00000001) unit_value!: number;
  @IsString() @IsOptional() notes?: string;
}

export class SettleFixedTermDto {
  @IsEnum(['CREDIT_ALL', 'RENEW_CAPITAL', 'RENEW_ALL'] as const)
  mode!: 'CREDIT_ALL' | 'RENEW_CAPITAL' | 'RENEW_ALL';
  @IsString() date!: string;
  @Type(() => Number) @IsNumber() @Min(0) @IsOptional() actual_amount?: number;
  @IsString() @IsOptional() bank_account_id?: string;
  @Type(() => Number) @IsNumber() @Min(0) @IsOptional() new_annual_nominal_rate?: number;
  @IsString() @IsOptional() new_maturity_date?: string;
  @IsString() @IsOptional() reference?: string;
  @IsString() @IsOptional() notes?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => InvestmentSettlementChargeDto) @IsOptional()
  charges?: InvestmentSettlementChargeDto[];
}

export class RedeemInvestmentFundDto {
  @IsString() date!: string;
  @Type(() => Number) @IsNumber() @Min(0.00000001) units!: number;
  @Type(() => Number) @IsNumber() @Min(0) credited_amount!: number;
  @IsString() bank_account_id!: string;
  @IsString() @IsOptional() reference?: string;
  @IsString() @IsOptional() notes?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => InvestmentSettlementChargeDto) @IsOptional()
  charges?: InvestmentSettlementChargeDto[];
}
