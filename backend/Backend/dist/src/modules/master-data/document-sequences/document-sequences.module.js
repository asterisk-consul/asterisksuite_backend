"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSequencesModule = void 0;
const common_1 = require("@nestjs/common");
const document_sequences_service_1 = require("./document-sequences.service");
const prisma_service_1 = require("../../../prisma/prisma.service");
let DocumentSequencesModule = class DocumentSequencesModule {
};
exports.DocumentSequencesModule = DocumentSequencesModule;
exports.DocumentSequencesModule = DocumentSequencesModule = __decorate([
    (0, common_1.Module)({
        providers: [document_sequences_service_1.DocumentSequencesService, prisma_service_1.PrismaService],
        exports: [document_sequences_service_1.DocumentSequencesService],
    })
], DocumentSequencesModule);
//# sourceMappingURL=document-sequences.module.js.map