import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { ChecksService } from './checks.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { SettleCheckFromCashBoxDto } from './dto/settle-check-from-cash-box.dto';
import { CashBoxAccessGuard } from '@/common/guards/cash-box-access.guard';
import { CashBoxSessionGuard } from '@/common/guards/cash-box-session.guard';

@UseGuards(JwtAuthGuard)
@Controller('erp/checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @Post()
  @RequirePermissions('checks.create')
  create(@Body() dto: CreateCheckDto, @CurrentUser() user: AuthUser) {
    return this.checksService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions('checks.read')
  findAll(
    @Query('status') status?: string,
    @Query('is_own') isOwn?: string,
    @Query('bank_name') bankName?: string,
    @Query('due_before') dueBefore?: string,
  ) {
    return this.checksService.findAll({
      status,
      is_own: isOwn !== undefined ? isOwn === 'true' : undefined,
      bank_name: bankName,
      due_before: dueBefore,
    });
  }

  @Get('upcoming')
  @RequirePermissions('checks.read')
  findUpcoming(@Query('days') days?: string) {
    return this.checksService.findUpcoming(days ? parseInt(days, 10) : 7);
  }

  @Get('pending-notification')
  @RequirePermissions('checks.read')
  findPendingNotification() {
    return this.checksService.findPendingNotification();
  }

  @Get('available')
  @RequirePermissions('checks.read')
  findAvailable(@Query('is_own') isOwn?: string) {
    return this.checksService.findAvailable(isOwn !== undefined ? isOwn === 'true' : undefined);
  }

  @Get(':id')
  @RequirePermissions('checks.read')
  findOne(@Param('id') id: string) {
    return this.checksService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('checks.update')
  update(@Param('id') id: string, @Body() dto: UpdateCheckDto, @CurrentUser() user: AuthUser) {
    return this.checksService.update(id, dto, user.id);
  }

  @Patch(':id/clear')
  @RequirePermissions('checks.deposit')
  clear(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.checksService.clear(id, user.id);
  }

  @Patch(':id/deposit')
  @RequirePermissions('checks.deposit')
  deposit(
    @Param('id') id: string,
    @Body() body: { bank_account_id: string; amount?: number; date?: string },
    @CurrentUser() user: AuthUser,
  ) {
    return this.checksService.deposit(id, body, user.id);
  }

  @Patch(':id/collect-cash')
  @UseGuards(CashBoxAccessGuard, CashBoxSessionGuard)
  @RequirePermissions('cash_box_movements.create_manual', 'checks.deposit')
  collectInCashBox(
    @Param('id') id: string,
    @Body() body: { cash_box_id: string; date?: string },
    @CurrentUser() user: AuthUser,
  ) {
    return this.checksService.collectInCashBox(id, body.cash_box_id, user.id, body.date);
  }

  @Patch(':id/revert')
  @RequirePermissions('checks.deposit')
  revert(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.checksService.revert(id, user.id);
  }

  @Patch(':id/bounce')
  @RequirePermissions('checks.reject')
  bounce(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.checksService.bounce(id, user.id);
  }

  @Patch(':id/confirm')
  @RequirePermissions('checks.update')
  confirm(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.checksService.confirm(id, user.id);
  }

  @Patch(':id/debit')
  @RequirePermissions('checks.deposit')
  debitOwnCheck(
    @Param('id') id: string,
    @Body() body: { date: string },
    @CurrentUser() user: AuthUser,
  ) {
    return this.checksService.debitOwnCheck(id, body.date, user.id);
  }

  @Patch(':id/pay-from-cash-box')
  @UseGuards(CashBoxAccessGuard, CashBoxSessionGuard)
  @RequirePermissions('cash_box_movements.create_manual', 'checks.deposit')
  settleOwnCheckFromCashBox(
    @Param('id') id: string,
    @Body() body: SettleCheckFromCashBoxDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.checksService.settleOwnCheckFromCashBox(id, body.cash_box_id, body.date, user.id);
  }

  @Patch(':id/reject')
  @RequirePermissions('checks.reject')
  reject(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.checksService.reject(id, user.id);
  }

  @Delete(':id')
  @RequirePermissions('checks.delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.checksService.remove(id, user.id);
  }
}
