import { IsDateString, IsIn, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class UpdateCheckDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  check_number?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsString()
  currency_code?: string;

  @IsOptional()
  @IsDateString()
  issue_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bank_name?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  bank_account_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bank_branch?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  account_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  issuer_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  issuer_id?: string;

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsIn(['PENDING', 'CONFIRMED', 'CLEARED', 'BOUNCED', 'CANCELLED'])
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;

  @IsOptional()
  @IsDateString()
  payment_date?: string;

  @IsOptional()
  @IsDateString()
  deposit_date?: string;

  @IsOptional()
  @IsDateString()
  clearing_date?: string;
}
