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
exports.DeliveryNotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const document_sequences_service_1 = require("../../../master-data/document-sequences/document-sequences.service");
let DeliveryNotesService = class DeliveryNotesService {
    prisma;
    sequences;
    constructor(prisma, sequences) {
        this.prisma = prisma;
        this.sequences = sequences;
    }
    async create(dto, userId) {
        return this.prisma.$transaction(async (tx) => {
            const number = await this.sequences.getNextNumber(tx, 'DELIVERY_NOTE', dto.pointOfSale);
            const deliveryNote = await tx.delivery_notes.create({
                data: {
                    type: dto.type,
                    number,
                    status: 'DRAFT',
                    party_id: dto.partyId,
                    trip_id: dto.tripId,
                    created_by: userId,
                },
            });
            if (dto.pickingOrderId) {
                await tx.picking_orders.update({
                    where: { id: dto.pickingOrderId },
                    data: {
                        delivery_note_id: deliveryNote.id,
                        status: 'ASSIGNED',
                    },
                });
            }
            return deliveryNote;
        });
    }
    async findAll(query) {
        return this.prisma.delivery_notes.findMany({
            where: {
                deleted_at: null,
                status: query.status,
                type: query.type,
                number: query.number
                    ? { contains: query.number, mode: 'insensitive' }
                    : undefined,
            },
            include: {
                business_parties: true,
                trips: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
    async findOne(id) {
        const note = await this.prisma.delivery_notes.findFirst({
            where: { id, deleted_at: null },
            include: {
                business_parties: true,
                trips: true,
                picking_orders: true,
                trip_cargo: true,
            },
        });
        if (!note)
            throw new common_1.NotFoundException('Delivery note not found');
        return note;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.delivery_notes.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.delivery_notes.update({
            where: { id },
            data: {
                deleted_at: new Date(),
                status: 'CANCELLED',
            },
        });
    }
    async confirm(id, userId) {
        return this.prisma.$transaction(async (tx) => {
            const note = await tx.delivery_notes.findUnique({
                where: { id },
                include: {
                    picking_orders: {
                        include: {
                            picking_items: true,
                        },
                    },
                },
            });
            if (!note)
                throw new common_1.BadRequestException('Remito no encontrado');
            if (note.status !== 'DRAFT')
                throw new common_1.BadRequestException('Solo se puede confirmar en estado DRAFT');
            if (note.picking_orders.length > 0) {
                const picking = note.picking_orders[0];
                for (const item of picking.picking_items) {
                    await tx.warehouse_stock_movements.create({
                        data: {
                            warehouse_id: picking.warehouse_id,
                            product_id: item.product_id,
                            movement_type: 'DELIVERY_NOTE',
                            direction: 'OUT',
                            quantity: item.quantity_required,
                            reference_type: 'DELIVERY_NOTE',
                            reference_id: note.id,
                            created_by: userId,
                        },
                    });
                    await tx.warehouse_stock.update({
                        where: {
                            warehouse_id_product_id: {
                                warehouse_id: picking.warehouse_id,
                                product_id: item.product_id,
                            },
                        },
                        data: {
                            quantity: {
                                decrement: item.quantity_required,
                            },
                        },
                    });
                }
            }
            return tx.delivery_notes.update({
                where: { id },
                data: { status: 'CONFIRMED' },
            });
        });
    }
};
exports.DeliveryNotesService = DeliveryNotesService;
exports.DeliveryNotesService = DeliveryNotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        document_sequences_service_1.DocumentSequencesService])
], DeliveryNotesService);
//# sourceMappingURL=delivery-notes.service.js.map