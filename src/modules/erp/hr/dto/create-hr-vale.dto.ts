import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum HrValeTypeDto {
  SUELDO = 'SUELDO',
  ADELANTO = 'ADELANTO',
  EXTRAS = 'EXTRAS',
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

  @IsNumber()
  amount: number;

  @IsString()
  currency_code: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;
}
