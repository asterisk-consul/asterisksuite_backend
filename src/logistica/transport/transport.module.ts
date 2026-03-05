import { Module } from '@nestjs/common';
import { TripsModule } from './trips/trips.module';
import { TransfersModule } from './transfers/transfers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DriversModule } from './drivers/drivers.module';
import { VehicleCombinationsModule } from './vehicles_combinations/vehicle-combinations.module';
import { TransferRatesModule } from './transfer_rate/transfer-rates.module';
@Module({
  imports: [
    TripsModule,
    TransfersModule,
    VehiclesModule,
    DriversModule,
    VehicleCombinationsModule,
    TransferRatesModule,
  ],
  exports: [
    TripsModule,
    TransfersModule,
    VehiclesModule,
    DriversModule,
    VehicleCombinationsModule,
    TransferRatesModule,
  ],
})
export class TransportDomainModule {}
