import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

export class TripsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.trips.findMany({
      include: {
        vehicle_combination: {
          include: {
            tractor: true,
            trailer: true,
            drivers: true,
          },
        },

        trip_stops: {
          orderBy: { stop_order: 'asc' },
          include: {
            location: true,
            trip_orders: {
              include: {
                dispatch_order: {
                  include: {
                    customers: true,
                    origin_location: true,
                    destination_location: true,
                  },
                },
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
        vehicle_combination: {
          include: {
            tractor: true,
            trailer: true,
            drivers: true,
          },
        },

        trip_stops: {
          orderBy: { stop_order: 'asc' },
          include: {
            location: true,
            trip_orders: {
              include: {
                dispatch_order: {
                  include: {
                    customers: true,
                    origin_location: true,
                    destination_location: true,
                  },
                },
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
    return this.prisma.trips.create({
      data: {
        reference_number: dto.reference_number,
        week: dto.week ?? null,

        vehicle_combination_id: dto.vehicle_combination_id,
        origin_location_id: dto.origin_location_id,
        destination_location_id: dto.destination_location_id,
        departure_time: dto.departure_time,
        arrival_time: dto.arrival_time,
        status: dto.status,
        kilometers: dto.kilometers,
      },
      include: {
        vehicle_combination: {
          include: {
            tractor: true,
            trailer: true,
            drivers: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateTripDto) {
    await this.findOne(id);

    return this.prisma.trips.update({
      where: { id },
      data: {
        ...dto,
      },
      include: {
        vehicle_combination: {
          include: {
            tractor: true,
            trailer: true,
            drivers: true,
          },
        },
      },
    });
  }
  async updateStatus(id: string, status: string) {
    await this.findOne(id);

    return this.prisma.trips.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.trips.delete({
      where: { id },
    });
  }

  async assignOrders(
    tripId: string,
    dto: {
      stops: {
        location_id: string;
        stop_order: number;
        stop_type?: string;
        orders: {
          dispatch_order_id: string;
          action: string;
        }[];
      }[];
    },
  ) {
    const trip = await this.prisma.trips.findUnique({
      where: { id: tripId },
    });

    if (!trip) throw new NotFoundException('Trip not found');

    const sortedStops = dto.stops.sort((a, b) => a.stop_order - b.stop_order);

    return this.prisma.$transaction(async (tx) => {
      // 🧹 borrar planificación previa (replanificación)
      await tx.trip_stop_orders.deleteMany({
        where: {
          trip_stop: {
            trip_id: tripId,
          },
        },
      });

      await tx.trip_stops.deleteMany({
        where: { trip_id: tripId },
      });

      // 📍 recalcular origen/destino
      const origin = sortedStops[0]?.location_id;
      const destination = sortedStops[sortedStops.length - 1]?.location_id;

      // 🚛 crear nuevos stops + relaciones
      await tx.trip_stops.createMany({
        data: sortedStops.map((s) => ({
          trip_id: tripId,
          location_id: s.location_id,
          stop_order: s.stop_order,
          stop_type: s.stop_type,
        })),
      });

      // 🔥 traer stops creados (para mapear IDs)
      const createdStops = await tx.trip_stops.findMany({
        where: { trip_id: tripId },
      });

      const stopMap = new Map(createdStops.map((s) => [s.stop_order, s.id]));

      // 🔗 crear relaciones con órdenes
      const tripOrdersData = sortedStops.flatMap((s) =>
        s.orders.map((o) => ({
          trip_stop_id: stopMap.get(s.stop_order)!,
          dispatch_order_id: o.dispatch_order_id,
          action: o.action,
        })),
      );

      await tx.trip_stop_orders.createMany({
        data: tripOrdersData,
      });

      // 🔄 actualizar órdenes
      const orderIds = tripOrdersData.map((o) => o.dispatch_order_id);

      await tx.dispatch_orders.updateMany({
        where: { id: { in: orderIds } },
        data: { status: 'planned' },
      });

      // 📍 actualizar trip
      await tx.trips.update({
        where: { id: tripId },
        data: {
          origin_location_id: origin,
          destination_location_id: destination,
        },
      });

      return { success: true };
    });
  }

  //   // ------------------------------
  //   // TRIP RATES
  //   // ------------------------------

  //   async addRate(trip_id: string, dto: CreateTripRateDto) {
  //     return this.prisma.trip_rates.create({
  //       data: {
  //         trip_id,
  //         rate_id: dto.rate_id,
  //         value: dto.value,
  //       },
  //     });
  //   }

  //   async updateRate(id: string, dto: UpdateTripRateDto) {
  //     return this.prisma.trip_rates.update({
  //       where: { id },
  //       data: { value: dto.value },
  //     });
  //   }

  //   async removeRate(id: string) {
  //     return this.prisma.trip_rates.delete({
  //       where: { id },
  //     });
  //   }
}
