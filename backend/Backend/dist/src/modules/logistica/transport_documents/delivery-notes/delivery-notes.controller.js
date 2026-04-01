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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryNotesController = void 0;
const common_1 = require("@nestjs/common");
const delivery_notes_service_1 = require("./delivery-notes.service");
const create_delivery_note_dto_1 = require("./dto/create-delivery-note.dto");
const update_delivery_note_dto_1 = require("./dto/update-delivery-note.dto");
const query_delivery_note_dto_1 = require("./dto/query-delivery-note.dto");
const jwt_auth_guard_1 = require("../../../../auth/jwt/jwt-auth.guard");
const current_user_decorator_1 = require("../../../../auth/decorators/current-user.decorator");
let DeliveryNotesController = class DeliveryNotesController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, user) {
        return this.service.create(dto, user.id);
    }
    confirm(id) {
        const userId = 'HARDCODE_USER_ID';
        return this.service.confirm(id, userId);
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.DeliveryNotesController = DeliveryNotesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_note_dto_1.CreateDeliveryNoteDto, Object]),
    __metadata("design:returntype", void 0)
], DeliveryNotesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliveryNotesController.prototype, "confirm", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_delivery_note_dto_1.QueryDeliveryNoteDto]),
    __metadata("design:returntype", void 0)
], DeliveryNotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliveryNotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_delivery_note_dto_1.UpdateDeliveryNoteDto]),
    __metadata("design:returntype", void 0)
], DeliveryNotesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliveryNotesController.prototype, "remove", null);
exports.DeliveryNotesController = DeliveryNotesController = __decorate([
    (0, common_1.Controller)('delivery-notes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [delivery_notes_service_1.DeliveryNotesService])
], DeliveryNotesController);
//# sourceMappingURL=delivery-notes.controller.js.map