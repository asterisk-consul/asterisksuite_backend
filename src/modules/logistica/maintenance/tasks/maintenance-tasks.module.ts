import { Module } from '@nestjs/common';
import { MaintenanceTasksService } from './maintenance-tasks.service';
import { MaintenanceTasksController } from './maintenance-tasks.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [MaintenanceTasksController],
  providers: [MaintenanceTasksService, PrismaService],
  exports: [MaintenanceTasksService],
})
export class MaintenanceTasksModule {}