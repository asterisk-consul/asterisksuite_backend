import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreateTripRateDto } from './dto/create-trip-rate.dto';
import { UpdateTripRateDto } from './dto/update-trip-rate.dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly service: TripsService) {}

  @Get(':company_id')
  findAll(@Param('company_id') company_id: string) {
    return this.service.findAll(company_id);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTripDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTripDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // ------------------------------
  // TRIP RATES
  // ------------------------------

  @Post(':trip_id/rates')
  addRate(@Param('trip_id') trip_id: string, @Body() dto: CreateTripRateDto) {
    return this.service.addRate(trip_id, dto);
  }

  @Patch('rates/:id')
  updateRate(@Param('id') id: string, @Body() dto: UpdateTripRateDto) {
    return this.service.updateRate(id, dto);
  }

  @Delete('rates/:id')
  removeRate(@Param('id') id: string) {
    return this.service.removeRate(id);
  }
}
