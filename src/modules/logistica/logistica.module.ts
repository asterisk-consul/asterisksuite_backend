// logistica.module.ts

import { Module } from '@nestjs/common';

import { MediaModule } from './media/media.module';
import { ReporteChoferesModule } from './reports/drivers/dispatch_rates.module';
import { TransportDomainModule } from './transport/transport.module';
import { DocumentsDomainModule } from './transport_documents/documents.module';
import { WarehouseDomainModule } from './warehouse/warehouse.module';
import { CashBoxesModule } from './cash-boxes/cash-boxes.module';
import { CashBoxMovementsModule } from './cash-box-movements/cash-box-movements.module';
import { CashBoxRenditionsModule } from './cash-box-renditions/cash-box-renditions.module';
import { CashBoxTransfersModule } from './cash-box-transfers/cash-box-transfers.module';

@Module({
  imports: [
    MediaModule,
    ReporteChoferesModule,
    TransportDomainModule,
    DocumentsDomainModule,
    WarehouseDomainModule,
    CashBoxesModule,
    CashBoxMovementsModule,
    CashBoxRenditionsModule,
    CashBoxTransfersModule,
  ],
  exports: [
    MediaModule,
    ReporteChoferesModule,
    TransportDomainModule,
    DocumentsDomainModule,
    WarehouseDomainModule,
    CashBoxesModule,
    CashBoxMovementsModule,
    CashBoxRenditionsModule,
    CashBoxTransfersModule,
  ],
})
export class LogisticaModule {}
