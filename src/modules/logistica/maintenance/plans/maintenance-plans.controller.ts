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
import { MaintenancePlansService } from './maintenance-plans.service';
import { CreateMaintenancePlanDto } from './dto/maintenance-plan.dto';
import { UpdateMaintenancePlanDto } from './dto/maintenance-plan.dto';
import { AssignPlanToAssetDto } from './dto/maintenance-plan.dto';
import { CheckDueMaintenancesDto } from './dto/maintenance-plan.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('logistica/maintenance/plans')
@UseGuards(JwtAuthGuard)
export class MaintenancePlansController {
  constructor(private readonly service: MaintenancePlansService) {}

  @Get()
  @RequirePermissions('maintenance.plans.read')
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @RequirePermissions('maintenance.plans.read')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions('maintenance.plans.create')
  async create(@Body() dto: CreateMaintenancePlanDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  @RequirePermissions('maintenance.plans.update')
  async update(@Param('id') id: string, @Body() dto: UpdateMaintenancePlanDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.id);
  }

  @Post(':id/assign')
  @RequirePermissions('maintenance.plans.execute')
  async assignToAsset(
    @Param('id') id: string,
    @Body() dto: AssignPlanToAssetDto,
    @CurrentUser() user: any
  ) {
    return this.service.assignToAsset({ ...dto, plan_id: id }, user.id);
  }

  @Delete(':id/assign/:assetId')
  @RequirePermissions('maintenance.plans.execute')
  async unassignFromAsset(@Param('id') id: string, @Param('assetId') assetId: string, @CurrentUser() user: any) {
    return this.service.unassignFromAsset(id, assetId, user.id);
  }

  @Post('check-due')
  @RequirePermissions('maintenance.plans.read')
  async checkDue(@Body() dto: CheckDueMaintenancesDto) {
    return this.service.checkDueMaintenances(dto);
  }

  @Post('generate-due')
  @RequirePermissions('maintenance.plans.execute')
  async generateDue(@Body() dto: CheckDueMaintenancesDto, @CurrentUser() user: any) {
    return this.service.generateDueOrders(dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('maintenance.plans.delete')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.id);
  }
}
