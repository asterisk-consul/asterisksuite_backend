import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNumber,
  ValidateNested,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateVehicleDocumentDto {
  @IsUUID()
  documentTypeId!: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}

export class CreateVehicleDto {
  @IsString()
  type!: string;

  @IsString()
  plate!: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsNumber()
  maxWeight?: number;

  @IsOptional()
  @IsNumber()
  maxVolume?: number;

  @IsOptional()
  @IsBoolean()
  refrigeration?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVehicleDocumentDto)
  documents?: CreateVehicleDocumentDto[];
}
