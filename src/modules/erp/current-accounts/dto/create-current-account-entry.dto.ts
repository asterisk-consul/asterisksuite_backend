import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, Min } from 'class-validator';

export class CreateCurrentAccountEntryDto {
  @IsString()
  party_id!: string;

  @IsString()
  party_type!: string;

  @IsString()
  currency_code!: string;

  @IsEnum([
    'PAYMENT',
    'COLLECTION',
    'ADVANCE',
    'LOAN',
    'LOAN_PAYMENT',
    'ADJUSTMENT',
    'TRANSFER',
    'CHECK_ISSUED',
    'CHECK_RECEIVED',
    'CHECK_BOUNCED',
    'INVOICE',
    'CREDIT_NOTE',
    'DEBIT_NOTE',
    'DEBIT',
    'CREDIT',
    'OPENING_BALANCE'
  ] as const)
  type!: string;

  @IsNumber()
  amount!: number;

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
  description?: string;

  @IsString()
  @IsOptional()
  reference_type?: string;

  @IsString()
  @IsOptional()
  reference_id?: string;

  @IsString()
  @IsOptional()
  payment_id?: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}
