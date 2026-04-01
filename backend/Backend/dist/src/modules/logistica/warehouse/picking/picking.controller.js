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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickingController = void 0;
const common_1 = require("@nestjs/common");
const picking_service_1 = require("./picking.service");
const create_picking_order_dto_1 = require("./dto/create-picking-order.dto");
const execute_picking_order_dto_1 = require("./dto/execute-picking-order.dto");
const transfer_pallet_dto_1 = require("./dto/transfer-pallet.dto");
const jwt_auth_guard_1 = require("../../../../auth/jwt/jwt-auth.guard");
let PickingController = class PickingController {
    pickingService;
    constructor(pickingService) {
        this.pickingService = pickingService;
    }
    async createOrder(dto) {
        return this.pickingService.createPickingOrder(dto);
    }
    async execute(pickingOrderId, dto) {
        return this.pickingService.executePicking({
            ...dto,
            picking_order_id: pickingOrderId,
        });
    }
    async transfer(dto) {
        return this.pickingService.transfer(dto);
    }
};
exports.PickingController = PickingController;
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_picking_order_dto_1.CreatePickingOrderDto]),
    __metadata("design:returntype", Promise)
], PickingController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('orders/:id/execute'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, execute_picking_order_dto_1.ExecutePickingDto]),
    __metadata("design:returntype", Promise)
], PickingController.prototype, "execute", null);
__decorate([
    (0, common_1.Patch)('pallets/transfer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transfer_pallet_dto_1.TransferPalletDto]),
    __metadata("design:returntype", Promise)
], PickingController.prototype, "transfer", null);
exports.PickingController = PickingController = __decorate([
    (0, common_1.Controller)('logistica/picking'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [picking_service_1.PickingService])
], PickingController);
//# sourceMappingURL=picking.controller.js.map