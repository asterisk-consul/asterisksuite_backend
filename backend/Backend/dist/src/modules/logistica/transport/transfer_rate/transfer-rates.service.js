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
exports.TransferRatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let TransferRatesService = class TransferRatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.transfer_rates.create({
            data,
        });
    }
    findAll() {
        return this.prisma.transfer_rates.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const rate = await this.prisma.transfer_rates.findUnique({
            where: { id },
        });
        if (!rate)
            throw new common_1.NotFoundException('Rate not found');
        return rate;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.transfer_rates.update({
            where: { id },
            data,
        });
    }
    async deactivate(id) {
        return this.prisma.transfer_rates.update({
            where: { id },
            data: { active: false },
        });
    }
    async active(id) {
        return this.prisma.transfer_rates.update({
            where: { id },
            data: { active: true },
        });
    }
};
exports.TransferRatesService = TransferRatesService;
exports.TransferRatesService = TransferRatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransferRatesService);
//# sourceMappingURL=transfer-rates.service.js.map