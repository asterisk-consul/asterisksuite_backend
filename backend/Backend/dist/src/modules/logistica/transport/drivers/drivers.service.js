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
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const object_utils_1 = require("../../../../common/utils/object.utils");
let DriversService = class DriversService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.drivers.findMany({
            include: {
                driverDocuments: {
                    include: {
                        transport_document_types: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
    async findOne(id) {
        const driver = await this.prisma.drivers.findUnique({
            where: { id },
            include: {
                driverDocuments: {
                    include: {
                        transport_document_types: true,
                    },
                },
            },
        });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        return driver;
    }
    async create(dto) {
        const { documents, ...driverData } = dto;
        return this.prisma.drivers.create({
            data: {
                ...driverData,
                driverDocuments: documents
                    ? {
                        create: documents.map((doc) => ({
                            document_type_id: doc.document_type_id,
                            expiration_date: doc.expiration_date
                                ? new Date(doc.expiration_date)
                                : null,
                        })),
                    }
                    : undefined,
            },
            include: {
                driverDocuments: {
                    include: {
                        transport_document_types: true,
                    },
                },
            },
        });
    }
    async update(id, dto) {
        const { documents, ...driverData } = dto;
        const safeDriverData = (0, object_utils_1.omitUndefined)(driverData);
        await this.findOne(id);
        return this.prisma.$transaction(async (tx) => {
            await tx.drivers.update({
                where: { id },
                data: safeDriverData,
            });
            if (documents) {
                for (const doc of documents) {
                    await tx.documents_driver.upsert({
                        where: {
                            driver_id_document_type_id: {
                                driver_id: id,
                                document_type_id: doc.document_type_id,
                            },
                        },
                        update: {
                            expiration_date: doc.expiration_date
                                ? new Date(doc.expiration_date)
                                : null,
                        },
                        create: {
                            driver_id: id,
                            document_type_id: doc.document_type_id,
                            expiration_date: doc.expiration_date
                                ? new Date(doc.expiration_date)
                                : null,
                        },
                    });
                }
            }
            return tx.drivers.findUnique({
                where: { id },
                include: {
                    driverDocuments: {
                        include: { transport_document_types: true },
                    },
                },
            });
        });
    }
    async activate(id) {
        await this.findOne(id);
        await this.prisma.drivers.update({
            where: { id },
            data: {
                active: true,
            },
        });
        return { deleted: true };
    }
    async desactivate(id) {
        await this.findOne(id);
        return this.prisma.drivers.update({
            where: { id },
            data: {
                active: false,
            },
        });
    }
};
exports.DriversService = DriversService;
exports.DriversService = DriversService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DriversService);
//# sourceMappingURL=drivers.service.js.map