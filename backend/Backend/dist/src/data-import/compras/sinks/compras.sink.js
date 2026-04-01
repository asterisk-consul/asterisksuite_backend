"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturaSink = void 0;
class FacturaSink {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async send(data) {
        for (const doc of data) {
            const { ref, document_taxes, document_items, ...docData } = doc;
            const inserted = await this.prisma.documents.create({
                data: {
                    ...docData,
                    number: Number(docData.number),
                },
            });
            if (document_taxes.length > 0) {
                await this.prisma.document_taxes.createMany({
                    data: document_taxes.map((t) => ({
                        ...t,
                        document_id: inserted.id,
                    })),
                });
            }
            if (document_items.length > 0) {
                await this.prisma.document_items.createMany({
                    data: document_items.map((i) => ({
                        ...i,
                        document_id: inserted.id,
                    })),
                });
            }
        }
    }
}
exports.FacturaSink = FacturaSink;
//# sourceMappingURL=compras.sink.js.map