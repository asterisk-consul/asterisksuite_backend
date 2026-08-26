import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDecimal,
  IsDateString,
  IsInt,
  Min,
  MaxLength,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TireStatus, TireMovementType, TireLocationType } from '../../enums/maintenance.enums';

export class CreateTireDto {
  @IsUUID()
  product_id: string;

  @IsString()
  @MaxLength(50)
  serial_number: string;

  @IsOptional()
  @IsUUID()
  purchase_document_id?: string;

  @IsOptional()
  @IsUUID()
  purchase_document_line_id?: string;

  @IsOptional()
  @IsDateString()
  purchase_date?: string;

  @IsOptional()
  @IsUUID()
  purchase_supplier_id?: string;

  @IsOptional()
  @IsDecimal()
  purchase_unit_cost?: string;

  @IsOptional()
  @IsUUID()
  purchase_receipt_document_id?: string;

  @IsOptional()
  @IsUUID()
  purchase_order_id?: string;

  @IsOptional()
  @IsUUID()
  current_warehouse_id?: string;
}

export class UpdateTireDto {
  @IsOptional()
  @IsEnum(TireStatus)
  status?: TireStatus;

  @IsOptional()
  @IsUUID()
  current_warehouse_id?: string;

  @IsOptional()
  @IsUUID()
  current_tire_shop_id?: string;

  @IsOptional()
  @IsDecimal()
  accumulated_km?: string;

  @IsOptional()
  @IsInt()
  days_in_use?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

export class InstallTireDto {
  @IsUUID()
  vehicle_id: string;

  @IsUUID()
  position_id: string;

  @IsDecimal()
  odometer: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class RemoveTireDto {
  @IsEnum(TireLocationType)
  to_location_type: TireLocationType;

  @IsOptional()
  @IsUUID()
  to_location_id?: string;

  @IsDecimal()
  odometer: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class RotateTireDto {
  @IsUUID()
  new_position_id: string;

  @IsDecimal()
  odometer: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class RepairTireDto {
  @IsUUID()
  supplier_id: string;

  @IsDecimal()
  cost: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsUUID()
  document_id?: string;

  @IsOptional()
  @IsDecimal()
  odometer?: string;

  @IsOptional()
  @IsBoolean()
  is_retread?: boolean = false;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class ScrapTireDto {
  @IsString()
  @MaxLength(1000)
  reason: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class SellTireDto {
  @IsUUID()
  customer_id: string;

  @IsDecimal()
  sale_price: string;

  @IsOptional()
  @IsUUID()
  document_id?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class FilterTiresDto {
  @IsOptional()
  @IsUUID()
  product_id?: string;

  @IsOptional()
  @IsUUID()
  vehicle_id?: string;

  @IsOptional()
  @IsUUID()
  warehouse_id?: string;

  @IsOptional()
  @IsUUID()
  tire_shop_id?: string;

  @IsOptional()
  @IsEnum(TireStatus)
  status?: TireStatus;

  @IsOptional()
  @IsString()
  serial_number?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}