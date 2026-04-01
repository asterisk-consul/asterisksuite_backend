"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePalletDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_pallet_dto_1 = require("./create-pallet.dto");
class UpdatePalletDto extends (0, mapped_types_1.PartialType)(create_pallet_dto_1.CreatePalletDto) {
}
exports.UpdatePalletDto = UpdatePalletDto;
//# sourceMappingURL=update-pallet.dto.js.map