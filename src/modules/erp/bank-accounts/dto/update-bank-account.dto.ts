import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class UpdateBankAccountDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  bank_name?: string;

  @IsString()
  @IsOptional()
  account_type?: string;

  @IsString()
  @IsOptional()
  cbu?: string;

  @IsString()
  @IsOptional()
  alias?: string;

  @IsString()
  @IsOptional()
  account_number?: string;

  @IsString()
  @IsOptional()
  currency_code?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balance?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
