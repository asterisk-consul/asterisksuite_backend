import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, LogisticaPrismaService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
