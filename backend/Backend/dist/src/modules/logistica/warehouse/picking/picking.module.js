"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickingModule = void 0;
const common_1 = require("@nestjs/common");
const picking_service_1 = require("./picking.service");
const picking_controller_1 = require("./picking.controller");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let PickingModule = class PickingModule {
};
exports.PickingModule = PickingModule;
exports.PickingModule = PickingModule = __decorate([
    (0, common_1.Module)({
        controllers: [picking_controller_1.PickingController],
        providers: [picking_service_1.PickingService, prisma_service_1.PrismaService],
        exports: [picking_service_1.PickingService],
    })
], PickingModule);
//# sourceMappingURL=picking.module.js.map