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
        vehicle_combination: true,
        trip_rates: {
          include: {
            transfer_rates: true,
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
      },
    });

    if (!trip) throw new NotFoundException('Trip not found');

    return trip;
  }

  async create(dto: CreateTripDto) {
    return this.prisma.trips.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateTripDto) {
    await this.findOne(id);

    return this.prisma.trips.update({
      where: { id },
      data: dto,
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
