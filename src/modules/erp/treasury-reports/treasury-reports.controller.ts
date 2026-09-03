import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import type { Request } from 'express';
import { TreasuryReportsService } from './treasury-reports.service';

@UseGuards(JwtAuthGuard)
@Controller('erp/treasury')
export class TreasuryReportsController {
  constructor(private readonly reportsService: TreasuryReportsService) {}

  @Get('dashboard')
  @RequirePermissions('treasury.reports.read')
  dashboard(
    @Query('checks_days') checksDays: string | undefined,
    @Req() req: Request,
    @CurrentUser() user: AuthUser,
  ) {
    const companyRole = req['companyUserRole'] as string | undefined;
    return this.reportsService.dashboard(
      checksDays ? parseInt(checksDays, 10) : undefined,
      user.id,
      companyRole,
    );
  }

  @Get('movements')
  @RequirePermissions('treasury.reports.read')
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

  @Get('libro-iva')
  async libroIva(
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
  ) {
    return this.reportsService.libroIva(dateFrom, dateTo);
  }

  @Get('regulatory-payments')
  async regulatoryPayments(
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
  ) {
    return this.reportsService.regulatoryPayments(dateFrom, dateTo);
  }

  @Get('utility-payments')
  async utilityPayments(
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
  ) {
    return this.reportsService.utilityPayments(dateFrom, dateTo);
  }

  @Get('expenses-by-account')
  @RequirePermissions('treasury.reports.read')
  expensesByAccount(
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
    @Query('account_id') accountId?: string,
    @Query('type') type?: string,
  ) {
    return this.reportsService.expensesByAccount({
      date_from: dateFrom,
      date_to: dateTo,
      account_id: accountId,
      type,
    });
  }
}
