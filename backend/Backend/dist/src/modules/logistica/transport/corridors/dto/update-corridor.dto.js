"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCorridorDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_corridor_dto_1 = require("./create-corridor.dto");
class UpdateCorridorDto extends (0, mapped_types_1.PartialType)(create_corridor_dto_1.CreateCorridorDto) {
}
exports.UpdateCorridorDto = UpdateCorridorDto;
//# sourceMappingURL=update-corridor.dto.js.map