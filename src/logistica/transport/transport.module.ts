import { Module } from '@nestjs/common';
import { TripsModule } from './trips/trips.module';
import { TransfersModule } from './transfers/transfers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DriversModule } from './drivers/drivers.module';
@Module({
  imports: [TripsModule, TransfersModule, VehiclesModule, DriversModule],
  exports: [TripsModule, TransfersModule, VehiclesModule, DriversModule],
})
export class TransportDomainModule {}
