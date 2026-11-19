import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { AccessControlModule } from '@/access-control/access-control.module';
import { PlatformModulesModule } from '@/modules/core/platform-modules/platform-modules.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [PrismaModule, AccessControlModule, PlatformModulesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
