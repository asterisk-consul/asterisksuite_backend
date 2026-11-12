import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ManagementReportsController } from './management-reports.controller';
import { ManagementReportsService } from './management-reports.service';
import { FinancialResultsReportService } from './financial-results-report.service';

@Module({
  imports: [PrismaModule],
  controllers: [ManagementReportsController],
  providers: [ManagementReportsService, FinancialResultsReportService],
  exports: [ManagementReportsService, FinancialResultsReportService],
})
export class ManagementReportsModule {}
