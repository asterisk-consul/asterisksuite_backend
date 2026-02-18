import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';

@Module({
  controllers: [DriversController],
  providers: [DriversService, LogisticaPrismaService],
  exports: [DriversService],
})
export class DriversModule {}
