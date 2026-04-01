"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const dispatch_orders_service_1 = require("./dispatch-orders.service");
const dispatch_orders_controller_1 = require("./dispatch-orders.controller");
const prisma_module_1 = require("../../../../prisma/prisma.module");
let DispatchOrdersModule = class DispatchOrdersModule {
};
exports.DispatchOrdersModule = DispatchOrdersModule;
exports.DispatchOrdersModule = DispatchOrdersModule = __decorate([
    (0, common_1.Module)({
        controllers: [dispatch_orders_controller_1.DispatchOrdersController],
        providers: [dispatch_orders_service_1.DispatchOrdersService],
        imports: [prisma_module_1.PrismaModule],
    })
], DispatchOrdersModule);
//# sourceMappingURL=dispatch-orders.module.js.map