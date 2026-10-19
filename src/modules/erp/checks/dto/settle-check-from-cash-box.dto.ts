import { IsDateString, IsUUID } from 'class-validator';

export class SettleCheckFromCashBoxDto {
  @IsUUID()
  cash_box_id!: string;

  @IsDateString()
  date!: string;
}
