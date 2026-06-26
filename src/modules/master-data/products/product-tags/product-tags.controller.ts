import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProductTagsService } from './product-tags.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('erp/product-tags')
export class ProductTagsController {
  constructor(private readonly productTagsService: ProductTagsService) {}

  @Post(':productId/:tagId')
  assign(@Param('productId') productId: string, @Param('tagId') tagId: string) {
    return this.productTagsService.assign(productId, tagId);
  }

  @Delete(':productId/:tagId')
  remove(@Param('productId') productId: string, @Param('tagId') tagId: string) {
    return this.productTagsService.remove(productId, tagId);
  }

  @Get(':productId')
  getProductTags(@Param('productId') productId: string) {
    return this.productTagsService.getProductTags(productId);
  }
}
