import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  IsNumber,
  IsUUID,
  IsDateString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateVehicleDocumentDto {
  @IsOptional()
  @IsUUID()
  id?: string; // id de documents_vehicle

  @IsOptional()
  @IsUUID()
  documentTypeId?: string; // requerido si es nuevo

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  type?: string;

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
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVehicleDocumentDto)
  documents?: UpdateVehicleDocumentDto[];
}
