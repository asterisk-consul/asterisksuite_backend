import { IsString, IsOptional, IsUUID, IsDecimal, MaxLength } from 'class-validator';

export class CreateMaintenanceServiceDto {
  @IsUUID()
  maintenance_order_id: string;

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

export class UpdateMaintenanceServiceDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsDecimal()
  quantity?: string;

  @IsOptional()
  @IsDecimal()
  unit_cost?: string;

  @IsOptional()
  @IsUUID()
  supplier_id?: string;

  @IsOptional()
  @IsUUID()
  document_id?: string;
}