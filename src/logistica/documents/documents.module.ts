import { Module } from '@nestjs/common';
import { DeliveryNotesModule } from './delivery-notes/delivery-notes.module';
import { DocumentSequencesModule } from './document-sequences/document-sequences.module';
@Module({
  imports: [DeliveryNotesModule, DocumentSequencesModule],
  exports: [DeliveryNotesModule, DocumentSequencesModule],
})
export class DocumentsDomainModule {}
