import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { ProductVariantsController } from './product-variants.controller';
import { ProductVariantsService } from './product-variants.service';

@Module({
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService, PrismaService],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
