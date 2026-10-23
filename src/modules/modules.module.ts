import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { MasterDataModule } from './master-data/master-data.module';
import { LogisticaModule } from './logistica/logistica.module';
import { ErpModulesModule } from './erp/erp.modules';
import { TesoreriaModule } from './erp/tesoreria/tesoreria.module';
import { TrashModule } from './trash/trash.module';
import { InventoryModule } from './inventory/inventory.module';
import { InternationalOperationsModule } from './international-operations/international-operations.module';
import { UserPreferencesModule } from './user-preferences/user-preferences.module';

@Module({
  imports: [
    CoreModule,
    MasterDataModule,
    LogisticaModule,
    ErpModulesModule,
    TesoreriaModule,
    TrashModule,
    InventoryModule,
    InternationalOperationsModule,
    UserPreferencesModule,
  ],
  exports: [
    CoreModule,
    MasterDataModule,
    LogisticaModule,
    ErpModulesModule,
    TesoreriaModule,
    TrashModule,
    InventoryModule,
    InternationalOperationsModule,
    UserPreferencesModule,
  ],
})
export class ModulesModule {}
