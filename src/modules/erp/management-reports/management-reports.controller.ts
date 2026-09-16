import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { ManagementReportsService } from './management-reports.service';
import { QueryManagementReportDto } from './dto/query-management-report.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/reports/management')
export class ManagementReportsController {
  constructor(private readonly service: ManagementReportsService) {}

  @Get()
  @RequirePermissions('treasury.reports.read')
  getReport(@Query() query: QueryManagementReportDto) {
    return this.service.getReport(query);
  }

  @Get('metadata')
  @RequirePermissions('treasury.reports.read')
  getMetadata() {
    return this.service.getMetadata();
  }
}
