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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const object_utils_1 = require("../../../common/utils/object.utils");
let LocationsService = class LocationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.locations.create({
            data: {
                address: dto.address,
                city: dto.city,
                province: dto.province,
                country: dto.country,
                postal_code: dto.postalCode,
                latitude: dto.latitude,
                longitude: dto.longitude,
            },
        });
    }
    async findAll() {
        return this.prisma.locations.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });
    }
    async findOne(id) {
        const location = await this.prisma.locations.findUnique({
            where: { id },
            include: {
                warehouses: true,
            },
        });
        if (!location) {
            throw new common_1.NotFoundException('Location not found');
        }
        return location;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.locations.update({
            where: { id },
            data: (0, object_utils_1.omitUndefined)({
                address: dto.address || undefined,
                city: dto.city,
                province: dto.province,
                country: dto.country,
                postal_code: dto.postalCode,
                latitude: dto.latitude || undefined,
                longitude: dto.longitude || undefined,
            }),
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.locations.delete({
            where: { id },
        });
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map