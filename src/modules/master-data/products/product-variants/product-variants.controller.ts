import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProductVariantsService } from './product-variants.service';

import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('erp/product-variants')
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Post()
  create(@Body() dto: CreateProductVariantDto) {
    return this.productVariantsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productVariantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariantsService.findOne(id);
  }

  @Get('/product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.productVariantsService.findByProduct(productId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductVariantDto) {
    return this.productVariantsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productVariantsService.remove(id);
  }
}
