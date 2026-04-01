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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let CompaniesService = class CompaniesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCompanyDto) {
        return this.prisma.companies.create({
            data: {
                name: createCompanyDto.name,
                tax_id: createCompanyDto.taxId,
                phone: createCompanyDto.phone,
            },
        });
    }
    async findAll() {
        const data = await this.prisma.companies.findMany({
            orderBy: { created_at: 'desc' },
        });
        console.log(data[0].created_at);
        console.log(data[0].created_at instanceof Date);
        return data;
    }
    async findOne(id) {
        const company = await this.prisma.companies.findUnique({
            where: { id },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return company;
    }
    async update(id, updateCompanyDto) {
        await this.findOne(id);
        return this.prisma.companies.update({
            where: { id },
            data: {
                name: updateCompanyDto.name,
                tax_id: updateCompanyDto.taxId,
                phone: updateCompanyDto.phone,
            },
        });
    }
    deactivate() {
        throw new Error('No existe isActive en el modelo companies');
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map