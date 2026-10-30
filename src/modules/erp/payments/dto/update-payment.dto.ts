import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, IsArray, ValidateNested, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentCheckDto, PaymentDocumentDto, PaymentObligationDto, PaymentTenderDto, PaymentWithholdingDto } from './create-payment.dto';

export class UpdatePaymentDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  party_id?: string;

  @IsString()
  @IsOptional()
  party_type?: string;

  @IsEnum(['CASH', 'CHECK', 'BANK_TRANSFER', 'MIXED', 'CREDIT_CARD', 'DEBIT_CARD', 'VIRTUAL_WALLET', 'PAYROLL_DEDUCTION'] as const)
  @IsOptional()
  payment_method?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentTenderDto)
  @IsOptional()
  tenders?: PaymentTenderDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentCheckDto)
  @IsOptional()
  checks?: PaymentCheckDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  check_ids?: string[];

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  currency_code?: string;

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

  @IsString()
  @IsOptional()
  account_id?: string;

  @IsString()
  @IsOptional()
  credit_card_id?: string;

  @IsInt()
  @Min(1)
  @Max(48)
  @IsOptional()
  installments_total?: number;

  @IsString()
  @IsOptional()
  card_authorization?: string;

  @IsDateString()
  @IsOptional()
  expected_clearing_date?: string;

  @IsEnum(['NORMAL', 'ADVANCE'] as const)
  @IsOptional()
  payment_mode?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDocumentDto)
  @IsOptional()
  documents?: PaymentDocumentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentObligationDto)
  @IsOptional()
  obligations?: PaymentObligationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentWithholdingDto)
  @IsOptional()
  withholdings?: PaymentWithholdingDto[];
}
