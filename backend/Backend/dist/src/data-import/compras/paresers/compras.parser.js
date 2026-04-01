"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturaCompraParser = void 0;
const compras_schema_1 = require("../schemas/compras.schema");
const zod_1 = require("zod");
function normalizeRow(row) {
    return Object.keys(row).reduce((acc, key) => {
        acc[key.toUpperCase().replace(/\s+/g, '_')] = row[key];
        return acc;
    }, {});
}
function mapRow(normalized) {
    return compras_schema_1.facturaCompraSchema.parse({
        Comprobante: normalized.COMPROBANTE,
        Nombre: normalized.NOMBRE,
        Motivo_det: normalized.MOTIVO_DET,
        Concepto: normalized.CONCEPTO,
        Fecha: normalized.FECHA,
        Imp_gravado: normalized.IMP_GRAVADO,
        Imp_total: normalized.IMP_TOTAL,
        Imp_IVA1: normalized.IMP_IVA1,
        Imp_IVA2: normalized.IMP_IVA2,
        Imp_IVA3: normalized.IMP_IVA3,
        Imp_Excento: normalized.IMP_EXENTO,
        COM_perc_IIBB: normalized.COM_PERC_IIBB,
        COM_perc_Mun: normalized.COM_PERC_MUN,
        COM_perc_IVA: normalized.COM_PERC_IVA,
    });
}
class FacturaCompraParser {
    parse(raw) {
        return raw.map((row) => mapRow(normalizeRow(row)));
    }
    parseWithErrors(raw) {
        const success = [];
        const errors = [];
        raw.forEach((row, index) => {
            try {
                success.push(mapRow(normalizeRow(row)));
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
                        errors: ['Error desconocido'],
                    });
                }
            }
        });
        return { success, errors };
    }
}
exports.FacturaCompraParser = FacturaCompraParser;
//# sourceMappingURL=compras.parser.js.map