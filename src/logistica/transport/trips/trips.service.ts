import { Injectable } from '@nestjs/common';
import { LogisticaPrismaService } from 'src/prisma/prisma-logistica.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { AddTripCargoDto } from './dto/add-trip.dto';
@Injectable()
export class TripsService {
  constructor(private prisma: LogisticaPrismaService) {}

  create(dto: CreateTripDto, userId: string) {
    return this.prisma.trips.create({
      data: {
        company_id: dto.companyId,
        vehicle_id: dto.vehicleId,
        driver_id: dto.driverId,
        origin_warehouse_id: dto.originWarehouseId,
        destination_warehouse_id: dto.destinationWarehouseId,
        origin_location_id: dto.originLocationId,
        destination_location_id: dto.destinationLocationId,
        status: 'PLANNED',
        notes: dto.notes,
        created_by: userId,
      },
    });
  }

  async start(id: string) {
    return this.prisma.trips.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        departure_time: new Date(),
      },
    });
  }

  async complete(id: string) {
    return this.prisma.trips.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        arrival_time: new Date(),
      },
    });
  }
  async addCargo(dto: AddTripCargoDto) {
    return this.prisma.trip_cargo.create({
      data: {
        trip_id: dto.tripId,
        pallet_id: dto.palletId,
        delivery_note_id: dto.deliveryNoteId,
        loaded_at: new Date(),
      },
    });
  }
}
