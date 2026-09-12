import { IsUUID, IsDecimal, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateProductSupplierDto {
  @IsUUID()
  product_id!: string;

  @IsUUID()
  supplier_id!: string;

  @IsDecimal()
  purchase_price!: string;

  @IsUUID()
  currency_id!: string;

  @IsOptional()
  @IsInt()
  lead_time_days?: number;

  @IsOptional()
  @IsDecimal()
  min_order_quantity?: string;

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateProductSupplierDto {
  @IsOptional()
  @IsDecimal()
  purchase_price?: string;

  @IsOptional()
  @IsUUID()
  currency_id?: string;

  @IsOptional()
  @IsInt()
  lead_time_days?: number;

  @IsOptional()
  @IsDecimal()
  min_order_quantity?: string;

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
