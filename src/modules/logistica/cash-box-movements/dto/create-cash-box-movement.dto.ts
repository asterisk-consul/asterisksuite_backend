import { IsString, IsEnum, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateCashBoxMovementDto {
  @IsString()
  cash_box_id!: string;

  @IsString()
  @IsOptional()
  session_id?: string;

  @IsString()
  @IsOptional()
  employee_id?: string;

  @IsEnum(['PAYMENT', 'COLLECTION', 'ADVANCE', 'LOAN', 'LOAN_PAYMENT', 'ADJUSTMENT', 'TRANSFER', 'CHECK_ISSUED', 'CHECK_RECEIVED'] as const)
  type!: string;

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

  @IsString()
  @IsOptional()
  bank_account_id?: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}
