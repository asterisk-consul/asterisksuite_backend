import { Module } from '@nestjs/common';
import { BusinessPartiesModule } from './business-parties/business-parties.module';
import { LocationsModule } from './locations/locations.module';
import { ProductsModule } from './products/products.module';
import { PartyContactsModule } from './contacts/contacts.module';
import { DocumentSequencesModule } from './document-sequences/document-sequences.module';

@Module({
  imports: [
    BusinessPartiesModule,
    LocationsModule,
    ProductsModule,
    PartyContactsModule,
    DocumentSequencesModule,
  ],
  exports: [
    BusinessPartiesModule,
    LocationsModule,
    ProductsModule,
    PartyContactsModule,
    DocumentSequencesModule,
  ],
})
export class MasterDataModule {}
