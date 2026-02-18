import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';

@Module({
  controllers: [TripsController],
  providers: [TripsService, LogisticaPrismaService],
  exports: [TripsService],
})
export class TripsModule {}
