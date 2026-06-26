import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { ProductTagsController } from './product-tags.controller';
import { ProductTagsService } from './product-tags.service';

@Module({
  controllers: [ProductTagsController],
  providers: [ProductTagsService, PrismaService],
  exports: [ProductTagsService],
})
export class ProductTagsModule {}
