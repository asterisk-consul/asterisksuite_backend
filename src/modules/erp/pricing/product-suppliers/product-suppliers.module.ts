import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductSuppliersService } from './product-suppliers.service';
import { ProductSuppliersController } from './product-suppliers.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProductSuppliersController],
  providers: [ProductSuppliersService],
  exports: [ProductSuppliersService],
})
export class ProductSuppliersModule {}
