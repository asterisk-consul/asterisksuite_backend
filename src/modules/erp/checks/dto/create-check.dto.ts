import { IsBoolean, IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCheckDto {
  @IsOptional()
  @IsString()
  payment_id?: string;

  @IsOptional()
  @IsString()
  bank_account_id?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  check_number!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  bank_name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bank_branch?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  account_number?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  issuer_name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  issuer_id?: string;

  @IsNotEmpty()
  @Min(0.01)
  amount!: number;

  @IsNotEmpty()
  @IsString()
  currency_code!: string;

  @IsNotEmpty()
  @IsDateString()
  issue_date!: string;

  @IsNotEmpty()
  @IsDateString()
  due_date!: string;

  @IsOptional()
  @IsBoolean()
  is_own?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;

  @IsOptional()
  @IsDateString()
  payment_date?: string;

  @IsOptional()
  @IsString()
  party_id?: string;

  @IsOptional()
  @IsString()
  party_type?: string;
}
