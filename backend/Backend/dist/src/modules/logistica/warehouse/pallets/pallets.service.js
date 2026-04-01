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
exports.PalletsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let PalletsService = class PalletsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.pallets.create({
            data: dto,
        });
    }
    async findAll() {
        return this.prisma.pallets.findMany({
            where: {
                deleted_at: null,
            },
            include: {
                pallet_items: {
                    include: { products: true },
                },
                warehouses: true,
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findOne(id) {
        const pallet = await this.prisma.pallets.findUnique({
            where: { id },
            include: {
                pallet_items: {
                    include: { products: true },
                },
                warehouses: true,
            },
        });
        if (!pallet || pallet.deleted_at) {
            throw new common_1.NotFoundException('Pallet no encontrado');
        }
        return pallet;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.pallets.update({
            where: { id },
            data: dto,
        });
    }
    async softDelete(id) {
        await this.findOne(id);
        return this.prisma.pallets.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
    }
};
exports.PalletsService = PalletsService;
exports.PalletsService = PalletsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PalletsService);
//# sourceMappingURL=pallets.service.js.map