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
exports.DataImportService = void 0;
const common_1 = require("@nestjs/common");
const pipeline_1 = require("./core/pipeline");
const excel_source_1 = require("./sources/excel.source");
const articulo_precio_parser_1 = require("./parsers/articulo-precio.parser");
const articulo_precio_transformer_1 = require("./transformers/articulo-precio.transformer");
const articulo_precio_sink_1 = require("./sinks/articulo-precio.sink");
const compras_parser_1 = require("./compras/paresers/compras.parser");
const compras_transformer_1 = require("./compras/transformer/compras.transformer");
const compras_sink_1 = require("./compras/sinks/compras.sink");
const prisma_service_1 = require("../prisma/prisma.service");
let DataImportService = class DataImportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async importArticuloPrecio(file) {
        const pipeline = new pipeline_1.ImportPipeline(new excel_source_1.ExcelSource(file), new articulo_precio_parser_1.ArticuloPrecioParser(), new articulo_precio_transformer_1.ArticuloPrecioTransformer(), new articulo_precio_sink_1.ArticuloPrecioSink());
        return pipeline.run();
    }
    async importCompras(file) {
        const pipeline = new pipeline_1.ImportPipeline(new excel_source_1.ExcelSource(file), new compras_parser_1.FacturaCompraParser(), new compras_transformer_1.ComprasTransformer(this.prisma), new compras_sink_1.FacturaSink(this.prisma));
        return pipeline.run();
    }
};
exports.DataImportService = DataImportService;
exports.DataImportService = DataImportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DataImportService);
//# sourceMappingURL=data-import.service.js.map