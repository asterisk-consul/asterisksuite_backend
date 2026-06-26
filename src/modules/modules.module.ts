import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { MasterDataModule } from './master-data/master-data.module';
import { LogisticaModule } from './logistica/logistica.module';
import { ErpModulesModule } from './erp/erp.modules';
import { TrashModule } from './trash/trash.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    CoreModule,
    MasterDataModule,
    LogisticaModule,
    ErpModulesModule,
    TrashModule,
    InventoryModule,
  ],
  exports: [
    CoreModule,
    MasterDataModule,
    LogisticaModule,
    ErpModulesModule,
    TrashModule,
    InventoryModule,
  ],
})
export class ModulesModule {}
