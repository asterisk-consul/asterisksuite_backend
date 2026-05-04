// create-product-price.dto.ts

import { IsUUID, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateProductPriceDto {
  @IsUUID()
  product_id!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  exemptionRate?: number;
}
