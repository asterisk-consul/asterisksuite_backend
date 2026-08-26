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
import { VehicleTirePositionsService } from './vehicle-tire-positions.service';
import { CreateVehicleTirePositionDto } from './dto/position.dto';
import { UpdateVehicleTirePositionDto } from './dto/position.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('logistica/maintenance/vehicles/:vehicleId/tire-positions')
@UseGuards(JwtAuthGuard)
export class VehicleTirePositionsController {
  constructor(private readonly service: VehicleTirePositionsService) {}

  @Get()
  @RequirePermissions('maintenance.positions.read')
  async findByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.service.findByVehicle(vehicleId);
  }

  @Get(':id')
  @RequirePermissions('maintenance.positions.read')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions('maintenance.positions.create')
  async create(
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateVehicleTirePositionDto,
    @CurrentUser() user: any
  ) {
    return this.service.create({ ...dto, vehicle_id: vehicleId }, user.id);
  }

  @Patch(':id')
  @RequirePermissions('maintenance.positions.update')
  async update(@Param('id') id: string, @Body() dto: UpdateVehicleTirePositionDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('maintenance.positions.delete')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.id);
  }
}
