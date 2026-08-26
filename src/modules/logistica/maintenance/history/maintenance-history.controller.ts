import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MaintenanceHistoryService } from './maintenance-history.service';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('logistica/maintenance/history')
@UseGuards(JwtAuthGuard)
export class MaintenanceHistoryController {
  constructor(private readonly service: MaintenanceHistoryService) {}

  @Get('vehicle/:vehicleId')
  @RequirePermissions('maintenance.orders.read')
  async getVehicleHistory(@Param('vehicleId') vehicleId: string) {
    return this.service.getVehicleHistory(vehicleId);
  }

  @Get('tire/:tireId')
  @RequirePermissions('maintenance.tires.read')
  async getTireHistory(@Param('tireId') tireId: string) {
    return this.service.getTireHistory(tireId);
  }

  @Get('order/:orderId')
  @RequirePermissions('maintenance.orders.read')
  async getOrderHistory(@Param('orderId') orderId: string) {
    return this.service.getOrderHistory(orderId);
  }
}
