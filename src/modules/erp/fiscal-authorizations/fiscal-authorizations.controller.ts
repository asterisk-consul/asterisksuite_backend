import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { FiscalAuthorizationsService } from './fiscal-authorizations.service';
import { CreateFiscalAuthorizationDto, UpdateFiscalAuthorizationDto, UpdateFiscalAuthorizationSettingsDto } from './dto/fiscal-authorization.dto';

@Controller('erp/fiscal-authorizations')
@UseGuards(JwtAuthGuard)
export class FiscalAuthorizationsController {
  constructor(private readonly service: FiscalAuthorizationsService) {}

  @Get() @RequirePermissions('fiscal-authorizations.read') findAll() { return this.service.findAll(); }
  @Post() @RequirePermissions('fiscal-authorizations.create') create(@Body() dto: CreateFiscalAuthorizationDto, @CurrentUser() user: AuthUser) { return this.service.create(dto, user.id); }
  @Put(':id') @RequirePermissions('fiscal-authorizations.update') update(@Param('id') id: string, @Body() dto: UpdateFiscalAuthorizationDto, @CurrentUser() user: AuthUser) { return this.service.update(id, dto, user.id); }
  @Delete(':id') @RequirePermissions('fiscal-authorizations.delete') remove(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.service.remove(id, user.id); }
  @Get('settings/current') @RequirePermissions('fiscal-authorizations.read') settings() { return this.service.getSettings(); }
  @Put('settings/current') @RequirePermissions('fiscal-authorizations.configure-alerts') updateSettings(@Body() dto: UpdateFiscalAuthorizationSettingsDto, @CurrentUser() user: AuthUser) { return this.service.updateSettings(dto, user.id); }
  @Get('alerts/current') @RequirePermissions('fiscal-authorizations.read') alerts() { return this.service.refreshAlerts(); }
  @Get('documents/:id/preview') @RequirePermissions('fiscal-authorizations.read') preview(@Param('id') id: string) { return this.service.previewForDocument(id); }
  @Patch('alerts/:id/read') @RequirePermissions('fiscal-authorizations.read') readAlert(@Param('id') id: string) { return this.service.markAlertRead(id); }
}
