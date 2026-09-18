import { Module } from '@nestjs/common';
import { VehicleTirePositionsService } from './vehicle-tire-positions.service';
import { VehicleTirePositionsController } from './vehicle-tire-positions.controller';

@Module({
  controllers: [VehicleTirePositionsController],
  providers: [VehicleTirePositionsService],
  exports: [VehicleTirePositionsService],
})
export class VehicleTirePositionsModule {}
