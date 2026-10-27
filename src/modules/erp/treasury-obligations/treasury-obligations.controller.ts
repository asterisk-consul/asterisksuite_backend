import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { TreasuryObligationsService } from './treasury-obligations.service';
import { CreateObligationDto, CreateObligationTemplateDto, UpdateObligationDto } from './dto/upsert-obligation.dto';

@Controller('erp/treasury/obligations')
@UseGuards(JwtAuthGuard)
export class TreasuryObligationsController {
  constructor(private readonly service: TreasuryObligationsService) {}

  @Get() @RequirePermissions('payments.read')
  findAll(@Query('status') status?: string, @Query('category') category?: string, @Query('from') from?: string, @Query('to') to?: string, @Query('search') search?: string) {
    return this.service.findAll({ status, category, from, to, search });
  }
  @Get('notifications') @RequirePermissions('payments.read')
  notifications() { return this.service.findNotificationAlerts(); }
  @Get('summary') @RequirePermissions('payments.read')
  summary() { return this.service.summary(); }
  @Get('templates') @RequirePermissions('payments.read')
  templates() { return this.service.findTemplates(); }
  @Post() @RequirePermissions('payments.create')
  create(@Body() dto: CreateObligationDto, @CurrentUser() user: AuthUser) { return this.service.create(dto, user.id); }
  @Post('templates') @RequirePermissions('payments.create')
  createTemplate(@Body() dto: CreateObligationTemplateDto, @CurrentUser() user: AuthUser) { return this.service.createTemplate(dto, user.id); }
  @Patch('templates/:id/active') @RequirePermissions('payments.update')
  toggleTemplate(@Param('id') id: string, @Body('active') active: boolean, @CurrentUser() user: AuthUser) { return this.service.toggleTemplate(id, active, user.id); }
  @Patch(':id') @RequirePermissions('payments.update')
  update(@Param('id') id: string, @Body() dto: UpdateObligationDto, @CurrentUser() user: AuthUser) { return this.service.update(id, dto, user.id); }
  @Post(':id/confirm') @RequirePermissions('payments.confirm')
  confirm(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.service.confirm(id, user.id); }
  @Post(':id/paid') @RequirePermissions('payments.mark_as_paid')
  paid(@Param('id') id: string, @Body('payment_id') paymentId: string, @CurrentUser() user: AuthUser) { return this.service.markPaid(id, paymentId, user.id); }
  @Post(':id/cancel') @RequirePermissions('payments.reverse')
  cancel(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.service.cancel(id, user.id); }
}
