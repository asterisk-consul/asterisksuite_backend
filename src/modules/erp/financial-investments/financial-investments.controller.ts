import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { FinancialInvestmentsService } from './financial-investments.service';
import { CreateFinancialInvestmentDto, CreateInvestmentValuationDto, RedeemInvestmentFundDto, SettleFixedTermDto } from './dto/financial-investment.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/financial-investments')
export class FinancialInvestmentsController {
  constructor(private service: FinancialInvestmentsService) {}
  @Get() @RequirePermissions('financial_investments.read') findAll(@Query('status') status?: string, @Query('type') type?: string) { return this.service.findAll(status, type); }
  @Get('summary') @RequirePermissions('financial_investments.read') summary() { return this.service.summary(); }
  @Get(':id') @RequirePermissions('financial_investments.read') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() @RequirePermissions('financial_investments.create') create(@Body() dto: CreateFinancialInvestmentDto, @CurrentUser() user: AuthUser) { return this.service.create(dto, user.id); }
  @Post(':id/valuations') @RequirePermissions('financial_investments.update') valuation(@Param('id') id: string, @Body() dto: CreateInvestmentValuationDto, @CurrentUser() user: AuthUser) { return this.service.addValuation(id, dto, user.id); }
  @Post(':id/settle') @RequirePermissions('financial_investments.settle') settle(@Param('id') id: string, @Body() dto: SettleFixedTermDto, @CurrentUser() user: AuthUser) { return this.service.settleFixedTerm(id, dto, user.id); }
  @Post(':id/redeem') @RequirePermissions('financial_investments.settle') redeem(@Param('id') id: string, @Body() dto: RedeemInvestmentFundDto, @CurrentUser() user: AuthUser) { return this.service.redeemFund(id, dto, user.id); }
}
