"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsDomainModule = void 0;
const common_1 = require("@nestjs/common");
const delivery_notes_module_1 = require("./delivery-notes/delivery-notes.module");
const document_type_module_1 = require("./transport-document-type/document-type.module");
const dispatch_orders_module_1 = require("./dispatch-orders/dispatch-orders.module");
let DocumentsDomainModule = class DocumentsDomainModule {
};
exports.DocumentsDomainModule = DocumentsDomainModule;
exports.DocumentsDomainModule = DocumentsDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [delivery_notes_module_1.DeliveryNotesModule, document_type_module_1.DocumentTypesModule, dispatch_orders_module_1.DispatchOrdersModule],
        exports: [delivery_notes_module_1.DeliveryNotesModule, document_type_module_1.DocumentTypesModule, dispatch_orders_module_1.DispatchOrdersModule],
    })
], DocumentsDomainModule);
//# sourceMappingURL=documents.module.js.map