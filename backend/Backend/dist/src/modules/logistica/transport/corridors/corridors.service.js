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
exports.CorridorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const object_utils_1 = require("../../../../common/utils/object.utils");
const routing_utils_1 = require("../../../../common/utils/routing.utils");
const prismaNamespace_1 = require("../../../../generated/prisma/internal/prismaNamespace");
let CorridorsService = class CorridorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRoutePoints(originId, destinationId, stops) {
        const locationIds = [
            originId,
            ...stops
                .sort((a, b) => a.stop_order - b.stop_order)
                .map((s) => s.location_id),
            destinationId,
        ];
        const locations = await this.prisma.locations.findMany({
            where: { id: { in: locationIds } },
            select: { id: true, latitude: true, longitude: true },
        });
        return locationIds
            .map((id) => locations.find((l) => l.id === id))
            .filter((l) => !!l?.latitude && !!l?.longitude)
            .map((l) => ({
            id: l.id,
            latitude: l.latitude.toNumber(),
            longitude: l.longitude.toNumber(),
        }));
    }
    async create(dto) {
        if (dto.name) {
            const exists = await this.prisma.corridors.findFirst({
                where: {
                    name: dto.name,
                },
            });
            if (exists) {
                throw new common_1.BadRequestException('Este nombre de corredor ya existe');
            }
        }
        const points = await this.getRoutePoints(dto.origin_location_id, dto.destination_location_id, dto.stops ?? []);
        const routeStats = await (0, routing_utils_1.calculateRoute)(points);
        return this.prisma.corridors.create({
            data: {
                name: dto.name,
                is_template: dto.is_template ?? true,
                origin_location_id: dto.origin_location_id,
                destination_location_id: dto.destination_location_id,
                total_distance_km: routeStats?.distanceKm ?? null,
                estimated_minutes: routeStats?.estimatedMinutes ?? null,
                corridorStops: {
                    create: dto.stops,
                },
            },
            include: {
                corridorStops: true,
            },
        });
    }
    findAll() {
        return this.prisma.corridors.findMany({
            include: {
                origin_location: true,
                destination_location: true,
                corridorStops: {
                    orderBy: { stop_order: 'asc' },
                    include: { location: true },
                },
            },
        });
    }
    findTemplates() {
        return this.prisma.corridors.findMany({
            where: {
                is_template: true,
            },
        });
    }
    async getCorridorRoute(id) {
        const corridor = await this.prisma.corridors.findUnique({
            where: { id },
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
        });
        if (!corridor)
            return null;
        const route = [
            {
                type: 'origin',
                ...corridor.origin_location,
            },
            ...corridor.corridorStops.map((stop) => ({
                type: 'stop',
                ...stop.location,
            })),
            {
                type: 'destination',
                ...corridor.destination_location,
            },
        ];
        return {
            id: corridor.id,
            name: corridor.name,
            total_distance_km: corridor.total_distance_km,
            estimated_minutes: corridor.estimated_minutes,
            route,
        };
    }
    findOne(id) {
        return this.prisma.corridors.findUnique({
            where: { id },
            include: {
                origin_location: true,
                destination_location: true,
                corridorStops: {
                    orderBy: { stop_order: 'asc' },
                    include: { location: true },
                },
            },
        });
    }
    async update(id, dto) {
        const { stops, origin_location_id, destination_location_id, ...rest } = dto;
        const current = await this.prisma.corridors.findUnique({
            where: { id },
            select: {
                origin_location_id: true,
                destination_location_id: true,
                corridorStops: {
                    select: { location_id: true, stop_order: true },
                },
            },
        });
        const finalOrigin = origin_location_id ?? current?.origin_location_id;
        const finalDestination = destination_location_id ?? current?.destination_location_id;
        const finalStops = stops ?? current?.corridorStops ?? [];
        let routeStats = null;
        if (finalOrigin && finalDestination) {
            const points = await this.getRoutePoints(finalOrigin, finalDestination, finalStops);
            routeStats = await (0, routing_utils_1.calculateRoute)(points);
        }
        return this.prisma.corridors.update({
            where: { id },
            data: {
                ...(0, object_utils_1.omitUndefined)(rest),
                ...(origin_location_id && {
                    origin_location: { connect: { id: origin_location_id } },
                }),
                ...(destination_location_id && {
                    destination_location: { connect: { id: destination_location_id } },
                }),
                ...(stops && {
                    corridorStops: {
                        deleteMany: {},
                        create: stops.map((s) => ({
                            location_id: s.location_id,
                            stop_order: s.stop_order,
                            ...(s.stop_type !== undefined && { stop_type: s.stop_type }),
                        })),
                    },
                }),
                total_distance_km: routeStats
                    ? new prismaNamespace_1.Decimal(routeStats.distanceKm)
                    : undefined,
                estimated_minutes: routeStats?.estimatedMinutes ?? undefined,
            },
            include: {
                origin_location: true,
                destination_location: true,
                corridorStops: {
                    orderBy: { stop_order: 'asc' },
                    include: { location: true },
                },
            },
        });
    }
    remove(id) {
        return this.prisma.corridors.delete({
            where: { id },
        });
    }
};
exports.CorridorsService = CorridorsService;
exports.CorridorsService = CorridorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CorridorsService);
//# sourceMappingURL=corridors.service.js.map