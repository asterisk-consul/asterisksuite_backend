import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { AccessControlModule } from '@/access-control/access-control.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { OpenWaClient } from '@/modules/erp/whatsapp-reports/openwa.client';
import { WhatsAppContactController, WhatsAppNotificationSettingsController } from './whatsapp-notifications.controller';
import { WhatsAppNotificationsScheduler } from './whatsapp-notifications.scheduler';
import { WhatsAppNotificationsService } from './whatsapp-notifications.service';

@Module({
  imports: [PrismaModule, AccessControlModule],
  controllers: [NotificationsController, WhatsAppContactController, WhatsAppNotificationSettingsController],
  providers: [NotificationsService, OpenWaClient, WhatsAppNotificationsService, WhatsAppNotificationsScheduler],
  exports: [NotificationsService, WhatsAppNotificationsService],
})
export class NotificationsModule {}
