import {
  IsUUID,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateTripDto {
  @IsUUID()
  company_id!: string;

  @IsOptional()
  @IsString()
  reference_number?: string;

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

  @IsString()
  status!: string;

  @IsOptional()
  @IsNumber()
  kilometers?: number;
}
