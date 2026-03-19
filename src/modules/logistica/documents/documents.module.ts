import { Module } from '@nestjs/common';
import { DeliveryNotesModule } from './delivery-notes/delivery-notes.module';
import { DocumentSequencesModule } from './document-sequences/document-sequences.module';
import { DocumentTypesModule } from './transport-document-type/document-type.module';
@Module({
  imports: [DeliveryNotesModule, DocumentSequencesModule, DocumentTypesModule],
  exports: [DeliveryNotesModule, DocumentSequencesModule, DocumentTypesModule],
})
export class DocumentsDomainModule {}
