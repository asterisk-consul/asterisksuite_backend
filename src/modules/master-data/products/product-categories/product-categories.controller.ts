import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { ProductCategoriesService } from './product-categories.service';

import { AssignProductCategoryDto } from './dto/assign-product-category.dto';
import { BulkAssignProductCategoriesDto } from './dto/bulk-assign-product-categories.dto';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Post()
  assign(@Body() dto: AssignProductCategoryDto) {
    return this.productCategoriesService.assign(dto);
  }

  @Post('bulk')
  bulkAssign(@Body() dto: BulkAssignProductCategoriesDto) {
    return this.productCategoriesService.bulkAssign(dto);
  }

  @Get('product/:productId')
  getProductCategories(@Param('productId') productId: string) {
    return this.productCategoriesService.getProductCategories(productId);
  }

  @Delete(':productId/:categoryId')
  remove(
    @Param('productId') productId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.productCategoriesService.remove(productId, categoryId);
  }
}
