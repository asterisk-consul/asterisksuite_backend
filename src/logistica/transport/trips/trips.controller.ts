import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { AddTripCargoDto } from './dto/add-trip.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';

@Controller('transport/trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly service: TripsService) {}

  @Post()
  create(@Body() dto: CreateTripDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user.id);
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
