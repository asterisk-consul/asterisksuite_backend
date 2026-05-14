import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateProductComponentDto {
  @IsUUID()
  parent_product_id!: string;

  @IsUUID()
  child_product_id!: string;

  @IsOptional()
  @IsUUID()
  child_variant_id?: string;

  @IsNumber()
  @Min(0.001)
  quantity!: number;

  @IsOptional()
  @IsUUID()
  unit_id?: string;

  @IsOptional()
  @IsNumber()
  length_mm?: number;

  @IsOptional()
  @IsNumber()
  width_mm?: number;

  @IsOptional()
  @IsNumber()
  height_mm?: number;

  @IsOptional()
  @IsNumber()
  calculated_weight_kg?: number;

  @IsOptional()
  @IsNumber()
  waste_percentage?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}
