import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CostingModule } from './costing/costing.module';
import { ProductAttributeValuesModule } from './product-attribute-values/product-attribute-values.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductComponentsModule } from './product-components/product-components.module';
import { ProductTagsModule } from './product-tags/product-tags.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';

@Module({
  imports: [
    PrismaModule,
    CostingModule,
    ProductAttributeValuesModule,
    ProductCategoriesModule,
    ProductComponentsModule,
    ProductTagsModule,
    ProductVariantsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [
    CostingModule,
    ProductAttributeValuesModule,
    ProductCategoriesModule,
    ProductComponentsModule,
    ProductTagsModule,
    ProductVariantsModule,
  ],
})
export class ProductsModule {}
