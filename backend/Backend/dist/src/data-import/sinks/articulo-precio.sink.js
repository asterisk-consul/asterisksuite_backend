"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticuloPrecioSink = void 0;
class ArticuloPrecioSink {
    async send(data) {
        try {
            console.log('Guardar en BD:', data);
        }
        catch (error) {
            console.error('Error al guardar en BD:', error);
            throw error;
        }
    }
}
exports.ArticuloPrecioSink = ArticuloPrecioSink;
//# sourceMappingURL=articulo-precio.sink.js.map