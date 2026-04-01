"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticuloPrecioSchema = void 0;
const zod_1 = require("zod");
exports.ArticuloPrecioSchema = zod_1.z.object({
    codigo: zod_1.z.string(),
    precio: zod_1.z.coerce.number(),
    proveedor: zod_1.z.string(),
});
//# sourceMappingURL=articulo-precio.schema.js.map