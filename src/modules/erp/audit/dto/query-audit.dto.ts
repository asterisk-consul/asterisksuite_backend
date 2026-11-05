import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
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
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  filters?: string;

  @IsOptional()
  @IsIn(['changed_at', 'table_name', 'record_id', 'action'])
  sort?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

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
