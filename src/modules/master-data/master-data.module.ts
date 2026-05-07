import { Module } from '@nestjs/common';
import { BusinessPartiesModule } from './business-parties/business-parties.module';
import { LocationsModule } from './locations/locations.module';
import { ProductPriceModule } from './products-prices/products_prices.module';
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
