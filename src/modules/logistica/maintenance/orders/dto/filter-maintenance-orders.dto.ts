import { IsOptional, IsEnum, IsUUID, IsDateString, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  MaintenanceAssetType,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceType,
  MaintenanceCategory,
} from '../../enums/maintenance.enums';

export class FilterMaintenanceOrdersDto {
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;

  @IsOptional()
  @IsUUID()
  vehicle_id?: string;

  @IsOptional()
  @IsUUID()
  tire_id?: string;

  @IsOptional()
  @IsEnum(MaintenanceCategory)
  category?: MaintenanceCategory;

  @IsOptional()
  @IsEnum(MaintenanceType)
  maintenance_type?: MaintenanceType;

  @IsOptional()
  @IsEnum(MaintenancePriority)
  priority?: MaintenancePriority;

  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @IsOptional()
  @IsUUID()
  supplier_id?: string;

  @IsOptional()
  @IsUUID()
  assigned_to?: string;

  @IsOptional()
  @IsEnum(MaintenanceAssetType)
  asset_type?: MaintenanceAssetType;

  @IsOptional()
  @IsUUID()
  asset_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sort_by?: string = 'reported_at';

  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'desc';
}