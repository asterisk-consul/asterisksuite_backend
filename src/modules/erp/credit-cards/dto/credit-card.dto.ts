import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateCreditCardDto {
  @IsString() name!: string;
  @IsEnum(['COMPANY', 'CUSTOMER'] as const) type!: 'COMPANY' | 'CUSTOMER';
  @IsEnum(['VISA', 'MASTERCARD', 'AMEX', 'NARANJA', 'CABAL', 'OTHER'] as const) @IsOptional() brand?: string;
  @IsEnum(['POS', 'APP', 'QR', 'PAYMENT_LINK', 'ECOMMERCE', 'OTHER'] as const) @IsOptional() channel_type?: string;
  @IsString() @IsOptional() last_four?: string;
  @IsString() bank_name!: string;
  @IsString() @IsOptional() holder_name?: string;
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
  @IsNumber() @Min(0) commission_amount!: number;
  @IsNumber() @Min(0) @IsOptional() tax_amount?: number;
  @IsNumber() @Min(0) @IsOptional() withholding_amount?: number;
  @IsNumber() @Min(0) @IsOptional() other_deductions?: number;
  @IsNumber() @Min(0) net_amount!: number;
  @IsString() @IsOptional() reference?: string;
  @IsString() @IsOptional() notes?: string;
}

export class SettleCardCollectionsBatchDto extends SettleCardCollectionDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(500)
  @IsUUID('4', { each: true })
  transaction_ids!: string[];
}

export class PayCreditCardSummaryDto {
  @IsString() bank_account_id!: string;
  @IsString() date!: string;
  @IsString() @IsOptional() reference?: string;
  @IsString() @IsOptional() notes?: string;
}
