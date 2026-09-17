import { Module } from '@nestjs/common';
import { MaintenanceHistoryService } from './maintenance-history.service';
import { MaintenanceHistoryController } from './maintenance-history.controller';

@Module({
  controllers: [MaintenanceHistoryController],
  providers: [MaintenanceHistoryService],
  exports: [MaintenanceHistoryService],
})
export class MaintenanceHistoryModule {}
