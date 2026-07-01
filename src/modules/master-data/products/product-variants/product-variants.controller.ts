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

// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
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

  // @RequirePermissions('product_variants.create')
  @Post()
  create(@Body() dto: CreateProductVariantDto) {
    return this.productVariantsService.create(dto);
  }

  // @RequirePermissions('product_variants.read')
  @Get()
  findAll() {
    return this.productVariantsService.findAll();
  }

  // @RequirePermissions('product_variants.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariantsService.findOne(id);
  }

  // @RequirePermissions('product_variants.read')
  @Get('/product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.productVariantsService.findByProduct(productId);
  }

  // @RequirePermissions('product_variants.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductVariantDto) {
    return this.productVariantsService.update(id, dto);
  }

  // @RequirePermissions('product_variants.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productVariantsService.remove(id);
  }
}
