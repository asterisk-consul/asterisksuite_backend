import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class CreateDispatchOrderDto {
  @IsString()
  order_number!: string;

  @IsOptional()
  @IsString()
  status?: string;

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
  @IsDateString()
  planned_date?: string;

  @IsOptional()
  @IsUUID()
  created_by?: string;
}

export class UpdateDispatchOrderDto extends PartialType(
  CreateDispatchOrderDto,
) {}
