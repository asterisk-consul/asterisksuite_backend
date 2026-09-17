import { Module } from '@nestjs/common';
import { MaintenanceReportsService } from './maintenance-reports.service';
import { MaintenanceReportsController } from './maintenance-reports.controller';

@Module({
  controllers: [MaintenanceReportsController],
  providers: [MaintenanceReportsService],
  exports: [MaintenanceReportsService],
})
export class MaintenanceReportsModule {}
