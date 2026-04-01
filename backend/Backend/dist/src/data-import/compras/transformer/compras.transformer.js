"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprasTransformer = void 0;
function extractNumber(comprobante) {
    const parts = comprobante.split('-');
    return parseInt(parts[parts.length - 1], 10);
}
class ComprasTransformer {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async transform(documents) {
        const resultado = [];
        const parties = await this.prisma.business_parties.findMany();
        const products = await this.prisma.products.findMany();
        const taxes = await this.prisma.taxes.findMany();
        const documentTypes = await this.prisma.document_types.findMany();
        const partyMap = new Map(parties.map((p) => [p.name, p]));
        const productMap = new Map(products.map((p) => [p.name, p]));
        const taxMap = new Map(taxes.map((t) => [t.code, t]));
        const documentTypeMap = new Map(documentTypes.map((dt) => [dt.description, dt]));
        const documentType = documentTypeMap.get('Factura de Compra');
        if (!documentType) {
            throw new Error('Tipo de documento "Factura de Compra" no encontrado en la BD');
        }
        for (const factura of documents) {
            const party = partyMap.get(factura.Nombre);
            if (!party)
                throw new Error(`Party no encontrado: ${factura.Nombre}`);
            const product = productMap.get(factura.Concepto);
            if (!product)
                throw new Error(`Producto no encontrado: ${factura.Concepto}`);
            const impuestosRaw = [
                { code: 'IMP_IVA1', amount: factura.Imp_IVA1 },
                { code: 'IMP_IVA2', amount: factura.Imp_IVA2 },
                { code: 'IMP_IVA3', amount: factura.Imp_IVA3 },
                { code: 'COM_PERC_IIBB', amount: factura.COM_perc_IIBB },
                { code: 'COM_PERC_MUN', amount: factura.COM_perc_Mun },
                { code: 'COM_PERC_IVA', amount: factura.COM_perc_IVA },
                { code: 'IMP_EXENTO', amount: factura.Imp_Excento },
            ];
            const impuestosValidos = impuestosRaw
                .filter((i) => i.amount > 0)
                .map((i) => {
                const tax = taxMap.get(i.code);
                if (!tax)
                    throw new Error(`Impuesto no encontrado: ${i.code}`);
                return { tax, amount: i.amount };
            });
            const totalTaxes = impuestosValidos.reduce((acc, i) => acc + i.amount, 0);
            resultado.push({
                ref: factura.Comprobante,
                document_type_id: documentType.id,
                party_id: party.id,
                number: extractNumber(factura.Comprobante),
                date: factura.Fecha,
                status: 1,
                subtotal: factura.Imp_gravado,
                total_taxes: totalTaxes,
                total: factura.Imp_total,
                document_taxes: impuestosValidos.map(({ tax, amount }) => ({
                    tax_id: tax.id,
                    tax_rate: tax.rate.toNumber(),
                    taxable_base: factura.Imp_gravado,
                    tax_amount: amount,
                })),
                document_items: [
                    {
                        product_id: product.id,
                        quantity: 1,
                        price: factura.Imp_gravado,
                    },
                ],
            });
        }
        return resultado;
    }
}
exports.ComprasTransformer = ComprasTransformer;
//# sourceMappingURL=compras.transformer.js.map