import { Module } from '@nestjs/common';
import { MaintenanceLaborService } from './maintenance-labor.service';
import { MaintenanceLaborController } from './maintenance-labor.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [MaintenanceLaborController],
  providers: [MaintenanceLaborService, PrismaService],
  exports: [MaintenanceLaborService],
})
export class MaintenanceLaborModule {}