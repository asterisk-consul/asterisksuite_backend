import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsUUID,
  ValidateNested,
  IsArray,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { DispatchStatus } from '@/generated/prisma/enums';

/**
 * 🔹 Rates
 */
export class DispatchRateDto {
  @IsUUID()
  rate_id!: string;

  @IsNumber()
  value!: number;
}

/**
 * 🔹 CREATE
 */
export class CreateDispatchOrderDto {
  @IsString()
  order_number!: string;

  @IsEnum(DispatchStatus)
  status?: DispatchStatus;

  @IsOptional()
  @IsBoolean()
  requires_stock?: boolean;

  @IsOptional()
  @IsUUID()
  customer_id?: string;

  @IsOptional()
  @IsUUID()
  origin_location_id?: string;

  @IsOptional()
  @IsUUID()
  destination_location_id?: string;

  @IsOptional()
  @IsUUID()
  corridor_id?: string;

  @IsOptional()
  @IsDateString()
  planned_date?: string;

  /**
   * 🔥 rates
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DispatchRateDto)
  rates?: DispatchRateDto[];
}

/**
 * UPDATE
 */
export class UpdateDispatchOrderDto extends PartialType(
  CreateDispatchOrderDto,
) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DispatchRateDto)
  rates?: DispatchRateDto[];
}
