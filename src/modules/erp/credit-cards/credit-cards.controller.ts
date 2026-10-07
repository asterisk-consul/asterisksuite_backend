import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequireAnyPermission, RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto, PayCardInstallmentDto, SettleCardCollectionDto, UpdateCreditCardDto } from './dto/credit-card.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/credit-cards')
export class CreditCardsController {
  constructor(private readonly service: CreditCardsService) {}
  @Get() @RequireAnyPermission('credit_cards.company.read', 'card_collections.read', 'card_settings.read') findAll(@Query('type') type?: string) { return this.service.findAll(type); }
  @Post() @RequirePermissions('card_settings.manage') create(@Body() dto: CreateCreditCardDto, @CurrentUser() user: AuthUser) { return this.service.create(dto, user.id); }
  @Patch(':id') @RequirePermissions('card_settings.manage') update(@Param('id') id: string, @Body() dto: UpdateCreditCardDto, @CurrentUser() user: AuthUser) { return this.service.update(id, dto, user.id); }
  @Delete(':id') @RequirePermissions('card_settings.manage') remove(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.service.remove(id, user.id); }
  @Get('transactions/list') @RequirePermissions('card_collections.read') transactions(@Query('type') type?: string, @Query('status') status?: string, @Query('card_id') cardId?: string) { return this.service.transactions({ type, status, cardId }); }
  @Post('transactions/:id/settle') @RequirePermissions('card_settlements.confirm') settle(@Param('id') id: string, @Body() dto: SettleCardCollectionDto, @CurrentUser() user: AuthUser) { return this.service.settle(id, dto, user.id); }
  @Get('installments/list') @RequirePermissions('credit_cards.company.read') installments(@Query('status') status?: string, @Query('card_id') cardId?: string) { return this.service.installments(status, cardId); }
  @Post('installments/:id/pay') @RequirePermissions('credit_cards.company.pay_statement') payInstallment(@Param('id') id: string, @Body() dto: PayCardInstallmentDto, @CurrentUser() user: AuthUser) { return this.service.payInstallment(id, dto, user.id); }
  @Get('dashboard/summary') @RequirePermissions('card_settlements.read') dashboard(@Query('days') days?: string) { return this.service.dashboard(days ? Number(days) : 7); }
  @Get('reports/summary') @RequirePermissions('card_reports.read') report(@Query('from') from?: string, @Query('to') to?: string) { return this.service.report(from, to); }
}
