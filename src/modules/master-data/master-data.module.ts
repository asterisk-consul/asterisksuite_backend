import { Module } from '@nestjs/common';
import { BusinessPartiesModule } from './busines-parties/busines-parties.module';
import { LocationsModule } from './locations/locations.module';
import { ProductsModule } from './products/products.module';
import { PartyContactsModule } from './contacts/contacts.module';
@Module({
  imports: [
    BusinessPartiesModule,
    LocationsModule,
    ProductsModule,
    PartyContactsModule,
  ],
  exports: [
    BusinessPartiesModule,
    LocationsModule,
    ProductsModule,
    PartyContactsModule,
  ],
})
export class MasterDataModule {}
