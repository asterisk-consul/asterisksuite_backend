import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { AccessControlModule } from '@/access-control/access-control.module';
import { ManagementReportsController } from './management-reports.controller';
import { ManagementReportsService } from './management-reports.service';
import { FinancialResultsReportService } from './financial-results-report.service';
import { SalesProductsReportService } from './sales-products-report.service';

@Module({
  imports: [PrismaModule, AccessControlModule],
  controllers: [ManagementReportsController],
  providers: [ManagementReportsService, FinancialResultsReportService, SalesProductsReportService],
  exports: [ManagementReportsService, FinancialResultsReportService, SalesProductsReportService],
})
export class ManagementReportsModule {}
