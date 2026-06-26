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

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';

import { ProductPriceService } from './product-pricing.service';

import { CreateProductPriceDto } from './dto/create-product-price.dto';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@Controller('product-prices')
@UseGuards(JwtAuthGuard)
export class ProductPriceController {
  constructor(private readonly productPriceService: ProductPriceService) {}

  // =========================================================
  // CREATE
  // =========================================================

  @Post()
  create(
    @Body()
    dto: CreateProductPriceDto,

    @CurrentUser()
    user: AuthUser,
  ) {
    return this.productPriceService.create(dto, user.id);
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
  findOne(@Param('id') id: string) {
    return this.productPriceService.findOne(id);
  }

  // =========================================================
  // UPDATE
  // =========================================================

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductPriceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.productPriceService.update(id, dto, user.id);
  }

  // =========================================================
  // DELETE
  // =========================================================

  @Delete(':id')
  remove(
    @Param('id') id: string,

    @CurrentUser() user: AuthUser,
  ) {
    return this.productPriceService.remove(id, user.id);
  }
}
