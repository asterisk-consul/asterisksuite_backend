import { Module } from '@nestjs/common';
import { MaintenanceHistoryService } from './maintenance-history.service';
import { MaintenanceHistoryController } from './maintenance-history.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [MaintenanceHistoryController],
  providers: [MaintenanceHistoryService, PrismaService],
  exports: [MaintenanceHistoryService],
})
export class MaintenanceHistoryModule {}