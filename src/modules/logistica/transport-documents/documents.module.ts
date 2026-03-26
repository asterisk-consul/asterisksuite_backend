import { Module } from '@nestjs/common';
import { DeliveryNotesModule } from './delivery-notes/delivery-notes.module';
import { DocumentTypesModule } from './transport-document-type/document-type.module';
@Module({
  imports: [DeliveryNotesModule, DocumentTypesModule],
  exports: [DeliveryNotesModule, DocumentTypesModule],
})
export class DocumentsDomainModule {}
