"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessPartiesModule = void 0;
const common_1 = require("@nestjs/common");
const business_parties_service_1 = require("./business-parties.service");
const business_parties_controller_1 = require("./business-parties.controller");
const prisma_module_1 = require("../../../prisma/prisma.module");
let BusinessPartiesModule = class BusinessPartiesModule {
};
exports.BusinessPartiesModule = BusinessPartiesModule;
exports.BusinessPartiesModule = BusinessPartiesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [business_parties_controller_1.BusinessPartiesController],
        providers: [business_parties_service_1.BusinessPartiesService],
    })
], BusinessPartiesModule);
//# sourceMappingURL=business-parties.module.js.map