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
exports.VehicleCombinationsController = void 0;
const common_1 = require("@nestjs/common");
const vehicle_combinations_service_1 = require("./vehicle-combinations.service");
const create_vehicle_combination_dto_1 = require("./dto/create-vehicle-combination.dto");
const update_vehicle_combination_dto_1 = require("./dto/update-vehicle-combination.dto");
const jwt_auth_guard_1 = require("../../../../auth/jwt/jwt-auth.guard");
const current_user_decorator_1 = require("../../../../auth/decorators/current-user.decorator");
let VehicleCombinationsController = class VehicleCombinationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll() {
        return this.service.findAll();
    }
    findAvailable(date) {
        return this.service.findAvailable(date);
    }
    findActive() {
        return this.service.findActive();
    }
    findByVehicle(vehicle_id) {
        return this.service.findByVehicle(vehicle_id);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    finish(id) {
        return this.service.finish(id);
    }
    activate(id) {
        return this.service.activate(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id, user) {
        return this.service.remove(id, user.id);
    }
};
exports.VehicleCombinationsController = VehicleCombinationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vehicle_combination_dto_1.CreateVehicleCombinationDto]),
    __metadata("design:returntype", void 0)
], VehicleCombinationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehicleCombinationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleCombinationsController.prototype, "findAvailable", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehicleCombinationsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('vehicle/:vehicle_id'),
    __param(0, (0, common_1.Param)('vehicle_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleCombinationsController.prototype, "findByVehicle", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleCombinationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/finish'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleCombinationsController.prototype, "finish", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleCombinationsController.prototype, "activate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vehicle_combination_dto_1.UpdateVehicleCombinationDto]),
    __metadata("design:returntype", void 0)
], VehicleCombinationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VehicleCombinationsController.prototype, "remove", null);
exports.VehicleCombinationsController = VehicleCombinationsController = __decorate([
    (0, common_1.Controller)('vehicle-combinations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [vehicle_combinations_service_1.VehicleCombinationsService])
], VehicleCombinationsController);
//# sourceMappingURL=vehicle-combinations.controller.js.map