"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotosModule = void 0;
const common_1 = require("@nestjs/common");
const photos_service_1 = require("./photos.service");
const photos_controller_1 = require("./photos.controller");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const files_module_1 = require("../files/files.module");
let PhotosModule = class PhotosModule {
};
exports.PhotosModule = PhotosModule;
exports.PhotosModule = PhotosModule = __decorate([
    (0, common_1.Module)({
        imports: [files_module_1.FilesModule],
        controllers: [photos_controller_1.PhotosController],
        providers: [photos_service_1.PhotosService, prisma_service_1.PrismaService],
    })
], PhotosModule);
//# sourceMappingURL=photos.module.js.map