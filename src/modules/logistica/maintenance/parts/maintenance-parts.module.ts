import { Module } from '@nestjs/common';
import { MaintenancePartsService } from './maintenance-parts.service';
import { MaintenancePartsController } from './maintenance-parts.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [MaintenancePartsController],
  providers: [MaintenancePartsService, PrismaService],
  exports: [MaintenancePartsService],
})
export class MaintenancePartsModule {}