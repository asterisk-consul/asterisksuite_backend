import { IsUUID, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateVehicleCombinationDto {
  @IsUUID()
  tractor_id!: string;

  @IsOptional()
  @IsUUID()
  trailer_id?: string;

  @IsDateString()
  valid_from!: string;

  @IsOptional()
  @IsDateString()
  valid_until?: string;

  @IsOptional()
  @IsUUID()
  driver_id?: string;

  @IsOptional()
  @IsString()
  unit_number?: string;
}
