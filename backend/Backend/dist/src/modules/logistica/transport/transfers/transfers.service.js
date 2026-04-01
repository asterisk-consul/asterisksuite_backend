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
exports.TransfersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let TransfersService = class TransfersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto, userId) {
        return this.prisma.cargo_transfers.create({
            data: {
                from_trip_id: dto.fromTripId,
                to_trip_id: dto.toTripId,
                location_id: dto.locationId,
                notes: dto.notes,
                performed_by: userId,
            },
        });
    }
    addItem(transferId, palletId, deliveryNoteId, quantity) {
        return this.prisma.cargo_transfer_items.create({
            data: {
                transfer_id: transferId,
                pallet_id: palletId,
                delivery_note_id: deliveryNoteId,
                quantity,
            },
        });
    }
};
exports.TransfersService = TransfersService;
exports.TransfersService = TransfersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransfersService);
//# sourceMappingURL=transfers.service.js.map