import { Module } from '@nestjs/common';
import { MaintenanceDashboardService } from './maintenance-dashboard.service';
import { MaintenanceDashboardController } from './maintenance-dashboard.controller';

@Module({
  controllers: [MaintenanceDashboardController],
  providers: [MaintenanceDashboardService],
  exports: [MaintenanceDashboardService],
})
export class MaintenanceDashboardModule {}
