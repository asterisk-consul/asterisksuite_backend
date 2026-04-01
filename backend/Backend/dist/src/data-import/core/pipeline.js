"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportPipeline = void 0;
class ImportPipeline {
    source;
    parser;
    transformer;
    sink;
    constructor(source, parser, transformer, sink) {
        this.source = source;
        this.parser = parser;
        this.transformer = transformer;
        this.sink = sink;
    }
    async run() {
        try {
            const rawData = await this.source.load();
            console.log(`✓ Filas extraídas: ${rawData.length}`);
            const parseResult = this.parser.parseWithErrors
                ? this.parser.parseWithErrors(rawData)
                : { success: this.parser.parse(rawData), errors: [] };
            console.log(`✓ Parseadas exitosamente: ${parseResult.success.length}`);
            if (parseResult.errors.length > 0) {
                console.warn(`⚠ Con errores: ${parseResult.errors.length}`);
            }
            const transformed = await this.transformer.transform(parseResult.success);
            if (transformed.length > 0) {
                await this.sink.send(transformed);
                console.log(`✓ Guardados en BD: ${transformed.length}`);
            }
            return {
                success: true,
                total: rawData.length,
                parsed: parseResult.success.length,
                saved: transformed.length,
                failed: parseResult.errors.length,
                errors: parseResult.errors,
            };
        }
        catch (error) {
            console.error('❌ Error en pipeline:', error);
            return {
                success: false,
                total: 0,
                parsed: 0,
                saved: 0,
                failed: 0,
                message: error.message,
                error: error.stack,
            };
        }
    }
}
exports.ImportPipeline = ImportPipeline;
//# sourceMappingURL=pipeline.js.map