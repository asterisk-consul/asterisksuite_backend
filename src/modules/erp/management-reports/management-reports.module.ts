import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ManagementReportsController } from './management-reports.controller';
import { ManagementReportsService } from './management-reports.service';

@Module({
  imports: [PrismaModule],
  controllers: [ManagementReportsController],
  providers: [ManagementReportsService],
})
export class ManagementReportsModule {}
