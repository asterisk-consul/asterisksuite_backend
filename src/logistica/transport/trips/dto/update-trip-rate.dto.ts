import { IsNumber } from 'class-validator';

export class UpdateTripRateDto {
  @IsNumber()
  value!: number;
}
