import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { ChecksService } from './checks.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @Post()
  @RequirePermissions('treasury.checks.create')
  create(@Body() dto: CreateCheckDto, @CurrentUser() user: AuthUser) {
    return this.checksService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions('treasury.checks.read')
  findAll(
    @Req() req: Request,
    @CurrentUser() user: AuthUser,
    @Query('status') status?: string,
    @Query('is_own') isOwn?: string,
    @Query('bank_name') bankName?: string,
    @Query('due_before') dueBefore?: string,
  ) {
    const companyRole = req['companyUserRole'] as string | undefined;
    return this.checksService.findAll({
      status,
      is_own: isOwn !== undefined ? isOwn === 'true' : undefined,
      bank_name: bankName,
      due_before: dueBefore,
      user_id: companyRole === 'USER' ? user.id : undefined,
    });
  }

  @Get('upcoming')
  @RequirePermissions('treasury.checks.read')
  findUpcoming(@Query('days') days?: string) {
    return this.checksService.findUpcoming(days ? parseInt(days, 10) : 7);
  }

  @Get('pending-notification')
  @RequirePermissions('treasury.checks.read')
  findPendingNotification() {
    return this.checksService.findPendingNotification();
  }

  @Get('available')
  @RequirePermissions('treasury.checks.read')
  findAvailable(@Query('is_own') isOwn?: string) {
    return this.checksService.findAvailable(isOwn !== undefined ? isOwn === 'true' : undefined);
  }

  @Get(':id')
  @RequirePermissions('treasury.checks.read')
  findOne(@Param('id') id: string) {
    return this.checksService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('treasury.checks.update')
  update(@Param('id') id: string, @Body() dto: UpdateCheckDto, @CurrentUser() user: AuthUser) {
    return this.checksService.update(id, dto, user.id);
  }

  @Patch(':id/clear')
  @RequirePermissions('treasury.checks.clear')
  clear(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.checksService.clear(id, user.id);
  }

  @Patch(':id/deposit')
  @RequirePermissions('treasury.checks.update')
  deposit(
    @Param('id') id: string,
    @Body() body: { bank_account_id: string; amount?: number },
    @CurrentUser() user: AuthUser,
  ) {
    return this.checksService.deposit(id, body, user.id);
  }

  @Patch(':id/revert')
  @RequirePermissions('treasury.checks.update')
  revert(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.checksService.revert(id, user.id);
  }

  @Patch(':id/bounce')
  @RequirePermissions('treasury.checks.bounce')
  bounce(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.checksService.bounce(id, user.id);
  }

  @Patch(':id/confirm')
  @RequirePermissions('treasury.checks.confirm')
  confirm(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.checksService.confirm(id, user.id);
  }

  @Patch(':id/reject')
  @RequirePermissions('treasury.checks.reject')
  reject(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.checksService.reject(id, user.id);
  }

  @Delete(':id')
  @RequirePermissions('treasury.checks.delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.checksService.remove(id, user.id);
  }
}
