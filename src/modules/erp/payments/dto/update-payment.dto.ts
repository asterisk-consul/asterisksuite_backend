import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentDocumentDto } from './create-payment.dto';

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

  @IsEnum(['CASH', 'CHECK', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'VIRTUAL_WALLET'] as const)
  @IsOptional()
  payment_method?: string;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDocumentDto)
  @IsOptional()
  documents?: PaymentDocumentDto[];
}
