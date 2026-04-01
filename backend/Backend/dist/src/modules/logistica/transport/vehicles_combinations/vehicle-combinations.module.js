"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleCombinationsModule = void 0;
const common_1 = require("@nestjs/common");
const vehicle_combinations_service_1 = require("./vehicle-combinations.service");
const vehicle_combinations_controller_1 = require("./vehicle-combinations.controller");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let VehicleCombinationsModule = class VehicleCombinationsModule {
};
exports.VehicleCombinationsModule = VehicleCombinationsModule;
exports.VehicleCombinationsModule = VehicleCombinationsModule = __decorate([
    (0, common_1.Module)({
        controllers: [vehicle_combinations_controller_1.VehicleCombinationsController],
        providers: [vehicle_combinations_service_1.VehicleCombinationsService, prisma_service_1.PrismaService],
        exports: [vehicle_combinations_service_1.VehicleCombinationsService],
    })
], VehicleCombinationsModule);
//# sourceMappingURL=vehicle-combinations.module.js.map