import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VehicleCombinationsService } from './vehicle-combinations.service';
import { CreateVehicleCombinationDto } from './dto/create-vehicle-combination.dto';
import { UpdateVehicleCombinationDto } from './dto/update-vehicle-combination.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('logistica/vehicle-combinations')
@UseGuards(JwtAuthGuard)
export class VehicleCombinationsController {
  constructor(private readonly service: VehicleCombinationsService) {}

  @Post()
  create(@Body() dto: CreateVehicleCombinationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.service.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVehicleCombinationDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/close')
  close(@Param('id') id: string) {
    return this.service.close(id);
  }
}
