import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreateTripRateDto } from './dto/create-trip-rate.dto';
import { UpdateTripRateDto } from './dto/update-trip-rate.dto';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async findAll(company_id: string) {
    return this.prisma.trips.findMany({
      where: { company_id },
      include: {
        vehicle_combination: {
          include: {
            tractor: true,
            trailer: true,
            drivers: true,
          },
        },

        trip_rates: {
          include: {
            transfer_rates: true,
          },
        },

        corridors: {
          include: {
            origin_location: true,
            destination_location: true,
            corridorStops: {
              orderBy: { stop_order: 'asc' },
              include: {
                location: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const trip = await this.prisma.trips.findUnique({
      where: { id },
      include: {
        trip_rates: {
          include: {
            transfer_rates: true,
          },
        },

        corridors: {
          include: {
            origin_location: true,
            destination_location: true,
            corridorStops: {
              orderBy: { stop_order: 'asc' },
              include: {
                location: true,
              },
            },
          },
        },
      },
    });

    if (!trip) throw new NotFoundException('Trip not found');

    return trip;
  }

  async create(dto: CreateTripDto) {
    let corridorId = dto.corridor_id ?? null;

    if (dto.route) {
      const corridor = await this.prisma.corridors.create({
        data: {
          company_id: dto.company_id,
          origin_location_id: dto.route.origin_location_id,
          destination_location_id: dto.route.destination_location_id,
          is_template: false,
          corridorStops: {
            create: dto.route.stops.map((stop) => ({
              location_id: stop.location_id,
              stop_order: stop.stop_order,
            })),
          },
        },
      });

      corridorId = corridor.id;
    }

    return this.prisma.trips.create({
      data: {
        company_id: dto.company_id,
        reference_number: dto.reference_number,
        vehicle_combination_id: dto.vehicle_combination_id,
        origin_location_id: dto.origin_location_id,
        destination_location_id: dto.destination_location_id,
        departure_time: dto.departure_time,
        arrival_time: dto.arrival_time,
        status: dto.status,
        kilometers: dto.kilometers,
        corridor_id: corridorId, // ✅ campo escalar directo, sin casteos
      },
    });
  }

  async update(id: string, dto: UpdateTripDto) {
    await this.findOne(id);

    return this.prisma.trips.update({
      where: { id },
      data: dto,
    });
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id);

    return this.prisma.trips.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.trips.delete({
      where: { id },
    });
  }

  // ------------------------------
  // TRIP RATES
  // ------------------------------

  async addRate(trip_id: string, dto: CreateTripRateDto) {
    return this.prisma.trip_rates.create({
      data: {
        trip_id,
        rate_id: dto.rate_id,
        value: dto.value,
      },
    });
  }

  async updateRate(id: string, dto: UpdateTripRateDto) {
    return this.prisma.trip_rates.update({
      where: { id },
      data: {
        value: dto.value,
      },
    });
  }

  async removeRate(id: string) {
    return this.prisma.trip_rates.delete({
      where: { id },
    });
  }
}
