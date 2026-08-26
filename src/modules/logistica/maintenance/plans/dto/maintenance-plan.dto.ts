import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsInt,
  IsDecimal,
  IsBoolean,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  MaintenanceAssetType,
  MaintenanceCategory,
  MaintenanceType,
  MaintenancePriority,
  PlanIntervalType,
} from '../../enums/maintenance.enums';

export class DefaultTaskDto {
  @IsString()
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsDecimal()
  estimated_hours?: string;
}

export class CreateMaintenancePlanDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsEnum(MaintenanceAssetType)
  asset_type: MaintenanceAssetType;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  vehicle_type?: string;

  @IsEnum(MaintenanceCategory)
  category: MaintenanceCategory;

  @IsOptional()
  @IsEnum(MaintenanceType)
  maintenance_type?: MaintenanceType = MaintenanceType.PREVENTIVE;

  @IsEnum(PlanIntervalType)
  interval_type: PlanIntervalType;

  @IsOptional()
  @IsInt()
  @Min(1)
  interval_km?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  interval_days?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  interval_months?: number;

  @IsOptional()
  @IsDateString()
  fixed_date?: string;

  @IsOptional()
  @IsEnum(MaintenancePriority)
  priority?: MaintenancePriority = MaintenancePriority.MEDIUM;

  @IsOptional()
  @IsDecimal()
  estimated_hours?: string;

  @IsOptional()
  @IsDecimal()
  estimated_cost?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DefaultTaskDto)
  default_tasks?: DefaultTaskDto[];
}

export class UpdateMaintenancePlanDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(MaintenanceCategory)
  category?: MaintenanceCategory;

  @IsOptional()
  @IsEnum(PlanIntervalType)
  interval_type?: PlanIntervalType;

  @IsOptional()
  @IsInt()
  @Min(1)
  interval_km?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  interval_days?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  interval_months?: number;

  @IsOptional()
  @IsDateString()
  fixed_date?: string;

  @IsOptional()
  @IsEnum(MaintenancePriority)
  priority?: MaintenancePriority;

  @IsOptional()
  @IsDecimal()
  estimated_hours?: string;

  @IsOptional()
  @IsDecimal()
  estimated_cost?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DefaultTaskDto)
  default_tasks?: DefaultTaskDto[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class AssignPlanToAssetDto {
  @IsUUID()
  plan_id: string;

  @IsUUID()
  asset_id: string;
}

export class CheckDueMaintenancesDto {
  @IsOptional()
  @IsUUID()
  vehicle_id?: string;

  @IsOptional()
  @IsDateString()
  as_of_date?: string;
}