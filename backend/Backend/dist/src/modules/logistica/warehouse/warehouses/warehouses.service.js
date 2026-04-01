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
exports.WarehousesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const object_utils_1 = require("../../../../common/utils/object.utils");
let WarehousesService = class WarehousesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.warehouses.create({
            data: {
                name: data.name,
                code: data.code,
                location_id: data.locationId,
                active: data.active ?? true,
            },
        });
    }
    async findAll() {
        return this.prisma.warehouses.findMany({
            include: {
                locations: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
    async findOne(id) {
        const warehouse = await this.prisma.warehouses.findUnique({
            where: { id },
            include: {
                locations: true,
                warehouse_stock: true,
            },
        });
        if (!warehouse) {
            throw new common_1.NotFoundException('Warehouse not found');
        }
        return warehouse;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.warehouses.update({
            where: { id },
            data: (0, object_utils_1.omitUndefined)({
                name: data.name,
                code: data.code,
                location_id: data.locationId,
                active: data.active,
            }),
            include: {
                locations: true,
            },
        });
    }
    async desactivate(id) {
        await this.findOne(id);
        return this.prisma.warehouses.update({
            where: { id },
            data: {
                active: false,
            },
        });
    }
    async active(id) {
        await this.findOne(id);
        return this.prisma.warehouses.update({
            where: { id },
            data: {
                active: true,
            },
        });
    }
};
exports.WarehousesService = WarehousesService;
exports.WarehousesService = WarehousesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WarehousesService);
//# sourceMappingURL=warehouses.service.js.map