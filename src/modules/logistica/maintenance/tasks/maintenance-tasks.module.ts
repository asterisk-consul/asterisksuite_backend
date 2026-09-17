import { Module } from '@nestjs/common';
import { MaintenanceTasksService } from './maintenance-tasks.service';
import { MaintenanceTasksController } from './maintenance-tasks.controller';

@Module({
  controllers: [MaintenanceTasksController],
  providers: [MaintenanceTasksService],
  exports: [MaintenanceTasksService],
})
export class MaintenanceTasksModule {}
