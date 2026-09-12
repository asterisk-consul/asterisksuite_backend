import { IsString, IsOptional, IsEnum, IsDateString, IsUUID, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ContainerType } from '@/generated/prisma/enums';

export class CreateContainerDto {
  @IsString()
  @MaxLength(50)
  container_number!: string;

  @IsOptional()
  @IsEnum(ContainerType)
  container_type?: ContainerType;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  seal_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  booking_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  bill_of_lading?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  vessel_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  voyage_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  origin_port?: string;

  @IsOptional()
  @IsUUID()
  origin_port_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  destination_port?: string;

  @IsOptional()
  @IsUUID()
  destination_port_id?: string;

  @IsOptional()
  @IsDateString()
  estimated_departure_date?: string;

  @IsOptional()
  @IsDateString()
  estimated_arrival_date?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? undefined : String(value)))
  weight?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? undefined : String(value)))
  volume?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
