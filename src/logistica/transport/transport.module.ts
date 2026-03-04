import { Module } from '@nestjs/common';
import { TripsModule } from './trips/trips.module';
import { TransfersModule } from './transfers/transfers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DriversModule } from './drivers/drivers.module';
import { VehicleCombinationsModule } from './vehicles_combinations/vehicle-combinations.module';
@Module({
  imports: [
    TripsModule,
    TransfersModule,
    VehiclesModule,
    DriversModule,
    VehicleCombinationsModule,
  ],
  exports: [
    TripsModule,
    TransfersModule,
    VehiclesModule,
    DriversModule,
    VehicleCombinationsModule,
  ],
})
export class TransportDomainModule {}
