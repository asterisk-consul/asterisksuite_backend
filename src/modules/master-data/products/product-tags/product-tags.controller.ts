import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { ProductTagsService } from './product-tags.service';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('erp/product-tags')
export class ProductTagsController {
  constructor(private readonly productTagsService: ProductTagsService) {}

  @RequirePermissions('product_tags.create')
  @Post(':productId/:tagId')
  assign(@Param('productId') productId: string, @Param('tagId') tagId: string) {
    return this.productTagsService.assign(productId, tagId);
  }

  @RequirePermissions('product_tags.delete')
  @Delete(':productId/:tagId')
  remove(@Param('productId') productId: string, @Param('tagId') tagId: string) {
    return this.productTagsService.remove(productId, tagId);
  }

  @RequirePermissions('product_tags.read')
  @Get(':productId')
  getProductTags(@Param('productId') productId: string) {
    return this.productTagsService.getProductTags(productId);
  }
}
