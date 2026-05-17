import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ProductPriceService } from './product-pricing.service';

import { CreateProductPriceDto } from './dto/create-product-price.dto';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';

@Controller('product-prices')
export class ProductPriceController {
  constructor(private readonly productPriceService: ProductPriceService) {}

  // =========================================================
  // CREATE
  // =========================================================

  @Post()
  create(
    @Body()
    dto: CreateProductPriceDto,
  ) {
    return this.productPriceService.create(dto);
  }

  // =========================================================
  // FIND BY PRODUCT
  // =========================================================

  @Get('product/:productId')
  findByProduct(
    @Param('productId')
    productId: string,
  ) {
    return this.productPriceService.findByProduct(productId);
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.productPriceService.findOne(id);
  }

  // =========================================================
  // UPDATE
  // =========================================================

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateProductPriceDto,
  ) {
    return this.productPriceService.update(id, dto);
  }

  // =========================================================
  // DELETE
  // =========================================================

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.productPriceService.remove(id);
  }
}
