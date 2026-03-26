import { Module } from '@nestjs/common';
import { CoreModule } from '../modules/core/core.module';
import { MasterDataModule } from '../modules/master-data/master-data.module';
import { LogisticaModule } from './logistica/logistica.module';
import { DocumentsDomainModule } from './logistica/transport-documents/documents.module';

@Module({
  imports: [
    CoreModule,
    MasterDataModule,
    LogisticaModule,
    DocumentsDomainModule,
  ],
})
export class modulesmodule {}
