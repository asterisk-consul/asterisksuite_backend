import { Controller, Post, Patch, Body, Param } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { AddTripCargoDto } from './dto/add-trip.dto';

@Controller('transport/trips')
export class TripsController {
  constructor(private readonly service: TripsService) {}

  @Post()
  create(@Body() dto: CreateTripDto) {
    const userId = 'HARDCODE_USER_ID'; // luego JWT
    return this.service.create(dto, userId);
  }

  @Patch(':id/start')
  start(@Param('id') id: string) {
    return this.service.start(id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.service.complete(id);
  }

  @Post('cargo')
  addCargo(@Body() dto: AddTripCargoDto) {
    return this.service.addCargo(dto);
  }
}
