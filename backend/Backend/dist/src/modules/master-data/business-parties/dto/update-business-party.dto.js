"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBusinessPartyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_business_party_dto_1 = require("./create-business-party.dto");
class UpdateBusinessPartyDto extends (0, mapped_types_1.PartialType)(create_business_party_dto_1.CreateBusinessPartyDto) {
}
exports.UpdateBusinessPartyDto = UpdateBusinessPartyDto;
//# sourceMappingURL=update-business-party.dto.js.map