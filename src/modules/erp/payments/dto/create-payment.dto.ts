import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentDocumentDto {
  @IsString()
  document_id!: string;

  @IsNumber()
  @Min(0.01)
  amount_applied!: number;
}

export class PaymentWithholdingAllocationDto {
  @IsString()
  document_id!: string;

  @IsNumber()
  @Min(0.01)
  allocated_amount!: number;
}

export class PaymentWithholdingDto {
  @IsEnum(['GANANCIAS', 'IIBB', 'SUSS', 'IVA'] as const)
  tax_type!: string;

  @IsString()
  @IsOptional()
  jurisdiction_id?: string;

  @IsString()
  @IsOptional()
  withholding_concept_id?: string;

  @IsString()
  @IsOptional()
  tax_rule_id?: string;

  @IsNumber()
  @Min(0.01)
  base_amount!: number;

  @IsNumber()
  @IsOptional()
  rate?: number;

  @IsNumber()
  @Min(0.01)
  withheld_amount!: number;

  @IsString()
  @IsOptional()
  certificate_number?: string;

  @IsDateString()
  @IsOptional()
  certificate_date?: string;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentWithholdingAllocationDto)
  @IsOptional()
  allocations?: PaymentWithholdingAllocationDto[];
}

export class PaymentCheckDto {
  @IsString()
  check_id!: string;

  @IsNumber()
  @Min(0.01)
  amount_applied!: number;
}

export class CreatePaymentDto {
  @IsEnum(['PAYMENT', 'COLLECTION'] as const)
  type!: string;

  @IsEnum(['NORMAL', 'ADVANCE'] as const)
  @IsOptional()
  payment_mode?: string;

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

  @IsString()
  @IsOptional()
  account_id?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  check_ids?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentCheckDto)
  @IsOptional()
  checks?: PaymentCheckDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDocumentDto)
  @IsOptional()
  documents?: PaymentDocumentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentWithholdingDto)
  @IsOptional()
  withholdings?: PaymentWithholdingDto[];

  @IsEnum(['DRAFT', 'CONFIRMED', 'PAID', 'REVERSED', 'CANCELLED'] as const)
  @IsOptional()
  status?: string;
}
