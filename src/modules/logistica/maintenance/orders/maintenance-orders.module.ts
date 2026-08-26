import { Module } from '@nestjs/common';
import { MaintenanceOrdersService } from './maintenance-orders.service';
import { MaintenanceOrdersController } from './maintenance-orders.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [MaintenanceOrdersController],
  providers: [MaintenanceOrdersService, PrismaService],
  exports: [MaintenanceOrdersService],
})
export class MaintenanceOrdersModule {}