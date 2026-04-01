"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modulesmodule = void 0;
const common_1 = require("@nestjs/common");
const core_module_1 = require("./core/core.module");
const master_data_module_1 = require("./master-data/master-data.module");
const logistica_module_1 = require("./logistica/logistica.module");
const documents_module_1 = require("./logistica/transport_documents/documents.module");
let modulesmodule = class modulesmodule {
};
exports.modulesmodule = modulesmodule;
exports.modulesmodule = modulesmodule = __decorate([
    (0, common_1.Module)({
        imports: [
            core_module_1.CoreModule,
            master_data_module_1.MasterDataModule,
            logistica_module_1.LogisticaModule,
            documents_module_1.DocumentsDomainModule,
        ],
    })
], modulesmodule);
//# sourceMappingURL=modules.module.js.map