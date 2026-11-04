import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { AllowCompanyAdmins } from '@/access-control/decorators/allow-company-admins.decorator';
import { RequireAnyPermission } from '@/access-control/decorators/require-permissions.decorator';
import { TAX_NOTIFICATION_ADMIN_PERMISSIONS, TaxNotificationAudienceService } from '@/access-control/authorization/tax-notification-audience.service';
import { FiscalAuthorizationsService } from './fiscal-authorizations.service';
import { CreateFiscalAuthorizationDto, ReplaceAuthorizationDto, UpdateFiscalAuthorizationDto, UpdateFiscalAuthorizationSettingsDto } from './dto/fiscal-authorization.dto';

@Controller('erp/fiscal-authorizations')
@UseGuards(JwtAuthGuard)
export class FiscalAuthorizationsController {
  constructor(
    private readonly service: FiscalAuthorizationsService,
    private readonly taxNotificationAudience: TaxNotificationAudienceService,
  ) {}

  @Get() @RequirePermissions('fiscal-authorizations.read') findAll() { return this.service.findAll(); }
  @Post() @RequirePermissions('fiscal-authorizations.create') create(@Body() dto: CreateFiscalAuthorizationDto, @CurrentUser() user: AuthUser) { return this.service.create(dto, user.id); }
  @Put(':id') @RequirePermissions('fiscal-authorizations.update') update(@Param('id') id: string, @Body() dto: UpdateFiscalAuthorizationDto, @CurrentUser() user: AuthUser) { return this.service.update(id, dto, user.id); }
  @Delete(':id') @RequirePermissions('fiscal-authorizations.delete') remove(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.service.remove(id, user.id); }
  @Get('settings/current') @RequirePermissions('fiscal-authorizations.read') settings() { return this.service.getSettings(); }
  @Put('settings/current') @RequirePermissions('fiscal-authorizations.configure-alerts') updateSettings(@Body() dto: UpdateFiscalAuthorizationSettingsDto, @CurrentUser() user: AuthUser) { return this.service.updateSettings(dto, user.id); }
  @Get('alerts/current')
  @RequireAnyPermission(...TAX_NOTIFICATION_ADMIN_PERMISSIONS)
  @AllowCompanyAdmins()
  async alerts(@CurrentUser() user: AuthUser, @Req() req: Request) {
    const isRecipient = await this.taxNotificationAudience.canReceiveTaxNotifications(
      user.id,
      req['companyUserRole'] as string | undefined,
    );
    return isRecipient ? this.service.refreshAlerts() : [];
  }
  @Get('documents/:id/preview') @RequirePermissions('fiscal-authorizations.read') preview(@Param('id') id: string) { return this.service.previewForDocument(id); }
  @Get('documents/:id/status') @RequirePermissions('fiscal-authorizations.read') status(@Param('id') id: string) { return this.service.getDocumentStatus(id); }
  @Patch('documents/:id/replace') @RequirePermissions('delivery_notes.replace_authorization') replace(@Param('id') id: string, @CurrentUser() user: AuthUser, @Body() dto?: ReplaceAuthorizationDto) { return this.service.replaceAuthorization(id, user.id, dto); }
  @Patch('alerts/:id/read')
  @RequireAnyPermission(...TAX_NOTIFICATION_ADMIN_PERMISSIONS)
  @AllowCompanyAdmins()
  async readAlert(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    const isRecipient = await this.taxNotificationAudience.canReceiveTaxNotifications(
      user.id,
      req['companyUserRole'] as string | undefined,
    );
    if (!isRecipient) throw new ForbiddenException('No tienes acceso a las alertas fiscales');
    return this.service.markAlertRead(id);
  }
}
