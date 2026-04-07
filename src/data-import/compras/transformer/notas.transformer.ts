import { Transformer } from '../../core/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotaRaw } from '../schemas/notas.schema';
import { ComprasTransformado } from './compras.transformer';

function extractNumber(comprobante: string): number {
  const match = comprobante.match(/\d+$/);
  return match ? parseInt(match[0], 10) : 0;
}

export class NotaTransformer implements Transformer<
  NotaRaw,
  ComprasTransformado
> {
  constructor(
    private prisma: PrismaService,
    private documentTypeCode: string, // 'NC' o 'ND'
  ) {}

  async transform(documents: NotaRaw[]): Promise<ComprasTransformado[]> {
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

    const documentType = documentTypeMap.get(this.documentTypeCode);
    if (!documentType) {
      throw new Error(
        `Tipo de documento "${this.documentTypeCode}" no encontrado en la BD`,
      );
    }

    const productoGenerico = productMap.get('SERVICIOS');
    if (!productoGenerico) {
      throw new Error('Producto genérico "SERVICIOS" no encontrado en la BD');
    }

    const refCounts = new Map<string, number>();

    let duplicateCounter = -1;

    for (const nota of documents) {
      const party = partyMap.get(nota.Nombre);
      if (!party) {
        console.warn(`⚠️  Party no encontrado: "${nota.Nombre}" — se omite`);
        continue;
      }

      const conceptoKey = nota.Concepto ?? nota.Nombre;
      const product = productMap.get(conceptoKey) ?? productoGenerico;

      const baseRef = nota.Comprobante ?? '0';
      const count = refCounts.get(baseRef) ?? 0;
      refCounts.set(baseRef, count + 1);
      const ref = count === 0 ? baseRef : `${baseRef}-${count}`;

      const baseNumber = baseRef.includes('-')
        ? extractNumber(baseRef)
        : Number(baseRef) || 0;
      const number = count === 0 ? baseNumber : duplicateCounter--;

      const date = nota.fecha_carga ?? nota.Fec_Vto ?? new Date();

      // Solo impuestos reales — sin IMP_EXENTO
      const impuestosRaw = [
        { code: 'IMP_IVA1', amount: nota.Imp_IVA1 ?? 0 },
        { code: 'COM_PERC_IIBB', amount: nota.COM_Perc_IIBB ?? 0 },
        { code: 'COM_PERC_MUN', amount: nota.COM_Perc_Mun ?? 0 },
        { code: 'COM_PERC_IVA', amount: nota.COM_Perc_IVA ?? 0 },
      ];

      const impuestosValidos = impuestosRaw
        .filter((i) => i.amount > 0)
        .flatMap((i) => {
          const tax = taxMap.get(i.code);
          if (!tax) {
            console.warn(`⚠️  Impuesto no encontrado: ${i.code} — se omite`);
            return [];
          }
          return [{ tax, amount: i.amount }];
        });

      const totalTaxes = impuestosValidos.reduce((acc, i) => acc + i.amount, 0);

      resultado.push({
        ref,
        document_type_id: documentType.id,
        party_id: party.id,
        number,
        date,
        status: 1,
        subtotal: nota.Imp_Gravado ?? 0,
        exempt_amount: nota.Imp_Exento ?? 0,
        total_taxes: totalTaxes,
        total: nota.Imp_Total ?? 0,

        document_taxes: impuestosValidos.map(({ tax, amount }) => ({
          tax_id: tax.id,
          tax_rate: tax.rate.toNumber(),
          taxable_base: nota.Imp_Gravado ?? 0,
          tax_amount: amount,
        })),

        document_items: [
          {
            product_id: product.id,
            quantity: nota.Unidades && nota.Unidades > 0 ? nota.Unidades : 1,
            price: nota.Imp_Gravado ?? 0,
          },
        ],
      });
    }

    return resultado;
  }
}
