import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';

import { VehicleCombinationsService } from './vehicle-combinations.service';
import { CreateVehicleCombinationDto } from './dto/create-vehicle-combination.dto';
import { UpdateVehicleCombinationDto } from './dto/update-vehicle-combination.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('vehicle-combinations')
@UseGuards(JwtAuthGuard)
export class VehicleCombinationsController {
  constructor(private readonly service: VehicleCombinationsService) {}

  // --------------------------------------------------
  // CREATE
  // --------------------------------------------------

  @RequirePermissions('vehicle_combinations.create')
  @Post()
  create(@Body() dto: CreateVehicleCombinationDto) {
    return this.service.create(dto);
  }

  // --------------------------------------------------
  // LISTAR TODAS
  // --------------------------------------------------

  @RequirePermissions('vehicle_combinations.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @RequirePermissions('vehicle_combinations.read')
  @Get('available')
  findAvailable(@Query('date') date: string) {
    return this.service.findAvailable(date);
  }

  // --------------------------------------------------
  // LISTAR ACTIVAS
  // --------------------------------------------------

  @RequirePermissions('vehicle_combinations.read')
  @Get('active')
  findActive() {
    return this.service.findActive();
  }

  // --------------------------------------------------
  // HISTORIAL POR VEHICULO
  // --------------------------------------------------

  @RequirePermissions('vehicle_combinations.read')
  @Get('vehicle/:vehicle_id')
  findByVehicle(@Param('vehicle_id') vehicle_id: string) {
    return this.service.findByVehicle(vehicle_id);
  }

  // --------------------------------------------------
  // BUSCAR UNA
  // --------------------------------------------------

  @RequirePermissions('vehicle_combinations.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // --------------------------------------------------
  // FINALIZAR COMBINACION
  // --------------------------------------------------

  @RequirePermissions('vehicle_combinations.update')
  @Patch(':id/finish')
  finish(@Param('id') id: string) {
    return this.service.finish(id);
  }

  // --------------------------------------------------
  // ACTIVAR COMBINACION
  // --------------------------------------------------

  @RequirePermissions('vehicle_combinations.update')
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.service.activate(id);
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  @RequirePermissions('vehicle_combinations.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVehicleCombinationDto) {
    return this.service.update(id, dto);
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  @RequirePermissions('vehicle_combinations.delete')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.remove(id, user.id);
  }
}
