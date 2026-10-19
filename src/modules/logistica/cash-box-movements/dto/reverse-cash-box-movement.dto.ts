import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class ReverseCashBoxMovementDto {
  @IsUUID()
  cash_box_id!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason!: string;
}
