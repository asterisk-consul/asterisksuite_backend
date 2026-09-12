import { Module } from '@nestjs/common';
import { MaintenancePlansService } from './maintenance-plans.service';
import { MaintenancePlansController } from './maintenance-plans.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [MaintenancePlansController],
  providers: [MaintenancePlansService, PrismaService],
  exports: [MaintenancePlansService],
})
export class MaintenancePlansModule {}