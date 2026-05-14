import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { ProductComponentsController } from './product-components.controller';
import { ProductComponentsService } from './product-components.service';

@Module({
  controllers: [ProductComponentsController],
  providers: [ProductComponentsService, PrismaService],
  exports: [ProductComponentsService],
})
export class ProductComponentsModule {}
