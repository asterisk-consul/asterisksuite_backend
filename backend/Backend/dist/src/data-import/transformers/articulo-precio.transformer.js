"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticuloPrecioTransformer = void 0;
class ArticuloPrecioTransformer {
    async transform(input) {
        return input.map((item) => ({
            codigo: item.codigo,
            precio: item.precio,
            proveedor: item.proveedor,
        }));
    }
}
exports.ArticuloPrecioTransformer = ArticuloPrecioTransformer;
//# sourceMappingURL=articulo-precio.transformer.js.map