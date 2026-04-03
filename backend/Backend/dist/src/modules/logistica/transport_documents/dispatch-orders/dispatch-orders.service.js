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
exports.DispatchOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const buildPrisma_1 = require("../../../../common/utils/buildPrisma");
const enums_1 = require("../../../../generated/prisma/enums");
let DispatchOrdersService = class DispatchOrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        return this.prisma.dispatch_orders.create({
            data: {
                order_number: dto.order_number,
                status: dto.status ?? enums_1.DispatchStatus.PENDING,
                requires_stock: dto.requires_stock ?? false,
                customer_id: dto.customer_id,
                origin_location_id: dto.origin_location_id,
                destination_location_id: dto.destination_location_id,
                corridor_id: dto.corridor_id,
                planned_date: dto.planned_date ? new Date(dto.planned_date) : undefined,
                created_by: userId,
                dispatch_rates: dto.rates?.length
                    ? {
                        create: dto.rates.map((r) => ({
                            rate_id: r.rate_id,
                            value: r.value,
                        })),
                    }
                    : undefined,
            },
            include: {
                customers: true,
                origin_location: true,
                destination_location: true,
                corridors: true,
                dispatch_rates: {
                    include: {
                        transfer_rates: true,
                    },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.dispatch_orders.findMany({
            include: {
                customers: true,
                origin_location: true,
                destination_location: true,
                tripStopOrders: {
                    include: {
                        trip_stop: {
                            include: {
                                trip: true,
                            },
                        },
                    },
                },
                dispatch_rates: true,
                corridors: true,
            },
        });
    }
    async findOne(id) {
        const order = await this.prisma.dispatch_orders.findUnique({
            where: { id },
            include: {
                customers: true,
                origin_location: true,
                destination_location: true,
                tripStopOrders: {
                    include: {
                        trip_stop: {
                            include: {
                                trip: true,
                            },
                        },
                    },
                },
                dispatch_rates: true,
                corridors: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Dispatch order not found');
        return order;
    }
    async update(id, dto) {
        const { rates, ...rest } = dto;
        const data = (0, buildPrisma_1.buildPrismaUpdate)(rest);
        if (rates) {
            data.dispatch_rates = {
                deleteMany: {},
                create: rates.map((r) => ({
                    rate_id: r.rate_id,
                    value: r.value,
                })),
            };
        }
        return this.prisma.dispatch_orders.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.dispatch_orders.delete({
            where: { id },
        });
    }
};
exports.DispatchOrdersService = DispatchOrdersService;
exports.DispatchOrdersService = DispatchOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DispatchOrdersService);
//# sourceMappingURL=dispatch-orders.service.js.map