import { NotFoundException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { buildPrismaCreate } from '@/common/utils/buildPrisma';
import { DispatchStatus, Prisma, TripStatus } from '@/generated/prisma/client';
import { DocumentsSalesService } from '../../../erp/documents-sales/documents_sales.services';

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
    private documentsSalesService: DocumentsSalesService,
  ) {}

  /* =========================
     MAP TRIP TO UNIQUE ORDERS
  ========================= */
  private mapTripWithUniqueOrders(trip: any) {
    if (!trip.trip_stops) return { ...trip, unique_orders: [] };

    const orderMap = new Map<string, any>();

    trip.trip_stops.forEach((stop) => {
      stop.trip_orders.forEach((o) => {
        if (!orderMap.has(o.dispatch_order_id)) {
          orderMap.set(o.dispatch_order_id, {
            dispatch_order_id: o.dispatch_order_id,
            order_number: o.order_number,
            customer_name: o.customer_name,
            actions: [o.action],
            origins: o.origin_location_id ? [o.origin_location_id] : [],
            destinations: o.destination_location_id
              ? [o.destination_location_id]
              : [],
          });
        } else {
          const existing = orderMap.get(o.dispatch_order_id);
          if (!existing.actions.includes(o.action))
            existing.actions.push(o.action);
          if (
            o.origin_location_id &&
            !existing.origins.includes(o.origin_location_id)
          )
            existing.origins.push(o.origin_location_id);
          if (
            o.destination_location_id &&
            !existing.destinations.includes(o.destination_location_id)
          )
            existing.destinations.push(o.destination_location_id);
        }
      });
    });

    return { ...trip, unique_orders: Array.from(orderMap.values()) };
  }

  /* =========================
     FIND ALL
  ========================= */
  async findAll() {
    const trips = await this.prisma.trips.findMany({
      include: {
        vehicle_combination: {
          include: { tractor: true, trailer: true, drivers: true },
        },
        locations_trips_destination_location_idTolocations: true,
        locations_trips_origin_location_idTolocations: true,
        trip_stops: {
          orderBy: { stop_order: 'asc' },
          include: {
            location: true,
            trip_orders: {
              include: {
                dispatch_order: {
                  include: { customers: true },
                },
              },
            },
          },
        },
      },
    });

    return trips.map((trip) => {
      const tripMapped = {
        ...trip,
        trip_stops: trip.trip_stops?.map((stop) => ({
          ...stop,
          trip_orders: stop.trip_orders.map((to) => ({
            dispatch_order_id: to.dispatch_order_id,
            order_number: to.dispatch_order?.order_number ?? '—',
            customer_name: to.dispatch_order?.customers?.name ?? '—',
            action: to.action,
            origin_location_id: stop.location_id,
            destination_location_id: stop.location_id,
          })),
        })),
      };
      return this.mapTripWithUniqueOrders(tripMapped);
    });
  }

  /* =========================
     FIND ONE
  ========================= */
  async findOne(id: string) {
    const trip = await this.prisma.trips.findUnique({
      where: { id },
      include: {
        vehicle_combination: {
          include: { tractor: true, trailer: true, drivers: true },
        },
        locations_trips_destination_location_idTolocations: true,
        locations_trips_origin_location_idTolocations: true,
        trip_stops: {
          orderBy: { stop_order: 'asc' },
          include: {
            location: true,
            trip_orders: {
              include: {
                dispatch_order: {
                  include: { customers: true },
                },
              },
            },
          },
        },
      },
    });

    if (!trip) throw new NotFoundException('Trip not found');

    const tripMapped = {
      ...trip,
      trip_stops: trip.trip_stops?.map((stop) => ({
        ...stop,
        trip_orders: stop.trip_orders.map((to) => ({
          dispatch_order_id: to.dispatch_order_id,
          order_number: to.dispatch_order?.order_number ?? '—',
          customer_name: to.dispatch_order?.customers?.name ?? '—',
          action: to.action,
          origin_location_id: stop.location_id,
          destination_location_id: stop.location_id,
        })),
      })),
    };

    return this.mapTripWithUniqueOrders(tripMapped);
  }

  /* =========================
     CREATE
  ========================= */
  async create(dto: CreateTripDto) {
    return this.prisma.trips.create({
      data: buildPrismaCreate(dto) as Prisma.tripsCreateInput,
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

  /* =========================
     UPDATE
  ========================= */
  async update(id: string, dto: UpdateTripDto) {
    await this.prisma.trips.update({
      where: { id },
      data: dto,
    });

    // 🔥 CLAVE: reutilizar findOne
    return this.findOne(id);
  }

  async updateStatus(id: string, status: TripStatus) {
    await this.findOne(id);

    const trip = await this.prisma.trips.update({
      where: { id },
      data: { status },
    });

    // 🔥 Hook: cuando el viaje pasa a COMPLETED generar borradores de factura
    if (status === TripStatus.COMPLETED) {
      await this.documentsSalesService.generateDraftsFromTrip(id);
    }

    return trip;
  }
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.trips.delete({ where: { id } });
  }

  /* =========================
     ASSIGN ORDERS
  ========================= */
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
    const trip = await this.prisma.trips.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');

    const sortedStops = dto.stops.sort((a, b) => a.stop_order - b.stop_order);

    return this.prisma.$transaction(async (tx) => {
      await tx.trip_stop_orders.deleteMany({
        where: { trip_stop: { trip_id: tripId } },
      });

      await tx.trip_stops.deleteMany({ where: { trip_id: tripId } });

      const origin = sortedStops[0]?.location_id;
      const destination = sortedStops[sortedStops.length - 1]?.location_id;

      await tx.trip_stops.createMany({
        data: sortedStops.map((s) => ({
          trip_id: tripId,
          location_id: s.location_id,
          stop_order: s.stop_order,
          stop_type: s.stop_type,
        })),
      });

      const createdStops = await tx.trip_stops.findMany({
        where: { trip_id: tripId },
      });
      const stopMap = new Map(createdStops.map((s) => [s.stop_order, s.id]));

      const tripOrdersData = sortedStops.flatMap((s) =>
        s.orders.map((o) => ({
          trip_stop_id: stopMap.get(s.stop_order)!,
          dispatch_order_id: o.dispatch_order_id,
          action: o.action,
        })),
      );

      await tx.trip_stop_orders.createMany({ data: tripOrdersData });

      const orderIds = tripOrdersData.map((o) => o.dispatch_order_id);
      await tx.dispatch_orders.updateMany({
        where: { id: { in: orderIds } },
        data: { status: DispatchStatus.ASSIGNED },
      });

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
  /* =========================
   REMOVE ORDER FROM TRIP
========================= */
  async removeOrderFromTrip(tripId: string, dispatchOrderId: string) {
    const trip = await this.prisma.trips.findUnique({
      where: { id: tripId },
      include: { trip_stops: true },
    });
    if (!trip) throw new NotFoundException('Trip not found');

    // Buscar todos los stops de ese trip
    const stopIds = trip.trip_stops.map((s) => s.id);

    // Borrar la relación de esa orden en todos los stops
    await this.prisma.trip_stop_orders.deleteMany({
      where: {
        trip_stop_id: { in: stopIds },
        dispatch_order_id: dispatchOrderId,
      },
    });

    // Opcional: actualizar status de la orden a PENDING o PLANIFICADA
    await this.prisma.dispatch_orders.update({
      where: { id: dispatchOrderId },
      data: { status: DispatchStatus.PENDING },
    });

    return { success: true };
  }
}
