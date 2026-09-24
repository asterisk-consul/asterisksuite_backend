import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { IntlOpsSettingsService } from './settings.service';
import { UpdateIntlOpsSettingsDto } from './dto/update-intl-ops-settings.dto';

@UseGuards(JwtAuthGuard)
@Controller('international-operations')
export class IntlOpsSettingsController {
  constructor(private readonly service: IntlOpsSettingsService) {}

  @Get('settings')
  @RequirePermissions('international_operations.read')
  settings() {
    return this.service.getSettings();
  }

  @Patch('settings')
  @RequirePermissions('international_operations.update')
  updateSettings(@Body() dto: UpdateIntlOpsSettingsDto, @CurrentUser() user: AuthUser) {
    return this.service.updateSettings(dto, user.id);
  }
}
