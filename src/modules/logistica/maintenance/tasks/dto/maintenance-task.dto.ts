import { IsString, IsOptional, IsUUID, IsEnum, IsDecimal, IsBoolean, MaxLength } from 'class-validator';
import { MaintenanceTaskStatus } from '../../enums/maintenance.enums';

export class CreateMaintenanceTaskDto {
  @IsUUID()
  maintenance_order_id: string;

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

export class UpdateMaintenanceTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(MaintenanceTaskStatus)
  status?: MaintenanceTaskStatus;

  @IsOptional()
  @IsUUID()
  assigned_to?: string;

  @IsOptional()
  @IsDecimal()
  estimated_hours?: string;

  @IsOptional()
  @IsDecimal()
  actual_hours?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}