import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MaintenanceOrdersService } from './maintenance-orders.service';
import { CreateMaintenanceOrderDto } from './dto/create-maintenance-order.dto';
import { UpdateMaintenanceOrderDto } from './dto/update-maintenance-order.dto';
import { FilterMaintenanceOrdersDto } from './dto/filter-maintenance-orders.dto';
import { ChangeStatusDto, BulkUpdateStatusDto } from './dto/change-status.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('logistica/maintenance/orders')
@UseGuards(JwtAuthGuard)
export class MaintenanceOrdersController {
  constructor(private readonly service: MaintenanceOrdersService) {}

  @Get()
  @RequirePermissions('maintenance.orders.read')
  async findAll(@Query() filters: FilterMaintenanceOrdersDto) {
    return this.service.findAll(filters);
  }

  @Get('stats')
  @RequirePermissions('maintenance.orders.read')
  async getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  @RequirePermissions('maintenance.orders.read')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions('maintenance.orders.create')
  async create(@Body() dto: CreateMaintenanceOrderDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  @RequirePermissions('maintenance.orders.update')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMaintenanceOrderDto,
    @CurrentUser() user: any
  ) {
    return this.service.update(id, dto, user.id);
  }

  @Patch(':id/status')
  @RequirePermissions('maintenance.orders.execute')
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeStatusDto,
    @CurrentUser() user: any
  ) {
    return this.service.changeStatus(id, dto, user.id);
  }

  @Patch('bulk/status')
  @RequirePermissions('maintenance.orders.execute')
  async bulkChangeStatus(@Body() dto: BulkUpdateStatusDto, @CurrentUser() user: any) {
    return this.service.bulkChangeStatus(dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('maintenance.orders.delete')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.id);
  }
}
