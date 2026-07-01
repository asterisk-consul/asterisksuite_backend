import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { ProductCategoriesService } from './product-categories.service';

import { AssignProductCategoryDto } from './dto/assign-product-category.dto';
import { BulkAssignProductCategoriesDto } from './dto/bulk-assign-product-categories.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  // @RequirePermissions('product_categories.create')
  @Post()
  assign(@Body() dto: AssignProductCategoryDto) {
    return this.productCategoriesService.assign(dto);
  }

  // @RequirePermissions('product_categories.create')
  @Post('bulk')
  bulkAssign(@Body() dto: BulkAssignProductCategoriesDto) {
    return this.productCategoriesService.bulkAssign(dto);
  }

  // @RequirePermissions('product_categories.read')
  @Get('product/:productId')
  getProductCategories(@Param('productId') productId: string) {
    return this.productCategoriesService.getProductCategories(productId);
  }

  // @RequirePermissions('product_categories.delete')
  @Delete(':productId/:categoryId')
  remove(
    @Param('productId') productId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.productCategoriesService.remove(productId, categoryId);
  }
}
