import { Module } from '@nestjs/common';
import { VehicleCombinationsService } from './vehicle-combinations.service';
import { VehicleCombinationsController } from './vehicle-combinations.controller';

@Module({
  controllers: [VehicleCombinationsController],
  providers: [VehicleCombinationsService],
  exports: [VehicleCombinationsService],
})
export class VehicleCombinationsModule {}
