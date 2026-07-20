import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum HrValeTypeDto {
  RETIRO = 'RETIRO',
  ADELANTO = 'ADELANTO',
  REEMBOLSO = 'REEMBOLSO',
  PRESTAMO = 'PRESTAMO',
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
