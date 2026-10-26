import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { AllowCompanyAdmins } from '@/access-control/decorators/allow-company-admins.decorator';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { TestWhatsAppReportSettingsDto, UpdateWhatsAppReportSettingsDto } from './dto/update-whatsapp-report-settings.dto';
import { WhatsAppReportsService } from './whatsapp-reports.service';

@UseGuards(JwtAuthGuard)
@AllowCompanyAdmins()
@RequirePermissions('companies.update')
@Controller('erp/whatsapp/reports')
export class WhatsAppReportsController {
  constructor(private readonly service: WhatsAppReportsService) {}

  @Get('status')
  getGatewayStatus() {
    return this.service.getGatewayStatus();
  }

  @Get('settings')
  getSettings(@CurrentUser() user: AuthUser) {
    return this.service.getSettings(user.id);
  }

  @Get('companies')
  getAvailableCompanies(@CurrentUser() user: AuthUser) {
    return this.service.getAvailableCompanies(user.id);
  }

  @Get('groups')
  getGroups(@CurrentUser() user: AuthUser) {
    return this.service.getGroups(user.id);
  }

  @Get('runs')
  getRecentRuns(@CurrentUser() user: AuthUser) {
    return this.service.getRecentRuns(user.id);
  }

  @Put('settings')
  saveSettings(@CurrentUser() user: AuthUser, @Body() dto: UpdateWhatsAppReportSettingsDto) {
    return this.service.saveSettings(user.id, dto);
  }

  @Post('test')
  sendTest(@CurrentUser() user: AuthUser, @Body() dto: TestWhatsAppReportSettingsDto) {
    return this.service.sendTest(user.id, dto);
  }
}
