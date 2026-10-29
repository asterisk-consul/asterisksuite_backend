import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';

export enum HrValeTypeDto {
  SUELDO = 'SUELDO',
  ADELANTO = 'ADELANTO',
  EXTRAS = 'EXTRAS',
  COMISION = 'COMISION',
  RETIRO = 'RETIRO',
  REEMBOLSO = 'REEMBOLSO',
  PRESTAMO = 'PRESTAMO',
  APORTE = 'APORTE',
}

export class CreateHrValeDto {
  @IsString()
  party_id: string;

  @IsString()
  party_type: string;

  @IsEnum(HrValeTypeDto)
  type: HrValeTypeDto;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsString()
  currency_code: string;

  @IsNumber()
  @IsOptional()
  exchange_rate?: number;

  @IsString()
  @IsOptional()
  rate_type?: string;

  @IsNumber()
  @IsOptional()
  converted_amount?: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;
}
