import { IsString, IsOptional, IsEnum, IsDateString, MaxLength, IsUUID } from 'class-validator';
import { OperationType, TransportType, Incoterm } from '@/generated/prisma/enums';

export class CreateOperationDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsEnum(OperationType)
  operation_type?: OperationType;

  @IsOptional()
  @IsEnum(TransportType)
  transport_type?: TransportType;

  @IsOptional()
  @IsUUID()
  primary_supplier_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  origin_country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  origin_location?: string;

  @IsOptional()
  @IsUUID()
  origin_location_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  destination_country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  destination_location?: string;

  @IsOptional()
  @IsUUID()
  destination_location_id?: string;

  @IsOptional()
  @IsDateString()
  estimated_departure_date?: string;

  @IsOptional()
  @IsDateString()
  estimated_arrival_date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency_code?: string;

  @IsOptional()
  @IsEnum(Incoterm)
  incoterm?: Incoterm;

  @IsOptional()
  @IsUUID()
  responsible_user_id?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
