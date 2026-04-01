"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePartyContactDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_party_contact_dto_1 = require("./create-party-contact.dto");
class UpdatePartyContactDto extends (0, mapped_types_1.PartialType)(create_party_contact_dto_1.CreatePartyContactDto) {
}
exports.UpdatePartyContactDto = UpdatePartyContactDto;
//# sourceMappingURL=update-party-contact.dto.js.map