import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCreditCardDto {
  @IsString() name!: string;
  @IsEnum(['COMPANY', 'CUSTOMER'] as const) type!: 'COMPANY' | 'CUSTOMER';
  @IsEnum(['VISA', 'MASTERCARD', 'AMEX', 'NARANJA', 'CABAL', 'OTHER'] as const) brand!: string;
  @IsString() last_four!: string;
  @IsString() bank_name!: string;
  @IsString() holder_name!: string;
  @IsString() @IsOptional() holder_id?: string;
  @IsNumber() @IsOptional() credit_limit?: number;
  @IsString() currency_code!: string;
  @IsNumber() @IsOptional() commission_rate?: number;
  @IsInt() @Min(0) @IsOptional() clearing_days?: number;
  @IsInt() @Min(1) @Max(31) @IsOptional() closing_day?: number;
  @IsInt() @Min(1) @Max(31) @IsOptional() due_day?: number;
  @IsString() @IsOptional() party_id?: string;
  @IsBoolean() @IsOptional() active?: boolean;
}

export class UpdateCreditCardDto extends CreateCreditCardDto {}

export class SettleCardCollectionDto {
  @IsString() bank_account_id!: string;
  @IsString() date!: string;
  @IsNumber() commission_amount!: number;
  @IsNumber() @IsOptional() tax_amount?: number;
  @IsNumber() @IsOptional() withholding_amount?: number;
  @IsNumber() @IsOptional() other_deductions?: number;
  @IsNumber() net_amount!: number;
  @IsString() @IsOptional() reference?: string;
  @IsString() @IsOptional() notes?: string;
}

export class PayCardInstallmentDto {
  @IsString() bank_account_id!: string;
  @IsString() date!: string;
  @IsNumber() amount!: number;
  @IsString() @IsOptional() reference?: string;
  @IsString() @IsOptional() notes?: string;
}
