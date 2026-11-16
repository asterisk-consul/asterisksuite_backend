import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ChecksController } from './checks.controller';
import { ChecksService } from './checks.service';
import { CheckNotificationScheduler } from './schedulers/check-notification.scheduler';
import { BankMovementsModule } from '../bank-movements/bank-movements.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { IntercompanyTreasuryModule } from '../intercompany-treasury/intercompany-treasury.module';

@Module({
  imports: [PrismaModule, BankMovementsModule, IntercompanyTreasuryModule, NotificationsModule],
  controllers: [ChecksController],
  providers: [ChecksService, CheckNotificationScheduler],
  exports: [ChecksService],
})
export class ChecksModule {}
