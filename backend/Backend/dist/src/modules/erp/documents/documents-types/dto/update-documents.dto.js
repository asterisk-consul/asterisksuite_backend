"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentsTypesDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_documentsTypes_dto_1 = require("./create-documentsTypes.dto");
class UpdateDocumentsTypesDto extends (0, mapped_types_1.PartialType)(create_documentsTypes_dto_1.CreateDocumentsTypesDto) {
}
exports.UpdateDocumentsTypesDto = UpdateDocumentsTypesDto;
//# sourceMappingURL=update-documents.dto.js.map