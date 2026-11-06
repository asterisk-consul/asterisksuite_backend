import { IsString, IsNumber, IsOptional, IsBoolean, IsUUID, Min } from 'class-validator';

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

  @IsUUID()
  @IsOptional()
  accounting_account_id?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balance?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
