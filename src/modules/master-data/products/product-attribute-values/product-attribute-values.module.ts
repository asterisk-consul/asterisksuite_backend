import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { ProductAttributeValuesController } from './product-attribute-values.controller';
import { ProductAttributeValuesService } from './product-attribute-values.service';

@Module({
  controllers: [ProductAttributeValuesController],
  providers: [ProductAttributeValuesService, PrismaService],
  exports: [ProductAttributeValuesService],
})
export class ProductAttributeValuesModule {}
