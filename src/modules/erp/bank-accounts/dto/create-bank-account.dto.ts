import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateBankAccountDto {
  @IsString()
  name!: string;

  @IsString()
  bank_name!: string;

  @IsString()
  account_type!: string;

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
  currency_code!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balance?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
