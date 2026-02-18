import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNumber,
} from 'class-validator';

export class CreateVehicleDto {
  @IsUUID()
  companyId!: string;

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
}
