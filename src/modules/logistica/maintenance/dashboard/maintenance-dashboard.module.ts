import { Module } from '@nestjs/common';
import { MaintenanceDashboardService } from './maintenance-dashboard.service';
import { MaintenanceDashboardController } from './maintenance-dashboard.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [MaintenanceDashboardController],
  providers: [MaintenanceDashboardService, PrismaService],
  exports: [MaintenanceDashboardService],
})
export class MaintenanceDashboardModule {}