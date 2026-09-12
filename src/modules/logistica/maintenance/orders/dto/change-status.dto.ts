import { IsEnum, IsOptional, IsString, MaxLength, IsUUID } from 'class-validator';
import { MaintenanceStatus } from '../../enums/maintenance.enums';

export class ChangeStatusDto {
  @IsEnum(MaintenanceStatus)
  to_status: MaintenanceStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;

  @IsOptional()
  @IsUUID()
  changed_by?: string;
}

export class BulkUpdateStatusDto {
  @IsEnum(MaintenanceStatus)
  to_status: MaintenanceStatus;

  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  ids: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}