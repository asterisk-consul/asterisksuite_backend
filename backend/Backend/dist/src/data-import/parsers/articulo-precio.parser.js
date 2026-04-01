"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticuloPrecioParser = void 0;
const articulo_precio_schema_1 = require("../schemas/articulo-precio.schema");
const zod_1 = require("zod");
class ArticuloPrecioParser {
    parse(raw) {
        return raw.map((row) => {
            const r = row;
            const normalized = Object.keys(r).reduce((acc, key) => {
                acc[key.toUpperCase()] = r[key];
                return acc;
            }, {});
            return articulo_precio_schema_1.ArticuloPrecioSchema.parse({
                codigo: normalized.CODIGO,
                precio: normalized.PRECIO,
                proveedor: normalized.PROVEEDOR,
            });
        });
    }
    parseWithErrors(raw) {
        const success = [];
        const errors = [];
        raw.forEach((row, index) => {
            try {
                const r = row;
                const normalized = Object.keys(r).reduce((acc, key) => {
                    acc[key.toUpperCase()] = r[key];
                    return acc;
                }, {});
                const validated = articulo_precio_schema_1.ArticuloPrecioSchema.parse({
                    codigo: normalized.CODIGO,
                    precio: normalized.PRECIO,
                    proveedor: normalized.PROVEEDOR,
                });
                success.push(validated);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    errors.push({
                        row: index + 2,
                        data: row,
                        errors: error.issues.map((e) => `${e.path.join('.')}: ${e.message}`),
                    });
                }
                else {
                    errors.push({
                        row: index + 2,
                        data: row,
                        errors: ['Error desconocido al parsear'],
                    });
                }
            }
        });
        return { success, errors };
    }
}
exports.ArticuloPrecioParser = ArticuloPrecioParser;
//# sourceMappingURL=articulo-precio.parser.js.map