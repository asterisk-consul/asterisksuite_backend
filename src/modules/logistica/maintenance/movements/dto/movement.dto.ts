import { IsString, IsOptional, IsUUID, IsEnum, IsDecimal, IsDateString, MaxLength } from 'class-validator';
import { TireMovementType, TireLocationType } from '../../enums/maintenance.enums';

export class CreateTireMovementDto {
  @IsUUID()
  tire_id: string;

  @IsEnum(TireMovementType)
  movement_type: TireMovementType;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsUUID()
  vehicle_id?: string;

  @IsOptional()
  @IsUUID()
  position_id?: string;

  @IsOptional()
  @IsDecimal()
  odometer?: string;

  @IsOptional()
  @IsUUID()
  from_location_id?: string;

  @IsOptional()
  @IsUUID()
  to_location_id?: string;

  @IsOptional()
  @IsEnum(TireLocationType)
  from_location_type?: TireLocationType;

  @IsOptional()
  @IsEnum(TireLocationType)
  to_location_type?: TireLocationType;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

export class FilterTireMovementsDto {
  @IsOptional()
  @IsUUID()
  tire_id?: string;

  @IsOptional()
  @IsUUID()
  vehicle_id?: string;

  @IsOptional()
  @IsEnum(TireMovementType)
  movement_type?: TireMovementType;

  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 50;
}