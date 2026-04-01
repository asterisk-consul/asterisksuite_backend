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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../../../generated/prisma/client");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let StockService = class StockService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStockByWarehouse(warehouseId) {
        return this.prisma.warehouse_stock.findMany({
            where: { warehouse_id: warehouseId },
            include: { products: true },
            orderBy: { updated_at: 'desc' },
        });
    }
    async getMovements(warehouseId) {
        return this.prisma.warehouse_stock_movements.findMany({
            where: { warehouse_id: warehouseId },
            include: {
                products: true,
                users: true,
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async createMovement(dto) {
        return this.prisma.$transaction(async (tx) => {
            const qty = new client_1.Prisma.Decimal(dto.quantity);
            const signedQty = dto.direction === 'IN' ? qty : qty.neg();
            const movement = await tx.warehouse_stock_movements.create({
                data: {
                    ...dto,
                    quantity: qty,
                },
            });
            const stock = await tx.warehouse_stock.findUnique({
                where: {
                    warehouse_id_product_id: {
                        warehouse_id: dto.warehouse_id,
                        product_id: dto.product_id,
                    },
                },
            });
            if (!stock) {
                if (dto.direction === 'OUT') {
                    throw new common_1.BadRequestException('No hay stock para descontar');
                }
                await tx.warehouse_stock.create({
                    data: {
                        warehouse_id: dto.warehouse_id,
                        product_id: dto.product_id,
                        quantity: qty,
                    },
                });
            }
            else {
                const newQty = stock.quantity.plus(signedQty);
                if (newQty.isNegative()) {
                    throw new common_1.BadRequestException('Stock negativo no permitido');
                }
                await tx.warehouse_stock.update({
                    where: { id: stock.id },
                    data: {
                        quantity: newQty,
                        updated_at: new Date(),
                    },
                });
            }
            return movement;
        });
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StockService);
//# sourceMappingURL=stock.service.js.map