import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
@Controller('transport/vehicles')
@UseGuards(JwtAuthGuard)
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
