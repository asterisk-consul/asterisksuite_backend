import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TireMovementsService } from './tire-movements.service';
import { CreateTireMovementDto } from './dto/movement.dto';
import { FilterTireMovementsDto } from './dto/movement.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('logistica/maintenance/tires/:tireId/movements')
@UseGuards(JwtAuthGuard)
export class TireMovementsController {
  constructor(private readonly service: TireMovementsService) {}

  @Get()
  @RequirePermissions('maintenance.tires.read')
  async findAll(@Param('tireId') tireId: string, @Query() filters: FilterTireMovementsDto) {
    return this.service.findAll({ ...filters, tire_id: tireId });
  }

  @Get('tire/:tireId')
  @RequirePermissions('maintenance.tires.read')
  async findByTire(@Param('tireId') tireId: string) {
    return this.service.findByTire(tireId);
  }

  @Post()
  @RequirePermissions('maintenance.tires.execute')
  async create(
    @Param('tireId') tireId: string,
    @Body() dto: CreateTireMovementDto,
    @CurrentUser() user: any
  ) {
    return this.service.create({ ...dto, tire_id: tireId }, user.id);
  }

  @Delete(':id')
  @RequirePermissions('maintenance.tires.execute')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.id);
  }
}
