import { IsOptional, IsDateString } from 'class-validator';

export class UpdateVehicleCombinationDto {
  @IsOptional()
  @IsDateString()
  validUntil?: string;
}
