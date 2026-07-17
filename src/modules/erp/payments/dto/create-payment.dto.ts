import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentDocumentDto {
  @IsString()
  document_id!: string;

  @IsNumber()
  @Min(0.01)
  amount_applied!: number;
}

export class CreatePaymentDto {
  @IsEnum(['PAYMENT', 'COLLECTION'] as const)
  type!: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  party_id?: string;

  @IsString()
  @IsOptional()
  party_type?: string;

  @IsEnum(['CASH', 'CHECK', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'VIRTUAL_WALLET'] as const)
  payment_method!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  currency_code!: string;

  @IsNumber()
  @IsOptional()
  exchange_rate?: number;

  @IsString()
  @IsOptional()
  rate_type?: string;

  @IsNumber()
  @IsOptional()
  converted_amount?: number;

  @IsString()
  @IsOptional()
  exchange_note?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  bank_account_id?: string;

  @IsString()
  @IsOptional()
  cash_box_id?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  check_ids?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDocumentDto)
  @IsOptional()
  documents?: PaymentDocumentDto[];

  @IsInt()
  @IsOptional()
  status?: number;
}
