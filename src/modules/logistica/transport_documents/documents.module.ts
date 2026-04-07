import { Module } from '@nestjs/common';
import { DeliveryNotesModule } from './delivery-notes/delivery-notes.module';
import { DocumentTypesModule } from './transport-document-type/document-type.module';
import { DispatchOrdersModule } from './dispatch-orders/dispatch-orders.module';
@Module({
  imports: [DeliveryNotesModule, DocumentTypesModule, DispatchOrdersModule],
  exports: [DeliveryNotesModule, DocumentTypesModule, DispatchOrdersModule],
})
export class DocumentsDomainModule {}
