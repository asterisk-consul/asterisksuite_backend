import { IsString, IsIn, IsNumber, IsOptional, IsDateString, IsNotEmpty, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateCashBoxMovementDto {
  @IsUUID()
  cash_box_id!: string;

  @IsIn(['DEBIT', 'CREDIT'])
  type!: 'DEBIT' | 'CREDIT';

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  currency_code!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  concept!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description!: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}
