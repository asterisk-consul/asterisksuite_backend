import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { TreasuryReportsService } from './treasury-reports.service';

@UseGuards(JwtAuthGuard)
@Controller('erp/treasury')
export class TreasuryReportsController {
  constructor(private readonly reportsService: TreasuryReportsService) {}

  @Get('dashboard')
  // @RequirePermissions('treasury.reports.read')
  dashboard() {
    return this.reportsService.dashboard();
  }

  @Get('movements')
  // @RequirePermissions('treasury.reports.read')
  movements(
    @Query('type') type?: string,
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reportsService.movements({
      type,
      date_from: dateFrom,
      date_to: dateTo,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }
}
