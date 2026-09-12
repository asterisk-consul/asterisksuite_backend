import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { DashboardService } from './dashboard.service';
import { SaveDashboardConfigDto } from './dto/save-dashboard-config.dto';

@Controller('erp/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('config')
  getConfig(
    @CurrentUser() user: AuthUser,
    @Query('dashboard_key') dashboardKey: string = 'home',
  ) {
    return this.dashboardService.getConfig(user.id, dashboardKey);
  }

  @Post('config')
  saveConfig(
    @CurrentUser() user: AuthUser,
    @Body() dto: SaveDashboardConfigDto,
  ) {
    console.log('[Dashboard] saveConfig called:', { userId: user.id, dashboard_key: dto.dashboard_key, widgetsCount: dto.widgets?.length });
    return this.dashboardService.saveConfig(user.id, dto);
  }

  @Delete('config/:dashboardKey')
  deleteConfig(
    @CurrentUser() user: AuthUser,
    @Param('dashboardKey') dashboardKey: string,
  ) {
    return this.dashboardService.deleteConfig(user.id, dashboardKey);
  }

  @Get('data')
  getDashboardData(@Query('checks_days') checksDays?: string) {
    return this.dashboardService.getDashboardData(checksDays ? parseInt(checksDays, 10) : undefined);
  }

  @Get('personal')
  getPersonalData(@CurrentUser() user: AuthUser) {
    return this.dashboardService.getPersonalData(user.id);
  }
}
