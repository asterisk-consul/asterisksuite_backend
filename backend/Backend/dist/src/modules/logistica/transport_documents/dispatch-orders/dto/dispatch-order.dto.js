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
exports.UpdateDispatchOrderDto = exports.CreateDispatchOrderDto = exports.DispatchRateDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const mapped_types_1 = require("@nestjs/mapped-types");
const enums_1 = require("../../../../../generated/prisma/enums");
class DispatchRateDto {
    rate_id;
    value;
}
exports.DispatchRateDto = DispatchRateDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DispatchRateDto.prototype, "rate_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DispatchRateDto.prototype, "value", void 0);
class CreateDispatchOrderDto {
    order_number;
    status;
    requires_stock;
    customer_id;
    origin_location_id;
    destination_location_id;
    corridor_id;
    planned_date;
    rates;
}
exports.CreateDispatchOrderDto = CreateDispatchOrderDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDispatchOrderDto.prototype, "order_number", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.DispatchStatus),
    __metadata("design:type", String)
], CreateDispatchOrderDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDispatchOrderDto.prototype, "requires_stock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDispatchOrderDto.prototype, "customer_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDispatchOrderDto.prototype, "origin_location_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDispatchOrderDto.prototype, "destination_location_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDispatchOrderDto.prototype, "corridor_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDispatchOrderDto.prototype, "planned_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DispatchRateDto),
    __metadata("design:type", Array)
], CreateDispatchOrderDto.prototype, "rates", void 0);
class UpdateDispatchOrderDto extends (0, mapped_types_1.PartialType)(CreateDispatchOrderDto) {
    rates;
}
exports.UpdateDispatchOrderDto = UpdateDispatchOrderDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DispatchRateDto),
    __metadata("design:type", Array)
], UpdateDispatchOrderDto.prototype, "rates", void 0);
//# sourceMappingURL=dispatch-order.dto.js.map