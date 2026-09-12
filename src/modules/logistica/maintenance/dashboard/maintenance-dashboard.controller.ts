import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MaintenanceDashboardService } from './maintenance-dashboard.service';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('logistica/maintenance/dashboard')
@UseGuards(JwtAuthGuard)
export class MaintenanceDashboardController {
  constructor(private readonly service: MaintenanceDashboardService) {}

  @Get()
  @RequirePermissions('maintenance.dashboard.read')
  async getOverview() {
    return this.service.getOverview();
  }

  @Get('upcoming')
  @RequirePermissions('maintenance.dashboard.read')
  async getUpcoming(@Query('limit') limit?: string) {
    return this.service.getUpcomingMaintenances(limit ? parseInt(limit) : 10);
  }

  @Get('overdue')
  @RequirePermissions('maintenance.dashboard.read')
  async getOverdue(@Query('limit') limit?: string) {
    return this.service.getOverdueMaintenances(limit ? parseInt(limit) : 10);
  }
}
