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
exports.BusinessPartiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let BusinessPartiesService = class BusinessPartiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { locations, contacts, ...partyData } = data;
        return this.prisma.business_parties.create({
            data: {
                ...partyData,
                party_locations: locations
                    ? {
                        create: locations.map((l) => ({
                            location_id: l.location_id,
                            label: l.label,
                        })),
                    }
                    : undefined,
                party_contacts: contacts
                    ? {
                        create: contacts.map((c) => ({
                            first_name: c.first_name,
                            last_name: c.last_name,
                            role: c.role,
                            phone: c.phone,
                            email: c.email,
                        })),
                    }
                    : undefined,
            },
            include: this.fullInclude(),
        });
    }
    async findAll() {
        return this.prisma.business_parties.findMany({
            orderBy: { created_at: 'desc' },
            include: this.fullInclude(),
        });
    }
    async findOne(id) {
        const party = await this.prisma.business_parties.findUnique({
            where: { id },
            include: this.fullInclude(),
        });
        if (!party)
            throw new common_1.NotFoundException('Business party not found');
        return party;
    }
    async update(id, data) {
        await this.findOne(id);
        const { locations, contacts, ...partyData } = data;
        return this.prisma.business_parties.update({
            where: { id },
            data: {
                ...partyData,
                party_locations: locations
                    ? {
                        deleteMany: {},
                        create: locations.map((l) => ({
                            location_id: l.location_id,
                            label: l.label,
                        })),
                    }
                    : undefined,
                party_contacts: contacts
                    ? {
                        deleteMany: {},
                        create: contacts.map((c) => ({
                            first_name: c.first_name,
                            last_name: c.last_name,
                            role: c.role,
                            phone: c.phone,
                            email: c.email,
                        })),
                    }
                    : undefined,
            },
            include: this.fullInclude(),
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.business_parties.update({
            where: { id },
            data: { active: false },
        });
    }
    fullInclude() {
        return {
            party_locations: {
                include: {
                    locations: true,
                },
            },
            party_contacts: true,
        };
    }
};
exports.BusinessPartiesService = BusinessPartiesService;
exports.BusinessPartiesService = BusinessPartiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessPartiesService);
//# sourceMappingURL=business-parties.service.js.map