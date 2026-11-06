import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Request, Req } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { HrService } from './hr.service';
import { CreateHrValeDto } from './dto/create-hr-vale.dto';
import { ConfirmHrValeDto } from './dto/confirm-hr-vale.dto';
import { CreatePartnerInvestmentPlanDto } from './dto/create-partner-investment-plan.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { SaveCommissionAssignmentsDto } from './dto/save-commission-assignments.dto';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('hr')
export class HrController {
  constructor(private readonly service: HrService) {}

  // ══════════════════════════════════════════════════════════
  // VALES
  // ══════════════════════════════════════════════════════════

  @Post('vales')
  createVale(@Body() dto: CreateHrValeDto, @Request() req: any) {
    return this.service.createVale(dto, req.user.id);
  }

  @Get('vales')
  findAllVales(
    @Req() req: ExpressRequest,
    @CurrentUser() user: AuthUser,
    @Query('party_id') partyId?: string,
    @Query('party_type') partyType?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    const companyRole = req['companyUserRole'] as string | undefined;
    return this.service.findAllVales({
      party_id: partyId,
      party_type: partyType,
      status,
      type,
      user_id: companyRole === 'USER' ? user.id : undefined,
    });
  }

  @Get('vales/:id')
  findOneVale(@Param('id') id: string) {
    return this.service.findOneVale(id);
  }

  @Get('partners/:id/funds')
  getPartnerFunds(@Param('id') id: string, @Query('currency_code') currencyCode = 'ARS') {
    return this.service.getPartnerFunds(id, currencyCode.toUpperCase());
  }

  @RequirePermissions('vales.read')
  @Get('partners/:id/investment-plans')
  getPartnerInvestmentPlans(@Param('id') id: string) {
    return this.service.getPartnerInvestmentPlans(id);
  }

  @RequirePermissions('vales.create')
  @Post('partners/:id/investment-plans')
  createPartnerInvestmentPlan(
    @Param('id') id: string,
    @Body() dto: CreatePartnerInvestmentPlanDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.createPartnerInvestmentPlan(id, dto, user.id);
  }

  @Patch('vales/:id/confirm')
  confirmVale(@Param('id') id: string, @Body() dto: ConfirmHrValeDto, @Request() req: any) {
    return this.service.confirmVale(id, req.user.id, dto);
  }

  @Patch('vales/:id/cancel')
  cancelVale(@Param('id') id: string, @Request() req: any) {
    return this.service.cancelVale(id, req.user.id);
  }

  // ══════════════════════════════════════════════════════════
  // CUENTAS CORRIENTES RRHH
  // ══════════════════════════════════════════════════════════

  @Get('accounts')
  getHrAccounts(@Query('party_type') partyType?: string) {
    return this.service.getHrAccounts({ party_type: partyType });
  }

  @Get('accounts/:id/entries')
  getHrAccountEntries(@Param('id') id: string) {
    return this.service.getHrAccountEntries(id);
  }

  @Get('accounts/balance/:partyId/:currencyCode')
  getHrBalance(@Param('partyId') partyId: string, @Param('currencyCode') currencyCode: string) {
    return this.service.getHrBalance(partyId, currencyCode);
  }

  // ══════════════════════════════════════════════════════════
  // REPORTE DE SOCIO
  // ══════════════════════════════════════════════════════════

  @Get('partner-report-options')
  getPartnerReportOptions() {
    return this.service.getPartnerReportOptions();
  }

  @Get('partner-report/:partyId')
  getPartnerReport(@Param('partyId') partyId: string, @Req() req: ExpressRequest, @CurrentUser() user: AuthUser) {
    const companyRole = req['companyUserRole'] as string | undefined;
    return this.service.getPartnerReport(partyId, user.id, companyRole);
  }

  // ══════════════════════════════════════════════════════════
  // REPORTE DE COMISIONES
  // ══════════════════════════════════════════════════════════

  @Get('commissions')
  @RequirePermissions('commissions.view')
  getCommissionsReport(
    @Query('month') month: string,
    @Query('seller_id') sellerId?: string,
    @Query('seller_type') sellerType?: 'EMPLOYEE' | 'PARTNER',
  ) {
    return this.service.getCommissionsReport(month, sellerId, sellerType);
  }

  @Get('commissions/documents')
  @RequirePermissions('commissions.view')
  getCommissionableDocuments(@Query('month') month: string) {
    return this.service.getCommissionableDocuments(month);
  }

  @Get('commissions/sellers')
  @RequirePermissions('commissions.view')
  getCommissionSellers() {
    return this.service.getCommissionSellers();
  }

  @Patch('commissions/documents/:documentId/assignments')
  @RequirePermissions('commissions.manage')
  saveCommissionAssignments(
    @Param('documentId') documentId: string,
    @Body() dto: SaveCommissionAssignmentsDto,
    @Request() req: any,
  ) {
    return this.service.saveCommissionAssignments(documentId, dto.assignments, req.user.id);
  }

  @Post('commissions/vale')
  @RequirePermissions('commissions.settle')
  generateCommissionVale(
    @Body() body: { seller_id: string; seller_type?: 'EMPLOYEE' | 'PARTNER'; month: string; currency_code?: string },
    @Request() req: any,
  ) {
    return this.service.generateCommissionVale(body.seller_id, body.month, req.user.id, body.seller_type, body.currency_code);
  }
}
