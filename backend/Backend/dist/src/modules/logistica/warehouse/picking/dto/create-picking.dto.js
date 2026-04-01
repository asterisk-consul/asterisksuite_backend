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
exports.CreatePickingDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PickingItemDto {
    product_id;
    quantity;
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PickingItemDto.prototype, "product_id", void 0);
__decorate([
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", String)
], PickingItemDto.prototype, "quantity", void 0);
class CreatePickingDto {
    warehouse_id;
    created_by;
    items;
}
exports.CreatePickingDto = CreatePickingDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePickingDto.prototype, "warehouse_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePickingDto.prototype, "created_by", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PickingItemDto),
    __metadata("design:type", Array)
], CreatePickingDto.prototype, "items", void 0);
//# sourceMappingURL=create-picking.dto.js.map