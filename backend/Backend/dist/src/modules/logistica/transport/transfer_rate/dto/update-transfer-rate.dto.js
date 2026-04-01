"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTransferRateDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_transfer_rate_dto_1 = require("./create-transfer-rate.dto");
class UpdateTransferRateDto extends (0, mapped_types_1.PartialType)(create_transfer_rate_dto_1.CreateTransferRateDto) {
}
exports.UpdateTransferRateDto = UpdateTransferRateDto;
//# sourceMappingURL=update-transfer-rate.dto.js.map