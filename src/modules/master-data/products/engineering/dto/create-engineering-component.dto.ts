import { IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateEngineeringComponentDto {
  @IsUUID()
  parent_product_id!: string;

  @IsUUID()
  child_product_id!: string;

  @IsOptional()
  @IsUUID()
  child_variant_id?: string;

  @IsNumber()
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
  waste_percentage?: number;
  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
