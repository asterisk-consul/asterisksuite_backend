import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MaintenanceReportsService } from './maintenance-reports.service';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('logistica/maintenance/reports')
@UseGuards(JwtAuthGuard)
export class MaintenanceReportsController {
  constructor(private readonly service: MaintenanceReportsService) {}

  @Get('by-vehicle')
  @RequirePermissions('maintenance.reports.read')
  async byVehicle(@Query('vehicle_id') vehicleId?: string, @Query('date_from') dateFrom?: string, @Query('date_to') dateTo?: string) {
    return this.service.byVehicle(vehicleId, dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
  }

  @Get('costs-by-vehicle')
  @RequirePermissions('maintenance.reports.read')
  async costsByVehicle(@Query('date_from') dateFrom?: string, @Query('date_to') dateTo?: string) {
    return this.service.costsByVehicle(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
  }

  @Get('by-category')
  @RequirePermissions('maintenance.reports.read')
  async byCategory(@Query('date_from') dateFrom?: string, @Query('date_to') dateTo?: string) {
    return this.service.byCategory(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
  }

  @Get('by-period')
  @RequirePermissions('maintenance.reports.read')
  async byPeriod(@Query('date_from') dateFrom: string, @Query('date_to') dateTo: string, @Query('group_by') groupBy: 'day' | 'week' | 'month' | 'year' = 'month') {
    return this.service.byPeriod(new Date(dateFrom), new Date(dateTo), groupBy);
  }

  @Get('pending-summary')
  @RequirePermissions('maintenance.reports.read')
  async pendingSummary() {
    return this.service.pendingSummary();
  }

  @Get('tires')
  @RequirePermissions('maintenance.reports.read')
  async tireReport(@Query('tire_id') tireId?: string, @Query('date_from') dateFrom?: string, @Query('date_to') dateTo?: string) {
    return this.service.tireReport(tireId, dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
  }

  @Get('tire-performance')
  @RequirePermissions('maintenance.reports.read')
  async tirePerformance(
    @Query('brand') brand?: string,
    @Query('model') model?: string,
    @Query('supplier_id') supplierId?: string,
    @Query('position_number') positionNumber?: string,
    @Query('vehicle_id') vehicleId?: string,
  ) {
    return this.service.tirePerformance({
      brand,
      model,
      supplier_id: supplierId,
      position_number: positionNumber ? parseInt(positionNumber) : undefined,
      vehicle_id: vehicleId,
    });
  }

  @Get('tire-by-position')
  @RequirePermissions('maintenance.reports.read')
  async tireByPosition(@Query('vehicle_type') vehicleType?: string) {
    return this.service.tireByPosition(vehicleType);
  }

  @Get('availability')
  @RequirePermissions('maintenance.reports.read')
  async availability(@Query('date_from') dateFrom: string, @Query('date_to') dateTo: string) {
    return this.service.availability(new Date(dateFrom), new Date(dateTo));
  }
}
