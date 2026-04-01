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
exports.DocumentTypesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const object_utils_1 = require("../../../../common/utils/object.utils");
let DocumentTypesService = class DocumentTypesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.transport_document_types.create({
            data: {
                name: dto.name,
                entity: dto.entity,
            },
        });
    }
    async findAll(entity) {
        return this.prisma.transport_document_types.findMany({
            where: {
                active: true,
                ...(entity && { entity }),
            },
            orderBy: { name: 'asc' },
        });
    }
    async update(id, dto) {
        return this.prisma.transport_document_types.update({
            where: { id },
            data: (0, object_utils_1.omitUndefined)({
                name: dto.name,
                entity: dto.entity,
            }),
        });
    }
    async deactivate(id) {
        const exists = await this.prisma.transport_document_types.findUnique({
            where: { id },
        });
        if (!exists) {
            throw new common_1.BadRequestException('Tipo de documento no existe');
        }
        return this.prisma.transport_document_types.update({
            where: { id },
            data: { active: false },
        });
    }
    async active(id) {
        const exists = await this.prisma.transport_document_types.findUnique({
            where: { id },
        });
        if (!exists) {
            throw new common_1.BadRequestException('Tipo de documento no existe');
        }
        return this.prisma.transport_document_types.update({
            where: { id },
            data: { active: true },
        });
    }
};
exports.DocumentTypesService = DocumentTypesService;
exports.DocumentTypesService = DocumentTypesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentTypesService);
//# sourceMappingURL=document-types.service.js.map