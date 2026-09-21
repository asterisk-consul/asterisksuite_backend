import { IsString, IsOptional, IsEnum, IsDateString, MaxLength, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { OperationType, TransportType, Incoterm } from '@/generated/prisma/enums';

export class UpdateOperationDto {
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
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? undefined : value))
  @IsDateString()
  estimated_departure_date?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? undefined : value))
  @IsDateString()
  actual_departure_date?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? undefined : value))
  @IsDateString()
  estimated_arrival_date?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? undefined : value))
  @IsDateString()
  actual_arrival_date?: string;

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
  @MaxLength(50)
  customs_broker_op_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  sim_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  supplier_purchase_order?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
