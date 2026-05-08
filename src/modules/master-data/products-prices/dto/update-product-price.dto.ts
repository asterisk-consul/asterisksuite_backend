// update-product-price.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductPriceDto } from './create-product-price.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateProductPriceDto extends PartialType(CreateProductPriceDto) {
  @IsOptional()
  @IsUUID()
  updated_by?: string;
}
