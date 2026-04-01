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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const object_utils_1 = require("../../../../common/utils/object.utils");
let VehiclesService = class VehiclesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.vehicles.findUnique({
                where: { plate: dto.plate },
            });
            if (existing) {
                throw new common_1.BadRequestException('La patente ya existe');
            }
            const vehicle = await tx.vehicles.create({
                data: {
                    type: dto.type,
                    plate: dto.plate,
                    brand: dto.brand,
                    model: dto.model,
                    year: dto.year,
                    max_weight: dto.maxWeight,
                    max_volume: dto.maxVolume,
                    refrigeration: dto.refrigeration ?? false,
                },
            });
            if (dto.documents?.length) {
                for (const doc of dto.documents) {
                    const docType = await tx.transport_document_types.findUnique({
                        where: { id: doc.documentTypeId },
                    });
                    if (!docType || docType.entity !== 'VEHICLE' || !docType.active) {
                        throw new common_1.BadRequestException('Tipo de documento inválido para VEHICLE');
                    }
                    await tx.documents_vehicle.create({
                        data: {
                            vehicle_id: vehicle.id,
                            document_type_id: doc.documentTypeId,
                            expiration_date: doc.expirationDate
                                ? new Date(doc.expirationDate)
                                : undefined,
                        },
                    });
                }
            }
            return tx.vehicles.findUnique({
                where: { id: vehicle.id },
                include: {
                    vehicleDocuments: {
                        include: {
                            transport_document_types: true,
                        },
                    },
                },
            });
        });
    }
    async findAll() {
        return this.prisma.vehicles.findMany({
            include: {
                vehicleDocuments: {
                    include: {
                        transport_document_types: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findOne(id) {
        const vehicle = await this.prisma.vehicles.findUnique({
            where: { id },
            include: {
                vehicleDocuments: {
                    include: {
                        transport_document_types: true,
                    },
                },
            },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehículo no encontrado');
        }
        return vehicle;
    }
    async update(id, dto) {
        return this.prisma.$transaction(async (tx) => {
            const vehicle = await tx.vehicles.findUnique({
                where: { id },
                include: { vehicleDocuments: true },
            });
            if (!vehicle) {
                throw new common_1.NotFoundException('Vehículo no encontrado');
            }
            await tx.vehicles.update({
                where: { id },
                data: (0, object_utils_1.omitUndefined)({
                    plate: dto.plate,
                    type: dto.type,
                    brand: dto.brand,
                    model: dto.model,
                    year: dto.year,
                    max_weight: dto.maxWeight,
                    max_volume: dto.maxVolume,
                    refrigeration: dto.refrigeration,
                    active: dto.active,
                }),
            });
            if (dto.documents?.length) {
                for (const doc of dto.documents) {
                    if (doc.remove && doc.id) {
                        await tx.documents_vehicle.delete({
                            where: { id: doc.id },
                        });
                        continue;
                    }
                    if (doc.id) {
                        await tx.documents_vehicle.update({
                            where: { id: doc.id },
                            data: {
                                expiration_date: doc.expirationDate
                                    ? new Date(doc.expirationDate)
                                    : null,
                            },
                        });
                        continue;
                    }
                    if (!doc.id && doc.documentTypeId) {
                        const docType = await tx.transport_document_types.findUnique({
                            where: { id: doc.documentTypeId },
                        });
                        if (!docType || docType.entity !== 'VEHICLE' || !docType.active) {
                            throw new common_1.BadRequestException('Tipo de documento inválido para VEHICLE');
                        }
                        await tx.documents_vehicle.create({
                            data: {
                                vehicle_id: id,
                                document_type_id: doc.documentTypeId,
                                expiration_date: doc.expirationDate
                                    ? new Date(doc.expirationDate)
                                    : undefined,
                            },
                        });
                    }
                }
            }
            return tx.vehicles.findUnique({
                where: { id },
                include: {
                    vehicleDocuments: {
                        include: {
                            transport_document_types: true,
                        },
                    },
                },
            });
        });
    }
    async desactivate(id) {
        return this.update(id, { active: false });
    }
    async active(id) {
        return this.update(id, { active: true });
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map