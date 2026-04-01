"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVehicleCombinationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_vehicle_combination_dto_1 = require("./create-vehicle-combination.dto");
class UpdateVehicleCombinationDto extends (0, mapped_types_1.PartialType)(create_vehicle_combination_dto_1.CreateVehicleCombinationDto) {
}
exports.UpdateVehicleCombinationDto = UpdateVehicleCombinationDto;
//# sourceMappingURL=update-vehicle-combination.dto.js.map