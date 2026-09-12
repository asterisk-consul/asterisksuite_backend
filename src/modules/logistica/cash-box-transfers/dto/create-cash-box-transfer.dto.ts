import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateCashBoxTransferDto {
  @IsString()
  @IsOptional()
  session_id?: string;

  @IsEnum(['cash_box', 'bank_account'] as const)
  source_type!: string;

  @IsString()
  source_id!: string;

  @IsEnum(['cash_box', 'bank_account'] as const)
  dest_type!: string;

  @IsString()
  dest_id!: string;

  @IsNumber()
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
  description?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsEnum(['CASH_TO_CASH', 'CASH_TO_BANK', 'BANK_TO_CASH', 'BANK_TO_BANK'] as const)
  transfer_type!: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}
