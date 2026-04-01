"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportDomainModule = void 0;
const common_1 = require("@nestjs/common");
const trips_module_1 = require("./trips/trips.module");
const transfers_module_1 = require("./transfers/transfers.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const drivers_module_1 = require("./drivers/drivers.module");
const vehicle_combinations_module_1 = require("./vehicles_combinations/vehicle-combinations.module");
const transfer_rates_module_1 = require("./transfer_rate/transfer-rates.module");
const corridors_module_1 = require("./corridors/corridors.module");
let TransportDomainModule = class TransportDomainModule {
};
exports.TransportDomainModule = TransportDomainModule;
exports.TransportDomainModule = TransportDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [
            trips_module_1.TripsModule,
            transfers_module_1.TransfersModule,
            vehicles_module_1.VehiclesModule,
            drivers_module_1.DriversModule,
            vehicle_combinations_module_1.VehicleCombinationsModule,
            transfer_rates_module_1.TransferRatesModule,
            corridors_module_1.CorridorsModule,
        ],
        exports: [
            trips_module_1.TripsModule,
            transfers_module_1.TransfersModule,
            vehicles_module_1.VehiclesModule,
            drivers_module_1.DriversModule,
            vehicle_combinations_module_1.VehicleCombinationsModule,
            transfer_rates_module_1.TransferRatesModule,
            corridors_module_1.CorridorsModule,
        ],
    })
], TransportDomainModule);
//# sourceMappingURL=transport.module.js.map