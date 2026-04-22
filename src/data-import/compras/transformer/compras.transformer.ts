import { Transformer } from '../../core/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';
import { FacturaCompraRaw } from '../schemas/compras.schema';

function extractNumber(comprobante: string): number {
  const parts = comprobante.split('-');
  return parseInt(parts[parts.length - 1], 10);
}

export type ComprasTransformado = {
  ref: string;
  document_type_id: string;
  party_id: string;
  number: number;
  date: Date;
  status: number;
  subtotal: number;
  exempt_amount: number;
  total_taxes: number;
  total: number;
  document_taxes: {
    tax_id: string;
    tax_rate: number;
    taxable_base: number;
    tax_amount: number;
  }[];
  document_items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
};

export class ComprasTransformer implements Transformer<
  FacturaCompraRaw,
  ComprasTransformado
> {
  constructor(private prisma: PrismaService) {}

  async transform(
    documents: FacturaCompraRaw[],
  ): Promise<ComprasTransformado[]> {
    const resultado: ComprasTransformado[] = [];

    const [parties, products, taxes, documentTypes] = await Promise.all([
      this.prisma.business_parties.findMany(),
      this.prisma.products.findMany(),
      this.prisma.taxes.findMany(),
      this.prisma.document_types.findMany(),
    ]);

    const partyMap = new Map(parties.map((p) => [p.name, p]));
    const productMap = new Map(products.map((p) => [p.name, p]));
    const taxMap = new Map(taxes.map((t) => [t.code, t]));
    const documentTypeMap = new Map(documentTypes.map((dt) => [dt.code, dt]));

    const documentType = documentTypeMap.get('COM');
    if (!documentType) {
      throw new Error('Tipo de documento "COM" no encontrado en la BD');
    }

    // Para manejar refs duplicadas (ej: A-00099-31012026 con múltiples filas)
    const refCounts = new Map<string, number>();

    let duplicateCounter = -1;

    for (const factura of documents) {
      const party = partyMap.get(factura.Nombre);
      if (!party) {
        console.warn(`⚠️  Party no encontrado: "${factura.Nombre}" — se omite`);
        continue;
      }

      const product = productMap.get(factura.Concepto);
      if (!product) {
        console.warn(
          `⚠️  Producto no encontrado: "${factura.Concepto}" — se omite`,
        );
        continue;
      }

      // Ref único para comprobantes repetidos
      const baseRef = factura.Comprobante;
      const count = refCounts.get(baseRef) ?? 0;
      refCounts.set(baseRef, count + 1);
      const ref = count === 0 ? baseRef : `${baseRef}-${count}`;

      // Number único para comprobantes repetidos
      // ✅ POR esto:
      const baseNumber = extractNumber(factura.Comprobante);
      // ← mover FUERA del for, antes del loop
      const number = count === 0 ? baseNumber : duplicateCounter--;

      // Solo impuestos reales — sin IMP_EXENTO
      const impuestosRaw = [
        { code: 'IMP_IVA1', amount: factura.Imp_IVA1 },
        { code: 'IMP_IVA2', amount: factura.Imp_IVA2 },
        { code: 'IMP_IVA3', amount: factura.Imp_IVA3 },
        { code: 'COM_PERC_IIBB', amount: factura.COM_perc_IIBB },
        { code: 'COM_PERC_MUN', amount: factura.COM_perc_Mun },
        { code: 'COM_PERC_IVA', amount: factura.COM_perc_IVA },
      ];

      const impuestosValidos = impuestosRaw
        .filter((i) => i.amount > 0)
        .map((i) => {
          const tax = taxMap.get(i.code);
          if (!tax) {
            console.warn(`⚠️  Impuesto no encontrado: ${i.code} — se omite`);
            return null;
          }
          return { tax, amount: i.amount };
        })
        .filter((i): i is NonNullable<typeof i> => i !== null);

      const totalTaxes = impuestosValidos.reduce((acc, i) => acc + i.amount, 0);

      resultado.push({
        ref,
        document_type_id: documentType.id,
        party_id: party.id,
        number,
        date: factura.fecha_carga,
        status: 1,
        subtotal: factura.Imp_gravado,
        exempt_amount: factura.Imp_Excento,
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
