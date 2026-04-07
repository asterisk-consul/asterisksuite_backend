import {
  IsUUID,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { TripStatus } from '@/generated/prisma/enums';

export class CreateTripDto {
  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsString()
  week?: string;

  @IsOptional()
  @IsUUID()
  vehicle_combination_id?: string;

  @IsOptional()
  @IsUUID()
  origin_location_id?: string;

  @IsOptional()
  @IsUUID()
  destination_location_id?: string;

  @IsOptional()
  @IsDateString()
  departure_time?: Date;

  @IsOptional()
  @IsDateString()
  arrival_time?: Date;

  @IsEnum(TripStatus)
  status!: TripStatus;

  @IsOptional()
  @IsNumber()
  kilometers?: number;
}
