import { IsString, IsOptional, IsUUID, IsDecimal, MaxLength } from 'class-validator';

export class CreateMaintenancePartDto {
  @IsUUID()
  maintenance_order_id: string;

  @IsUUID()
  product_id: string;

  @IsUUID()
  warehouse_id: string;

  @IsDecimal()
  quantity: string;

  @IsDecimal()
  unit_cost: string;

  @IsOptional()
  @IsUUID()
  document_id?: string;
}

export class UpdateMaintenancePartDto {
  @IsOptional()
  @IsDecimal()
  quantity?: string;

  @IsOptional()
  @IsDecimal()
  unit_cost?: string;

  @IsOptional()
  @IsUUID()
  warehouse_id?: string;

  @IsOptional()
  @IsUUID()
  document_id?: string;
}