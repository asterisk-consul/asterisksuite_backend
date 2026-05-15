import { Module } from '@nestjs/common';
import { BusinessPartiesModule } from './business-parties/business-parties.module';
import { LocationsModule } from './locations/locations.module';
import { ProductPriceModule } from '../erp/pricing/product-pricing/product-pricing.module';
import { ProductsModule } from './products/products.module';
import { PartyContactsModule } from './contacts/contacts.module';
@Module({
  imports: [
    BusinessPartiesModule,
    LocationsModule,
    ProductsModule,
    ProductPriceModule,
    PartyContactsModule,
  ],
  exports: [
    BusinessPartiesModule,
    LocationsModule,
    ProductsModule,
    ProductPriceModule,
    PartyContactsModule,
  ],
})
export class MasterDataModule {}
