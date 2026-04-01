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
exports.PickingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const client_1 = require("../../../../generated/prisma/client");
let PickingService = class PickingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.$transaction(async (tx) => {
            for (const item of dto.items) {
                const stock = await tx.warehouse_stock.findUnique({
                    where: {
                        warehouse_id_product_id: {
                            warehouse_id: dto.warehouse_id,
                            product_id: item.product_id,
                        },
                    },
                });
                if (!stock)
                    throw new common_1.BadRequestException('Producto sin stock');
                const qty = new client_1.Prisma.Decimal(item.quantity);
                if (stock.quantity.lessThan(qty))
                    throw new common_1.BadRequestException('Stock insuficiente');
                await tx.warehouse_stock.update({
                    where: { id: stock.id },
                    data: {
                        quantity: stock.quantity.minus(qty),
                    },
                });
                await tx.warehouse_stock_movements.create({
                    data: {
                        warehouse_id: dto.warehouse_id,
                        product_id: item.product_id,
                        movement_type: 'PICKING',
                        direction: 'OUT',
                        quantity: qty,
                        reference_type: 'PICKING',
                        created_by: dto.created_by,
                    },
                });
            }
            return { success: true };
        });
    }
    async transfer(dto) {
        return this.prisma.$transaction(async (tx) => {
            const pallet = await tx.pallets.findUnique({
                where: { id: dto.pallet_id },
                include: { pallet_items: true },
            });
            if (!pallet)
                throw new common_1.BadRequestException('Pallet no encontrado');
            if (pallet.warehouse_id !== dto.from_warehouse_id)
                throw new common_1.BadRequestException('El pallet no está en ese depósito');
            for (const item of pallet.pallet_items) {
                const qty = new client_1.Prisma.Decimal(item.quantity);
                await tx.warehouse_stock_movements.create({
                    data: {
                        warehouse_id: dto.from_warehouse_id,
                        product_id: item.product_id,
                        movement_type: 'TRANSFER',
                        direction: 'OUT',
                        quantity: qty,
                        reference_type: 'PALLET_TRANSFER',
                        reference_id: pallet.id,
                        created_by: dto.user_id,
                    },
                });
                await tx.warehouse_stock_movements.create({
                    data: {
                        warehouse_id: dto.to_warehouse_id,
                        product_id: item.product_id,
                        movement_type: 'TRANSFER',
                        direction: 'IN',
                        quantity: qty,
                        reference_type: 'PALLET_TRANSFER',
                        reference_id: pallet.id,
                        created_by: dto.user_id,
                    },
                });
            }
            await tx.pallets.update({
                where: { id: dto.pallet_id },
                data: { warehouse_id: dto.to_warehouse_id },
            });
            return { transferred: true };
        });
    }
    async executePicking(dto) {
        return this.prisma.$transaction(async (tx) => {
            const pickingOrder = await tx.picking_orders.findUnique({
                where: { id: dto.picking_order_id },
                include: { picking_items: true },
            });
            if (!pickingOrder)
                throw new common_1.BadRequestException('Picking no encontrado');
            if (pickingOrder.status !== 'CREATED')
                throw new common_1.BadRequestException('Picking ya ejecutado o inválido');
            for (const source of dto.sources) {
                const qty = new client_1.Prisma.Decimal(source.quantity);
                const pickingItem = await tx.picking_items.findUnique({
                    where: { id: source.picking_item_id },
                });
                if (!pickingItem)
                    throw new common_1.BadRequestException('Picking item inválido');
                const pickedSoFar = pickingItem.quantity_picked ?? new client_1.Prisma.Decimal(0);
                const remaining = pickingItem.quantity_required.minus(pickedSoFar);
                if (remaining.lessThan(qty))
                    throw new common_1.BadRequestException('Cantidad supera lo requerido en el picking item');
                await tx.picking_sources.create({
                    data: {
                        picking_item_id: source.picking_item_id,
                        pallet_id: source.pallet_id,
                        quantity: qty,
                    },
                });
                await tx.picking_items.update({
                    where: { id: source.picking_item_id },
                    data: {
                        quantity_picked: pickedSoFar.plus(qty),
                    },
                });
                const stock = await tx.warehouse_stock.findUnique({
                    where: {
                        warehouse_id_product_id: {
                            warehouse_id: pickingOrder.warehouse_id,
                            product_id: pickingItem.product_id,
                        },
                    },
                });
                if (!stock)
                    throw new common_1.BadRequestException('Stock inconsistente');
                if (stock.reserved_quantity.lessThan(qty))
                    throw new common_1.BadRequestException('Reserva inconsistente para el producto');
                await tx.warehouse_stock.update({
                    where: { id: stock.id },
                    data: {
                        quantity: stock.quantity.minus(qty),
                        reserved_quantity: stock.reserved_quantity.minus(qty),
                    },
                });
                await tx.warehouse_stock_movements.create({
                    data: {
                        warehouse_id: pickingOrder.warehouse_id,
                        product_id: pickingItem.product_id,
                        movement_type: 'PICKING',
                        direction: 'OUT',
                        quantity: qty,
                        reference_type: 'PICKING_ORDER',
                        reference_id: pickingOrder.id,
                        created_by: dto.user_id,
                    },
                });
            }
            const resultPallet = await tx.pallets.findUnique({
                where: { id: dto.result_pallet_id },
            });
            if (!resultPallet)
                throw new common_1.BadRequestException('Pallet resultado inválido');
            await tx.picking_results.create({
                data: {
                    picking_order_id: dto.picking_order_id,
                    pallet_id: dto.result_pallet_id,
                },
            });
            await tx.picking_orders.update({
                where: { id: dto.picking_order_id },
                data: { status: 'COMPLETED' },
            });
            return { completed: true };
        });
    }
    async createPickingOrder(dto) {
        return this.prisma.$transaction(async (tx) => {
            const pickingOrder = await tx.picking_orders.create({
                data: {
                    warehouse_id: dto.warehouse_id,
                    status: 'CREATED',
                    created_by: dto.created_by,
                    dispatch_order_id: dto.dispatch_order_id,
                },
            });
            for (const item of dto.items) {
                const qty = new client_1.Prisma.Decimal(item.quantity);
                const stock = await tx.warehouse_stock.findUnique({
                    where: {
                        warehouse_id_product_id: {
                            warehouse_id: dto.warehouse_id,
                            product_id: item.product_id,
                        },
                    },
                });
                if (!stock)
                    throw new common_1.BadRequestException('Producto sin stock');
                const available = stock.quantity.minus(stock.reserved_quantity);
                if (available.lessThan(qty))
                    throw new common_1.BadRequestException('Stock disponible insuficiente');
                await tx.picking_items.create({
                    data: {
                        picking_order_id: pickingOrder.id,
                        product_id: item.product_id,
                        quantity_required: qty,
                        quantity_picked: new client_1.Prisma.Decimal(0),
                    },
                });
                await tx.warehouse_stock.update({
                    where: { id: stock.id },
                    data: {
                        reserved_quantity: stock.reserved_quantity.plus(qty),
                    },
                });
            }
            return pickingOrder;
        });
    }
};
exports.PickingService = PickingService;
exports.PickingService = PickingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PickingService);
//# sourceMappingURL=picking.service.js.map