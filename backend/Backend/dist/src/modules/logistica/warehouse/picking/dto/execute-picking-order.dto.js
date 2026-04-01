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
exports.ExecutePickingDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PickingSourceDto {
    picking_item_id;
    pallet_id;
    quantity;
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PickingSourceDto.prototype, "picking_item_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PickingSourceDto.prototype, "pallet_id", void 0);
__decorate([
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", String)
], PickingSourceDto.prototype, "quantity", void 0);
class ExecutePickingDto {
    picking_order_id;
    result_pallet_id;
    user_id;
    sources;
}
exports.ExecutePickingDto = ExecutePickingDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ExecutePickingDto.prototype, "picking_order_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ExecutePickingDto.prototype, "result_pallet_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ExecutePickingDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PickingSourceDto),
    __metadata("design:type", Array)
], ExecutePickingDto.prototype, "sources", void 0);
//# sourceMappingURL=execute-picking-order.dto.js.map