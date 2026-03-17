import { Module } from '@nestjs/common';
import { WarehouseDomainModule } from './warehouse/warehouse.module';
import { TransportDomainModule } from './transport/transport.module';
import { DocumentsDomainModule } from './documents/documents.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    WarehouseDomainModule,
    TransportDomainModule,
    DocumentsDomainModule,
    MediaModule,
  ],
})
export class LogisticaModule {}
