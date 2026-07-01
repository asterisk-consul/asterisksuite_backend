import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@Controller('logistica/vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  // @RequirePermissions('vehicles.create')
  @Post()
  create(@Body() dto: CreateVehicleDto) {
    return this.service.create(dto);
  }

  // @RequirePermissions('vehicles.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // @RequirePermissions('vehicles.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // @RequirePermissions('vehicles.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    console.log('PATCH BODY:', dto);
    return this.service.update(id, dto);
  }

  // @RequirePermissions('vehicles.update')
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.service.desactivate(id);
  }

  // @RequirePermissions('vehicles.update')
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.service.active(id);
  }
}
