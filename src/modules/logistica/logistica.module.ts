// logistica.module.ts

import { Module } from '@nestjs/common';

import { MediaModule } from './media/media.module';
import { ReporteChoferesModule } from './reports/drivers/dispatch_rates.module';
import { TransportDomainModule } from './transport/transport.module';
import { DocumentsDomainModule } from './transport_documents/documents.module';
import { WarehouseDomainModule } from './warehouse/warehouse.module';

@Module({
  imports: [
    MediaModule,
    ReporteChoferesModule,
    TransportDomainModule,
    DocumentsDomainModule,
    WarehouseDomainModule,
  ],
  exports: [
    MediaModule,
    ReporteChoferesModule,
    TransportDomainModule,
    DocumentsDomainModule,
    WarehouseDomainModule,
  ],
})
export class LogisticaModule {}
