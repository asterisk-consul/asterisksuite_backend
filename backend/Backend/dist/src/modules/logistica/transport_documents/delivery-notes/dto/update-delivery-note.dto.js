"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDeliveryNoteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_delivery_note_dto_1 = require("./create-delivery-note.dto");
class UpdateDeliveryNoteDto extends (0, mapped_types_1.PartialType)(create_delivery_note_dto_1.CreateDeliveryNoteDto) {
}
exports.UpdateDeliveryNoteDto = UpdateDeliveryNoteDto;
//# sourceMappingURL=update-delivery-note.dto.js.map