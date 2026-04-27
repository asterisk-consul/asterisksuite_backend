import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @IsOptional()
  @IsBoolean()
  is_rate_type?: boolean;

  @IsOptional()
  @IsUUID()
  rate_id?: string;

  @IsOptional()
  @IsBoolean()
  price_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  requires_refrigeration?: boolean;

  // Precio base sin impuesto
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  // Impuesto asociado al producto
  @IsOptional()
  @IsUUID()
  taxId?: string;

  // Porcentaje de exención (0-100)
  @IsOptional()
  @IsNumber()
  @Min(0)
  exemptionRate?: number;
}
