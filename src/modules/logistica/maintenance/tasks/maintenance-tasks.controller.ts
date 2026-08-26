import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MaintenanceTasksService } from './maintenance-tasks.service';
import { CreateMaintenanceTaskDto } from './dto/maintenance-task.dto';
import { UpdateMaintenanceTaskDto } from './dto/maintenance-task.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('logistica/maintenance/orders/:orderId/tasks')
@UseGuards(JwtAuthGuard)
export class MaintenanceTasksController {
  constructor(private readonly service: MaintenanceTasksService) {}

  @Get()
  @RequirePermissions('maintenance.tasks.read')
  async findByOrder(@Param('orderId') orderId: string) {
    return this.service.findByOrder(orderId);
  }

  @Post()
  @RequirePermissions('maintenance.tasks.create')
  async create(
    @Param('orderId') orderId: string,
    @Body() dto: CreateMaintenanceTaskDto,
    @CurrentUser() user: any
  ) {
    return this.service.create({ ...dto, maintenance_order_id: orderId }, user.id);
  }

  @Patch(':id')
  @RequirePermissions('maintenance.tasks.update')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMaintenanceTaskDto,
    @CurrentUser() user: any
  ) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('maintenance.tasks.delete')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.id);
  }
}
