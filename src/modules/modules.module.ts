import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { MasterDataModule } from './master-data/master-data.module';
import { LogisticaModule } from './logistica/logistica.module';
import { DocumentsDomainModule } from './logistica/transport_documents/documents.module';
import { TrashModule } from './trash/trash.module';

@Module({
  imports: [
    CoreModule,
    MasterDataModule,
    LogisticaModule,
    DocumentsDomainModule,
    TrashModule,
  ],
})
export class modulesmodule {}
