import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductVariantDto {
  @IsUUID()
  product_id!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  thickness_mm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  density_kg_m3?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight_kg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost_price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sale_price?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}
