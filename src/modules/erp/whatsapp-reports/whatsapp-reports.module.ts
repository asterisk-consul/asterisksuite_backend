import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ManagementReportsModule } from '../management-reports/management-reports.module';
import { OpenWaClient } from './openwa.client';
import { WhatsAppReportsController } from './whatsapp-reports.controller';
import { WhatsAppReportsService } from './whatsapp-reports.service';

@Module({
  imports: [PrismaModule, ManagementReportsModule],
  controllers: [WhatsAppReportsController],
  providers: [OpenWaClient, WhatsAppReportsService],
})
export class WhatsAppReportsModule {}
