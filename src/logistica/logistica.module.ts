import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { MasterDataModule } from './master-data/master-data.module';
import { WarehouseDomainModule } from './warehouse/warehouse.module';
import { TransportDomainModule } from './transport/transport.module';
import { DocumentsDomainModule } from './documents/documents.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    CoreModule,
    MasterDataModule,
    WarehouseDomainModule,
    TransportDomainModule,
    DocumentsDomainModule,
    MediaModule,
  ],
})
export class LogisticaModule {}
