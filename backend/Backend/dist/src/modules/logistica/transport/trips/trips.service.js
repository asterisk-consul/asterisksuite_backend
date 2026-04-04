"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const buildPrisma_1 = require("../../../../common/utils/buildPrisma");
const client_1 = require("../../../../generated/prisma/client");
let TripsService = class TripsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapTripWithUniqueOrders(trip) {
        if (!trip.trip_stops)
            return { ...trip, unique_orders: [] };
        const orderMap = new Map();
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
                }
                else {
                    const existing = orderMap.get(o.dispatch_order_id);
                    if (!existing.actions.includes(o.action))
                        existing.actions.push(o.action);
                    if (o.origin_location_id &&
                        !existing.origins.includes(o.origin_location_id))
                        existing.origins.push(o.origin_location_id);
                    if (o.destination_location_id &&
                        !existing.destinations.includes(o.destination_location_id))
                        existing.destinations.push(o.destination_location_id);
                }
            });
        });
        return { ...trip, unique_orders: Array.from(orderMap.values()) };
    }
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
    async findOne(id) {
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
        if (!trip)
            throw new common_1.NotFoundException('Trip not found');
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
    async create(dto) {
        return this.prisma.trips.create({
            data: (0, buildPrisma_1.buildPrismaCreate)(dto),
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
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.trips.update({
            where: { id },
            data: { ...dto },
            include: {
                vehicle_combination: {
                    include: { tractor: true, trailer: true, drivers: true },
                },
            },
        });
    }
    async updateStatus(id, status) {
        await this.findOne(id);
        return this.prisma.trips.update({ where: { id }, data: { status } });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.trips.delete({ where: { id } });
    }
    async assignOrders(tripId, dto) {
        const trip = await this.prisma.trips.findUnique({ where: { id: tripId } });
        if (!trip)
            throw new common_1.NotFoundException('Trip not found');
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
            const tripOrdersData = sortedStops.flatMap((s) => s.orders.map((o) => ({
                trip_stop_id: stopMap.get(s.stop_order),
                dispatch_order_id: o.dispatch_order_id,
                action: o.action,
            })));
            await tx.trip_stop_orders.createMany({ data: tripOrdersData });
            const orderIds = tripOrdersData.map((o) => o.dispatch_order_id);
            await tx.dispatch_orders.updateMany({
                where: { id: { in: orderIds } },
                data: { status: client_1.DispatchStatus.ASSIGNED },
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
    async removeOrderFromTrip(tripId, dispatchOrderId) {
        const trip = await this.prisma.trips.findUnique({
            where: { id: tripId },
            include: { trip_stops: true },
        });
        if (!trip)
            throw new common_1.NotFoundException('Trip not found');
        const stopIds = trip.trip_stops.map((s) => s.id);
        await this.prisma.trip_stop_orders.deleteMany({
            where: {
                trip_stop_id: { in: stopIds },
                dispatch_order_id: dispatchOrderId,
            },
        });
        await this.prisma.dispatch_orders.update({
            where: { id: dispatchOrderId },
            data: { status: client_1.DispatchStatus.PENDING },
        });
        return { success: true };
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TripsService);
//# sourceMappingURL=trips.service.js.map