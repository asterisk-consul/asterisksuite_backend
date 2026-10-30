import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AllowCompanyAdmins } from '@/access-control/decorators/allow-company-admins.decorator';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { PermissionsGuard } from '@/access-control/guards/permissions.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { UpdateWhatsAppContactDto, UpdateWhatsAppNotificationSettingsDto } from './whatsapp-notifications.dto';
import { WhatsAppNotificationsService } from './whatsapp-notifications.service';

@Controller('notifications/whatsapp')
export class WhatsAppContactController {
  constructor(private readonly whatsApp: WhatsAppNotificationsService) {}

  @Get('contact')
  @UseGuards(JwtAuthGuard)
  getContact(@CurrentUser() user: AuthUser) {
    return this.whatsApp.getMyContact(user.id);
  }

  @Put('contact')
  @UseGuards(JwtAuthGuard)
  saveContact(@CurrentUser() user: AuthUser, @Body() dto: UpdateWhatsAppContactDto) {
    return this.whatsApp.saveMyContact(user.id, dto);
  }
}

@Controller('notifications/whatsapp/company')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@AllowCompanyAdmins()
@RequirePermissions('companies.update')
export class WhatsAppNotificationSettingsController {
  constructor(private readonly whatsApp: WhatsAppNotificationsService) {}

  @Get('settings')
  getSettings(@CurrentUser() user: AuthUser) {
    return this.whatsApp.getCompanySettings(user.id);
  }

  @Get('recipients')
  getRecipients(@CurrentUser() user: AuthUser) {
    return this.whatsApp.getCompanyRecipients(user.id);
  }

  @Put('settings')
  saveSettings(@CurrentUser() user: AuthUser, @Body() dto: UpdateWhatsAppNotificationSettingsDto) {
    return this.whatsApp.saveCompanySettings(user.id, dto);
  }
}
