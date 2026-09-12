import { IsString, IsOptional, IsUUID, IsDecimal, MaxLength } from 'class-validator';

export class CreateMaintenanceLaborDto {
  @IsUUID()
  maintenance_order_id: string;

  @IsOptional()
  @IsUUID()
  employee_id?: string;

  @IsOptional()
  @IsUUID()
  supplier_id?: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsDecimal()
  hours: string;

  @IsDecimal()
  hourly_cost: string;

  @IsOptional()
  @IsUUID()
  document_id?: string;
}

export class UpdateMaintenanceLaborDto {
  @IsOptional()
  @IsUUID()
  employee_id?: string;

  @IsOptional()
  @IsUUID()
  supplier_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsDecimal()
  hours?: string;

  @IsOptional()
  @IsDecimal()
  hourly_cost?: string;

  @IsOptional()
  @IsUUID()
  document_id?: string;
}