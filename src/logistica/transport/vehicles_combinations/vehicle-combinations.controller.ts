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
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';

@Controller('vehicle-combinations')
@UseGuards(JwtAuthGuard)
export class VehicleCombinationsController {
  constructor(private readonly service: VehicleCombinationsService) {}

  // --------------------------------------------------
  // CREATE
  // --------------------------------------------------

  @Post()
  create(@Body() dto: CreateVehicleCombinationDto) {
    return this.service.create(dto);
  }

  // --------------------------------------------------
  // LISTAR TODAS
  // --------------------------------------------------

  @Get()
  findAll(@Query('company_id') company_id: string) {
    return this.service.findAll(company_id);
  }

  // --------------------------------------------------
  // LISTAR ACTIVAS
  // --------------------------------------------------

  @Get('active')
  findActive(@Query('company_id') company_id: string) {
    return this.service.findActive(company_id);
  }

  // --------------------------------------------------
  // HISTORIAL POR VEHICULO
  // --------------------------------------------------

  @Get('vehicle/:vehicle_id')
  findByVehicle(@Param('vehicle_id') vehicle_id: string) {
    return this.service.findByVehicle(vehicle_id);
  }

  // --------------------------------------------------
  // BUSCAR UNA
  // --------------------------------------------------

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // --------------------------------------------------
  // FINALIZAR COMBINACION
  // --------------------------------------------------

  @Patch(':id/finish')
  finish(@Param('id') id: string) {
    return this.service.finish(id);
  }

  // --------------------------------------------------
  // ACTIVAR COMBINACION
  // --------------------------------------------------

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.service.activate(id);
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVehicleCombinationDto) {
    return this.service.update(id, dto);
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.remove(id, user.id);
  }
}
