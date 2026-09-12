import { IsOptional, IsDateString, IsUUID, IsString } from 'class-validator';

export class QueryPaymentReportDto {
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;

  @IsOptional()
  @IsUUID()
  created_by?: string;

  @IsOptional()
  @IsString()
  currency_code?: string;

  @IsOptional()
  @IsUUID()
  cash_box_id?: string;

  @IsOptional()
  @IsUUID()
  bank_account_id?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
