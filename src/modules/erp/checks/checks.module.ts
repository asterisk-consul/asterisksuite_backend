import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ChecksController } from './checks.controller';
import { ChecksService } from './checks.service';
import { CheckNotificationScheduler } from './schedulers/check-notification.scheduler';
import { CheckProcessingScheduler } from './schedulers/check-processing.scheduler';

@Module({
  imports: [PrismaModule],
  controllers: [ChecksController],
  providers: [ChecksService, CheckNotificationScheduler, CheckProcessingScheduler],
  exports: [ChecksService],
})
export class ChecksModule {}
