import { Module } from '@nestjs/common';
import { VehicleTirePositionsService } from './vehicle-tire-positions.service';
import { VehicleTirePositionsController } from './vehicle-tire-positions.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [VehicleTirePositionsController],
  providers: [VehicleTirePositionsService, PrismaService],
  exports: [VehicleTirePositionsService],
})
export class VehicleTirePositionsModule {}