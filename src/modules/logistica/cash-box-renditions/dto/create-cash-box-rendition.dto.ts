import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateCashBoxRenditionDto {
  @IsString()
  cash_box_id!: string;

  @IsDateString()
  start_date!: string;

  @IsDateString()
  end_date!: string;

  @IsNumber()
  opening_balance!: number;

  @IsNumber()
  closing_balance!: number;

  @IsNumber()
  @IsOptional()
  actual_balance?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
