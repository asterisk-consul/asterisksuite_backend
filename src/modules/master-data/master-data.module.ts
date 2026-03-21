import { Module } from '@nestjs/common';
import { BusinesPartiesModule } from './busines-parties/busines-parties.module';
import { LocationsModule } from './locations/locations.module';
import { ProductsModule } from './products/products.module';
import { PartyContactModule } from './contact/contact.module';
@Module({
  imports: [
    BusinesPartiesModule,
    LocationsModule,
    ProductsModule,
    PartyContactsModule,
  ],
  exports: [
    BusinesPartiesModule,
    LocationsModule,
    ProductsModule,
    PartyContactsModule,
  ],
})
export class MasterDataModule {}
