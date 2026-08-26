import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MaintenancePartsService } from './maintenance-parts.service';
import { CreateMaintenancePartDto } from './dto/maintenance-part.dto';
import { UpdateMaintenancePartDto } from './dto/maintenance-part.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('logistica/maintenance/orders/:orderId/parts')
@UseGuards(JwtAuthGuard)
export class MaintenancePartsController {
  constructor(private readonly service: MaintenancePartsService) {}

  @Get()
  @RequirePermissions('maintenance.parts.read')
  async findByOrder(@Param('orderId') orderId: string) {
    return this.service.findByOrder(orderId);
  }

  @Post()
  @RequirePermissions('maintenance.parts.create')
  async create(
    @Param('orderId') orderId: string,
    @Body() dto: CreateMaintenancePartDto,
    @CurrentUser() user: any
  ) {
    return this.service.create({ ...dto, maintenance_order_id: orderId }, user.id);
  }

  @Patch(':id')
  @RequirePermissions('maintenance.parts.update')
  async update(@Param('id') id: string, @Body() dto: UpdateMaintenancePartDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('maintenance.parts.delete')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.id);
  }
}
