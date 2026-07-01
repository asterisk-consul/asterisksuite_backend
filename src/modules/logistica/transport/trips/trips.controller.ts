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
import { TripStatus } from '@/generated/prisma/enums';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly service: TripsService) {}

  // ✅ Específicas primero
  // @RequirePermissions('trips.read')
  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // @RequirePermissions('trips.update')
  @Patch(':id/status/:status')
  updateStatus(@Param('id') id: string, @Param('status') status: TripStatus) {
    return this.service.updateStatus(id, status);
  }

  // @RequirePermissions('trips.delete')
  @Delete(':id/orders/:dispatchOrderId')
  removeOrderFromTrip(
    @Param('id') tripId: string,
    @Param('dispatchOrderId') dispatchOrderId: string,
  ) {
    return this.service.removeOrderFromTrip(tripId, dispatchOrderId);
  }

  // ⚠️ Genéricas después
  // @RequirePermissions('trips.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // @RequirePermissions('trips.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTripDto) {
    return this.service.update(id, dto);
  }

  // @RequirePermissions('trips.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // @RequirePermissions('trips.create')
  @Post(':id/assign-orders')
  assignOrders(@Param('id') id: string, @Body() dto: any) {
    return this.service.assignOrders(id, dto);
  }

  // @RequirePermissions('trips.create')
  @Post()
  create(@Body() dto: CreateTripDto) {
    return this.service.create(dto);
  }
}
