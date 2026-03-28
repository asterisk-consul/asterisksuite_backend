import { IsUUID, IsNumber } from 'class-validator';

export class CreateTripRateDto {
  @IsUUID()
  rate_id!: string;

  @IsNumber()
  value!: number;
}
