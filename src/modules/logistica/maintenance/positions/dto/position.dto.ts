import { IsString, IsOptional, IsUUID, IsInt, IsEnum, Min, MaxLength } from 'class-validator';
import { TirePositionSide } from '../../enums/maintenance.enums';

export class CreateVehicleTirePositionDto {
  @IsUUID()
  vehicle_id: string;

  @IsInt()
  @Min(1)
  position_number: number;

  @IsInt()
  @Min(1)
  axle: number;

  @IsEnum(TirePositionSide)
  side: TirePositionSide;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  position_type?: string;
}

export class UpdateVehicleTirePositionDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  position_number?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  axle?: number;

  @IsOptional()
  @IsEnum(TirePositionSide)
  side?: TirePositionSide;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  position_type?: string;
}