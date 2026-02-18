import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Controller('transport/vehicles')
export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  @Post()
  create(@Body() dto: CreateVehicleDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.service.findAll(companyId);
  }
}
