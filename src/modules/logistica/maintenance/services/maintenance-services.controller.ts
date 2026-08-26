import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MaintenanceServicesService } from './maintenance-services.service';
import { CreateMaintenanceServiceDto } from './dto/maintenance-service.dto';
import { UpdateMaintenanceServiceDto } from './dto/maintenance-service.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('logistica/maintenance/orders/:orderId/services')
@UseGuards(JwtAuthGuard)
export class MaintenanceServicesController {
  constructor(private readonly service: MaintenanceServicesService) {}

  @Get()
  @RequirePermissions('maintenance.services.read')
  async findByOrder(@Param('orderId') orderId: string) {
    return this.service.findByOrder(orderId);
  }

  @Post()
  @RequirePermissions('maintenance.services.create')
  async create(
    @Param('orderId') orderId: string,
    @Body() dto: CreateMaintenanceServiceDto,
    @CurrentUser() user: any
  ) {
    return this.service.create({ ...dto, maintenance_order_id: orderId }, user.id);
  }

  @Patch(':id')
  @RequirePermissions('maintenance.services.update')
  async update(@Param('id') id: string, @Body() dto: UpdateMaintenanceServiceDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('maintenance.services.delete')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.id);
  }
}
