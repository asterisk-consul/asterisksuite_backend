import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { ProductCategoriesController } from './product-categories.controller';
import { ProductCategoriesService } from './product-categories.service';

@Module({
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService, PrismaService],
  exports: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
