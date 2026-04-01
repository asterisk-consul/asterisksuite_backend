"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facturaCompraSchema = void 0;
const zod_1 = require("zod");
exports.facturaCompraSchema = zod_1.z.object({
    Comprobante: zod_1.z.string(),
    Nombre: zod_1.z.string(),
    Motivo_det: zod_1.z.string().optional(),
    Fecha: zod_1.z.coerce.date(),
    Imp_total: zod_1.z.coerce.number(),
    Imp_gravado: zod_1.z.coerce.number(),
    Concepto: zod_1.z.string(),
    Imp_IVA1: zod_1.z.coerce.number(),
    Imp_IVA2: zod_1.z.coerce.number(),
    Imp_IVA3: zod_1.z.coerce.number(),
    COM_perc_IIBB: zod_1.z.coerce.number(),
    COM_perc_Mun: zod_1.z.coerce.number(),
    COM_perc_IVA: zod_1.z.coerce.number(),
    Imp_Excento: zod_1.z.coerce.number(),
});
//# sourceMappingURL=compras.schema.js.map