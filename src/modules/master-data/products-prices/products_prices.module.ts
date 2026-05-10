// product-price.module.ts

import { Module } from '@nestjs/common';
import { ProductPriceService } from './products_prices.service';
import { ProductPriceController } from './products_prices.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductPriceController],
  providers: [ProductPriceService],
  exports: [ProductPriceService], // exportado para uso en DocumentsModule
})
export class ProductPriceModule {}
