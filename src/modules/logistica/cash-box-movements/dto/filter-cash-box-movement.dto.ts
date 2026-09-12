import { IsString, IsOptional, IsDateString } from 'class-validator';

export class FilterCashBoxMovementDto {
  @IsString()
  @IsOptional()
  cash_box_id?: string;

  @IsString()
  @IsOptional()
  session_id?: string;

  @IsString()
  @IsOptional()
  employee_id?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  currency_code?: string;

  @IsDateString()
  @IsOptional()
  date_from?: string;

  @IsDateString()
  @IsOptional()
  date_to?: string;
}
