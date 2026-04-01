import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly service: TripsService) {}

  // ✅ Rutas específicas PRIMERO
  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/status/:status') // ✅ antes de :id
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.service.updateStatus(id, status);
  }

  // ✅ Rutas genéricas DESPUÉS
  @Get(':company_id')
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id') // ← esta debe ir después de todas las específicas
  update(@Param('id') id: string, @Body() dto: UpdateTripDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/assign-orders')
  assignOrders(@Param('id') id: string, @Body() dto: any) {
    return this.service.assignOrders(id, dto);
  }

  @Post()
  create(@Body() dto: CreateTripDto) {
    return this.service.create(dto);
  }
}
