"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSequencesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let DocumentSequencesService = class DocumentSequencesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNextNumber(tx, documentType, pointOfSale) {
        const sequence = await tx.document_sequences.findUnique({
            where: {
                document_type_point_of_sale: {
                    document_type: documentType,
                    point_of_sale: pointOfSale,
                },
            },
        });
        if (!sequence || !sequence.active) {
            throw new common_1.BadRequestException('Talonario no configurado');
        }
        const nextNumber = sequence.current_number + 1;
        await tx.document_sequences.update({
            where: { id: sequence.id },
            data: { current_number: nextNumber },
        });
        const formatted = nextNumber.toString().padStart(8, '0');
        return `${sequence.prefix ?? ''}${sequence.point_of_sale}-${formatted}`;
    }
};
exports.DocumentSequencesService = DocumentSequencesService;
exports.DocumentSequencesService = DocumentSequencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentSequencesService);
//# sourceMappingURL=document-sequences.service.js.map