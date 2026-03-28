import { Module } from '@nestjs/common';
import { VehicleCombinationsService } from './vehicle-combinations.service';
import { VehicleCombinationsController } from './vehicle-combinations.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [VehicleCombinationsController],
  providers: [VehicleCombinationsService, PrismaService],
  exports: [VehicleCombinationsService],
})
export class VehicleCombinationsModule {}
