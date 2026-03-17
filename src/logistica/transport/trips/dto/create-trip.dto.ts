import {
  IsUUID,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class CorridorStopDto {
  @IsUUID()
  location_id!: string;

  @IsNumber()
  stop_order!: number;
}

class RouteDto {
  @IsUUID()
  origin_location_id!: string;

  @IsUUID()
  destination_location_id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CorridorStopDto)
  stops!: CorridorStopDto[];
}

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

  // ✅ NUEVO
  @IsOptional()
  @IsUUID()
  corridor_id?: string;

  // ✅ NUEVO corredor dinámico
  @IsOptional()
  @ValidateNested()
  @Type(() => RouteDto)
  route?: RouteDto;

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
  @IsOptional()
  @IsUUID()
  business_party_id?: string;
}
