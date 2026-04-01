"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseDomainModule = void 0;
const common_1 = require("@nestjs/common");
const warehouses_module_1 = require("./warehouses/warehouses.module");
const stock_module_1 = require("./stock/stock.module");
const pallets_module_1 = require("./pallets/pallets.module");
const picking_module_1 = require("./picking/picking.module");
let WarehouseDomainModule = class WarehouseDomainModule {
};
exports.WarehouseDomainModule = WarehouseDomainModule;
exports.WarehouseDomainModule = WarehouseDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [warehouses_module_1.WarehousesModule, stock_module_1.StockModule, pallets_module_1.PalletsModule, picking_module_1.PickingModule],
        exports: [warehouses_module_1.WarehousesModule, stock_module_1.StockModule, pallets_module_1.PalletsModule, picking_module_1.PickingModule],
    })
], WarehouseDomainModule);
//# sourceMappingURL=warehouse.module.js.map