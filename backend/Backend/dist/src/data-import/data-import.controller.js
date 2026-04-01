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
exports.DataImportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const data_import_service_1 = require("./data-import.service");
const excel_source_1 = require("./sources/excel.source");
let DataImportController = class DataImportController {
    service;
    constructor(service) {
        this.service = service;
    }
    uploadArticuloPrecio(file) {
        return this.service.importArticuloPrecio(file);
    }
    uploadCompras(file) {
        return this.service.importCompras(file);
    }
    async debug(file) {
        const source = new excel_source_1.ExcelSource(file);
        const raw = await source.load();
        return raw[0];
    }
};
exports.DataImportController = DataImportController;
__decorate([
    (0, common_1.Post)('articulo-precio'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DataImportController.prototype, "uploadArticuloPrecio", null);
__decorate([
    (0, common_1.Post)('compras'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DataImportController.prototype, "uploadCompras", null);
__decorate([
    (0, common_1.Post)('compras-debug'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataImportController.prototype, "debug", null);
exports.DataImportController = DataImportController = __decorate([
    (0, common_1.Controller)('data-import'),
    __metadata("design:paramtypes", [data_import_service_1.DataImportService])
], DataImportController);
//# sourceMappingURL=data-import.controller.js.map