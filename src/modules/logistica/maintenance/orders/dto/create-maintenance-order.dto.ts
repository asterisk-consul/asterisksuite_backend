import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  IsNumber,
  IsDecimal,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
  IsInt,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  MaintenanceAssetType,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceType,
  MaintenanceCategory,
} from '../../enums/maintenance.enums';

export class CreateMaintenanceTaskDto {
  @IsString()
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsUUID()
  assigned_to?: string;

  @IsOptional()
  @IsDecimal()
  estimated_hours?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

export class CreateMaintenancePartDto {
  @IsUUID()
  product_id: string;

  @IsUUID()
  warehouse_id: string;

  @IsDecimal()
  quantity: string;

  @IsDecimal()
  unit_cost: string;
}

export class CreateMaintenanceLaborDto {
  @IsUUID()
  employee_id: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsDecimal()
  hours: string;

  @IsDecimal()
  hourly_cost: string;
}

export class CreateMaintenanceServiceDto {
  @IsUUID()
  supplier_id: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsDecimal()
  quantity: string;

  @IsDecimal()
  unit_cost: string;

  @IsOptional()
  @IsUUID()
  document_id?: string;
}

export class CreateMaintenanceOrderDto {
  @IsEnum(MaintenanceAssetType)
  asset_type: MaintenanceAssetType;

  @IsUUID()
  asset_id: string;

  @IsOptional()
  @IsUUID()
  vehicle_id?: string;

  @IsOptional()
  @IsUUID()
  tire_id?: string;

  @IsEnum(MaintenanceCategory)
  category: MaintenanceCategory;

  @IsEnum(MaintenanceType)
  maintenance_type: MaintenanceType;

  @IsOptional()
  @IsEnum(MaintenancePriority)
  priority?: MaintenancePriority = MaintenancePriority.MEDIUM;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  reported_problem?: string;

  @IsOptional()
  @IsDateString()
  scheduled_at?: string;

  @IsOptional()
  @IsDecimal({ force_decimal: false, decimal_digits: '0,2' })
  @Transform(({ value }) => (value !== null && value !== undefined ? String(value) : value))
  odometer?: string | number;

  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => (value === '' ? undefined : value))
  reported_by?: string;

  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => (value === '' ? undefined : value))
  assigned_to?: string;

  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => (value === '' ? undefined : value))
  supplier_id?: string;

  @IsOptional()
  @IsDecimal()
  estimated_cost?: string;

  @IsOptional()
  @IsBoolean()
  vehicle_unavailable?: boolean = false;

  @IsOptional()
  @IsDateString()
  unavailable_from?: string;

  @IsOptional()
  @IsDateString()
  unavailable_until?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMaintenanceTaskDto)
  tasks?: CreateMaintenanceTaskDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMaintenancePartDto)
  parts?: CreateMaintenancePartDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMaintenanceLaborDto)
  labor?: CreateMaintenanceLaborDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMaintenanceServiceDto)
  services?: CreateMaintenanceServiceDto[];
}