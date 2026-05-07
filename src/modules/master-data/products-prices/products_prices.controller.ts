// product-price.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProductPriceService } from './products_prices.service';
import { CreateProductPriceDto } from './dto/create-product-price.dto';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';

@Controller('product-price')
export class ProductPriceController {
  constructor(private readonly productPriceService: ProductPriceService) {}

  // POST /product-price
  @Post()
  create(@Body() dto: CreateProductPriceDto) {
    return this.productPriceService.create(dto);
  }

  // GET /product-price/product/:productId
  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.productPriceService.findByProduct(productId);
  }

  // GET /product-price/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productPriceService.findOne(id);
  }

  // PATCH /product-price/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductPriceDto) {
    return this.productPriceService.update(id, dto);
  }

  // DELETE /product-price/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productPriceService.remove(id);
  }
}
