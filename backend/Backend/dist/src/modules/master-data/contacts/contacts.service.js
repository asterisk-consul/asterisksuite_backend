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
exports.PartyContactsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let PartyContactsService = class PartyContactsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.party_contacts.create({
            data: dto,
        });
    }
    async findAll(party_id) {
        return this.prisma.party_contacts.findMany({
            where: party_id ? { party_id } : undefined,
            orderBy: { created_at: 'desc' },
            include: {
                business_parties: true,
            },
        });
    }
    async findOne(id) {
        const contact = await this.prisma.party_contacts.findUnique({
            where: { id },
            include: {
                business_parties: true,
            },
        });
        if (!contact) {
            throw new common_1.NotFoundException(`PartyContact with id "${id}" not found`);
        }
        return contact;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.party_contacts.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.party_contacts.delete({
            where: { id },
        });
    }
};
exports.PartyContactsService = PartyContactsService;
exports.PartyContactsService = PartyContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PartyContactsService);
//# sourceMappingURL=contacts.service.js.map