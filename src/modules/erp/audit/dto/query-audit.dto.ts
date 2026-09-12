import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum AuditActionFilter {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
}

export class QueryAuditDto {
  @IsOptional()
  @IsString()
  table?: string;

  @IsOptional()
  @IsString()
  record_id?: string;

  @IsOptional()
  @IsEnum(AuditActionFilter)
  action?: AuditActionFilter;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  @Type(() => Number)
  days?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
