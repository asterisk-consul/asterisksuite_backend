import { Module } from '@nestjs/common';
import { MaintenanceReportsService } from './maintenance-reports.service';
import { MaintenanceReportsController } from './maintenance-reports.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [MaintenanceReportsController],
  providers: [MaintenanceReportsService, PrismaService],
  exports: [MaintenanceReportsService],
})
export class MaintenanceReportsModule {}