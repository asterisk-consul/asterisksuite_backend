import { Module } from '@nestjs/common';
import { WarehousesModule } from './warehouses/warehouses.module';
import { StockModule } from './stock/stock.module';
import { PalletsModule } from './pallets/pallets.module';
import { PickingModule } from './picking/picking.module';
import { ReplenishmentModule } from './replenishment/replenishment.module';
@Module({
  imports: [WarehousesModule, StockModule, PalletsModule, PickingModule, ReplenishmentModule],
  exports: [WarehousesModule, StockModule, PalletsModule, PickingModule, ReplenishmentModule],
})
export class WarehouseDomainModule {}
