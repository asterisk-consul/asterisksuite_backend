import { Transformer } from '../../core/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';
import { FacturaCompraRaw } from '../schemas/compras.schema';

// ── Helper ────────────────────────────────────────────────────────────────
// Extrae la parte numérica final del comprobante
// "A-00011-00004946" → 4946
function extractNumber(comprobante: string): number {
  const parts = comprobante.split('-');
  return parseInt(parts[parts.length - 1], 10);
}

// Tipo que representa un documento transformado listo para el Loader
export type ComprasTransformado = {
  ref: string;
  document_type_id: string;
  party_id: string;
  number: number;
  date: Date;
  status: number;
  subtotal: number;
  total_taxes: number;
  total: number;
  // Relaciones anidadas que el Loader desanidará antes de insertar
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

  /**
   * Transforma facturas de compra raw (Excel) al formato de la BD.
   * Retorna un array de ComprasTransformado donde cada elemento tiene
   * sus document_taxes y document_items anidados.
   * El Loader se encarga de desanidar e insertar en el orden correcto.
   */
  async transform(
    documents: FacturaCompraRaw[],
  ): Promise<ComprasTransformado[]> {
    const resultado: ComprasTransformado[] = [];

    // ── 1. Carga previa de catálogos desde la BD ───────────────────────────
    const parties = await this.prisma.business_parties.findMany();
    const products = await this.prisma.products.findMany();
    const taxes = await this.prisma.taxes.findMany();
    const documentTypes = await this.prisma.document_types.findMany();

    // ── 2. Maps para búsqueda O(1) ─────────────────────────────────────────
    const partyMap = new Map(parties.map((p) => [p.name, p]));
    const productMap = new Map(products.map((p) => [p.name, p]));
    const taxMap = new Map(taxes.map((t) => [t.code, t]));
    const documentTypeMap = new Map(
      documentTypes.map((dt) => [dt.description, dt]),
    );

    const documentType = documentTypeMap.get('Factura de Compra');
    if (!documentType) {
      throw new Error(
        'Tipo de documento "Factura de Compra" no encontrado en la BD',
      );
    }

    // ── 3. Transformación ──────────────────────────────────────────────────
    for (const factura of documents) {
      const party = partyMap.get(factura.Nombre);
      if (!party) throw new Error(`Party no encontrado: ${factura.Nombre}`);

      const product = productMap.get(factura.Concepto);
      if (!product)
        throw new Error(`Producto no encontrado: ${factura.Concepto}`);

      // Impuestos posibles con su clave de búsqueda y su importe
      const impuestosRaw: { code: string; amount: number }[] = [
        { code: 'IMP_IVA1', amount: factura.Imp_IVA1 },
        { code: 'IMP_IVA2', amount: factura.Imp_IVA2 },
        { code: 'IMP_IVA3', amount: factura.Imp_IVA3 },
        { code: 'COM_PERC_IIBB', amount: factura.COM_perc_IIBB },
        { code: 'COM_PERC_MUN', amount: factura.COM_perc_Mun },
        { code: 'COM_PERC_IVA', amount: factura.COM_perc_IVA },
        { code: 'IMP_EXENTO', amount: factura.Imp_Excento },
      ];

      // Solo impuestos con monto > 0 y que existan en la BD
      const impuestosValidos = impuestosRaw
        .filter((i) => i.amount > 0)
        .map((i) => {
          const tax = taxMap.get(i.code);
          if (!tax) throw new Error(`Impuesto no encontrado: ${i.code}`);
          return { tax, amount: i.amount };
        });

      const totalTaxes = impuestosValidos.reduce((acc, i) => acc + i.amount, 0);

      // Cada factura es UN elemento del array con sus relaciones anidadas
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

        // El Loader itera esto y los inserta en document_taxes con el documentId real
        document_taxes: impuestosValidos.map(({ tax, amount }) => ({
          tax_id: tax.id,
          tax_rate: tax.rate.toNumber(), // ← Decimal → number
          taxable_base: factura.Imp_gravado,
          tax_amount: amount,
        })),

        // El Loader inserta esto en document_items con el documentId real
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
