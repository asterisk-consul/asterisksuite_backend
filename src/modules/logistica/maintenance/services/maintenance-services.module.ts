import { Module } from '@nestjs/common';
import { MaintenanceServicesService } from './maintenance-services.service';
import { MaintenanceServicesController } from './maintenance-services.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [MaintenanceServicesController],
  providers: [MaintenanceServicesService, PrismaService],
  exports: [MaintenanceServicesService],
})
export class MaintenanceServicesModule {}