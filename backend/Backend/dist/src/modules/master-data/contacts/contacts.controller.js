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
exports.PartyContactsController = void 0;
const common_1 = require("@nestjs/common");
const contacts_service_1 = require("./contacts.service");
const create_party_contact_dto_1 = require("./dto/create-party-contact.dto");
const update_party_contact_dto_1 = require("./dto/update-party-contact.dto");
let PartyContactsController = class PartyContactsController {
    partyContactsService;
    constructor(partyContactsService) {
        this.partyContactsService = partyContactsService;
    }
    create(dto) {
        return this.partyContactsService.create(dto);
    }
    findAll(party_id) {
        return this.partyContactsService.findAll(party_id);
    }
    findOne(id) {
        return this.partyContactsService.findOne(id);
    }
    update(id, dto) {
        return this.partyContactsService.update(id, dto);
    }
    remove(id) {
        return this.partyContactsService.remove(id);
    }
};
exports.PartyContactsController = PartyContactsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_party_contact_dto_1.CreatePartyContactDto]),
    __metadata("design:returntype", void 0)
], PartyContactsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('party_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartyContactsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartyContactsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_party_contact_dto_1.UpdatePartyContactDto]),
    __metadata("design:returntype", void 0)
], PartyContactsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartyContactsController.prototype, "remove", null);
exports.PartyContactsController = PartyContactsController = __decorate([
    (0, common_1.Controller)('party-contacts'),
    __metadata("design:paramtypes", [contacts_service_1.PartyContactsService])
], PartyContactsController);
//# sourceMappingURL=contacts.controller.js.map