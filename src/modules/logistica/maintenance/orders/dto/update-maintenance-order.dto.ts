import { PartialType } from '@nestjs/mapped-types';
import { CreateMaintenanceOrderDto } from './create-maintenance-order.dto';
import { IsOptional, IsEnum, IsUUID, IsDateString, IsDecimal, IsBoolean, IsString, MaxLength } from 'class-validator';
import { MaintenancePriority, MaintenanceStatus } from '../../enums/maintenance.enums';

export class UpdateMaintenanceOrderDto extends PartialType(CreateMaintenanceOrderDto) {
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @IsOptional()
  @IsEnum(MaintenancePriority)
  priority?: MaintenancePriority;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsDateString()
  started_at?: string;

  @IsOptional()
  @IsDateString()
  completed_at?: string;
}