import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MaintenanceLaborService } from './maintenance-labor.service';
import { CreateMaintenanceLaborDto } from './dto/maintenance-labor.dto';
import { UpdateMaintenanceLaborDto } from './dto/maintenance-labor.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('logistica/maintenance/orders/:orderId/labor')
@UseGuards(JwtAuthGuard)
export class MaintenanceLaborController {
  constructor(private readonly service: MaintenanceLaborService) {}

  @Get()
  @RequirePermissions('maintenance.labor.read')
  async findByOrder(@Param('orderId') orderId: string) {
    return this.service.findByOrder(orderId);
  }

  @Post()
  @RequirePermissions('maintenance.labor.create')
  async create(
    @Param('orderId') orderId: string,
    @Body() dto: CreateMaintenanceLaborDto,
    @CurrentUser() user: any
  ) {
    return this.service.create({ ...dto, maintenance_order_id: orderId }, user.id);
  }

  @Patch(':id')
  @RequirePermissions('maintenance.labor.update')
  async update(@Param('id') id: string, @Body() dto: UpdateMaintenanceLaborDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('maintenance.labor.delete')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.id);
  }
}
