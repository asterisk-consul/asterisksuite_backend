"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogisticaModule = void 0;
const common_1 = require("@nestjs/common");
const warehouse_module_1 = require("./warehouse/warehouse.module");
const transport_module_1 = require("./transport/transport.module");
const media_module_1 = require("./media/media.module");
let LogisticaModule = class LogisticaModule {
};
exports.LogisticaModule = LogisticaModule;
exports.LogisticaModule = LogisticaModule = __decorate([
    (0, common_1.Module)({
        imports: [warehouse_module_1.WarehouseDomainModule, transport_module_1.TransportDomainModule, media_module_1.MediaModule],
    })
], LogisticaModule);
//# sourceMappingURL=logistica.module.js.map