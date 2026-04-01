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
exports.VehicleCombinationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const object_utils_1 = require("../../../../common/utils/object.utils");
let VehicleCombinationsService = class VehicleCombinationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateActiveConflicts(dto, idToIgnore) {
        const conditions = [
            { tractor_id: dto.tractor_id },
        ];
        if (dto.trailer_id) {
            conditions.push({ trailer_id: dto.trailer_id });
        }
        if (dto.driver_id) {
            conditions.push({ driver_id: dto.driver_id });
        }
        const conflict = await this.prisma.vehicle_combinations.findFirst({
            where: {
                valid_until: null,
                deleted_at: null,
                OR: conditions,
                id: idToIgnore ? { not: idToIgnore } : undefined,
            },
        });
        if (conflict) {
            throw new common_1.BadRequestException('El tractor, trailer o driver ya están en otra combinación activa');
        }
    }
    async validateUnitNumber(dto, idToIgnore) {
        if (!dto.unit_number)
            return;
        const existing = await this.prisma.vehicle_combinations.findFirst({
            where: {
                unit_number: dto.unit_number,
                valid_until: null,
                deleted_at: null,
                id: idToIgnore ? { not: idToIgnore } : undefined,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException(`El número de unidad ${dto.unit_number} ya existe en otra combinación activa`);
        }
    }
    async create(dto, user_id) {
        await this.validateActiveConflicts(dto);
        await this.validateUnitNumber(dto);
        return this.prisma.vehicle_combinations.create({
            data: {
                tractor_id: dto.tractor_id,
                trailer_id: dto.trailer_id,
                driver_id: dto.driver_id,
                unit_number: dto.unit_number,
                valid_from: new Date(dto.valid_from),
                valid_until: dto.valid_until ? new Date(dto.valid_until) : null,
                created_by: user_id,
            },
            include: {
                tractor: true,
                trailer: true,
                drivers: true,
            },
        });
    }
    async findAll() {
        return this.prisma.vehicle_combinations.findMany({
            include: {
                tractor: true,
                trailer: true,
                drivers: true,
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findActive() {
        return this.prisma.vehicle_combinations.findMany({
            where: {
                valid_until: null,
            },
            include: {
                tractor: true,
                trailer: true,
                drivers: true,
            },
        });
    }
    async findAvailable(date) {
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const busyTrips = await this.prisma.trips.findMany({
            where: {
                status: { notIn: ['CANCELLED'] },
                vehicle_combination_id: { not: null },
                AND: [
                    { departure_time: { lte: endOfDay } },
                    {
                        OR: [{ arrival_time: { gte: startOfDay } }, { arrival_time: null }],
                    },
                ],
            },
            select: { vehicle_combination_id: true },
        });
        const busyIds = busyTrips
            .map((t) => t.vehicle_combination_id)
            .filter(Boolean);
        return this.prisma.vehicle_combinations.findMany({
            where: {
                deleted_at: null,
                OR: [
                    { valid_until: null },
                    { valid_until: { gte: startOfDay } },
                ],
                ...(busyIds.length > 0 && { id: { notIn: busyIds } }),
            },
            include: { tractor: true, trailer: true, drivers: true },
            orderBy: { created_at: 'desc' },
        });
    }
    async findOne(id) {
        const combination = await this.prisma.vehicle_combinations.findUnique({
            where: { id },
            include: {
                tractor: true,
                trailer: true,
                drivers: true,
                trips: true,
            },
        });
        if (!combination) {
            throw new common_1.NotFoundException('Vehicle combination not found');
        }
        return combination;
    }
    async finish(id) {
        const combination = await this.findOne(id);
        if (combination.valid_until) {
            throw new common_1.BadRequestException('La combinación ya está finalizada');
        }
        return this.prisma.vehicle_combinations.update({
            where: { id },
            data: { valid_until: new Date() },
            include: { tractor: true, trailer: true, drivers: true },
        });
    }
    async activate(id) {
        const combination = await this.findOne(id);
        if (!combination.valid_until) {
            throw new common_1.BadRequestException('La combinación ya está activa');
        }
        return this.prisma.vehicle_combinations.update({
            where: { id },
            data: { valid_until: null },
            include: { tractor: true, trailer: true, drivers: true },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        await this.validateActiveConflicts(dto, id);
        await this.validateUnitNumber(dto, id);
        return this.prisma.vehicle_combinations.update({
            where: { id },
            data: (0, object_utils_1.omitUndefined)({
                unit_number: dto.unit_number,
                valid_from: dto.valid_from ? new Date(dto.valid_from) : undefined,
                valid_until: dto.valid_until ? new Date(dto.valid_until) : null,
                tractor_id: dto.tractor_id,
                trailer_id: dto.trailer_id,
                driver_id: dto.driver_id,
            }),
            include: {
                tractor: true,
                trailer: true,
                drivers: true,
            },
        });
    }
    async findByVehicle(vehicle_id) {
        return this.prisma.vehicle_combinations.findMany({
            where: {
                OR: [{ tractor_id: vehicle_id }, { trailer_id: vehicle_id }],
            },
            include: {
                tractor: true,
                trailer: true,
                drivers: true,
            },
            orderBy: { valid_from: 'desc' },
        });
    }
    async remove(id, user_id) {
        await this.findOne(id);
        return this.prisma.vehicle_combinations.update({
            where: { id },
            data: {
                deleted_at: new Date(),
                deleted_by: user_id,
            },
        });
    }
};
exports.VehicleCombinationsService = VehicleCombinationsService;
exports.VehicleCombinationsService = VehicleCombinationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehicleCombinationsService);
//# sourceMappingURL=vehicle-combinations.service.js.map