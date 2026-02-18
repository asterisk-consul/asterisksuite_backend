import { Module } from '@nestjs/common';
import { BusinessPartiesModule } from './business-parties/business-parties.module';
import { LocationsModule } from './locations/locations.module';
import { ProductsModule } from './products/products.module';
@Module({
  imports: [BusinessPartiesModule, LocationsModule, ProductsModule],
  exports: [BusinessPartiesModule, LocationsModule, ProductsModule],
})
export class MasterDataModule {}
