import { Module } from '@nestjs/common';


import { ProductComponentsController } from './product-components.controller';
import { ProductComponentsService } from './product-components.service';

import { ProductStructureVersionModule } from '../engineering/product-structure-version.module';

@Module({
  imports: [ProductStructureVersionModule],
  controllers: [ProductComponentsController],
  providers: [ProductComponentsService],
  exports: [ProductComponentsService],
})
export class ProductComponentsModule {}
