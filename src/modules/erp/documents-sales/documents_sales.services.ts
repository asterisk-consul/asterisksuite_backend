import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ProductPriceService } from '../../master-data/products-prices/products_prices.service';
import { CreateDocumentDto } from '../documents/dto/create-document.dto';
import { UpdateDocumentDto } from '../documents/dto/update-document.dto';

/* 
Draft: Borrador editable

Pending: Pendiente de revisión

Confirmed: Confirmado, ya no editable

Cancelled: Anulado
 */
// ─── Estados ──────────────────────────────────────────────────────────────────
const STATUS_DRAFT = 0;
const STATUS_PENDING = 1;
const STATUS_CONFIRMED = 2;
const STATUS_CANCELLED = 3;

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface TaxInput {
  tax_id: string;
  tax_rate: number;
  tax_amount: number;
  calculation_level?: string;
}

interface ItemInput {
  product_id?: string | null;
  quantity: number;
  unit_price: number;
  price: number;
  taxes?: TaxInput[];
}

interface CalculatedTotals {
  subtotal: number;
  exempt_amount: number;
  total_taxes: number;
  total: number;
  documentTaxes: {
    tax_id: string;
    tax_rate: number;
    taxable_base: number;
    tax_amount: number;
  }[];
}

@Injectable()
export class DocumentsSalesService {
  private readonly SALE_CODES = ['FAV', 'NCV', 'NDV'];

  constructor(
    private prisma: PrismaService,
    private productPriceService: ProductPriceService,
  ) {}

  // ─── Resolver ítems: precio + taxes desde el producto ────────────────────
  /**
   * Para cada ítem del DTO:
   *
   * 1. Si unit_price > 0 (override manual del frontend):
   *    - Se usa ese precio
   *    - Se buscan los taxes del producto desde product_taxes para calcularlos
   *      sobre ese precio
   *
   * 2. Si unit_price === 0 y el producto tiene price_enabled:
   *    - Se toma el precio desde product_price (último activo)
   *    - Se toman los taxes desde product_taxes
   *
   * 3. Si el producto no tiene price configurado (tarifa logística, etc.):
   *    - Se usa el ítem tal como viene del DTO (precio y taxes manuales)
   *
   * En todos los casos los totales del DTO se ignoran; se recalculan abajo.
   */
  private async resolveItems(
    dtoItems: CreateDocumentDto['items'],
  ): Promise<ItemInput[]> {
    const resolved = [] as ItemInput[];

    for (const item of dtoItems) {
      if (!item.product_id) {
        // Ítem libre sin producto → se usa tal cual
        const price = round2(item.unit_price * item.quantity);

        resolved.push({
          product_id: item.product_id ?? null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          price,
          taxes: item.taxes ?? [],
        });
        continue;
      }

      // Aca verifica si el precio lo coloca el cliente
      const overridePrice =
        Number(item.unit_price) > 0 ? Number(item.unit_price) : undefined;

      const resolvedItem = await this.productPriceService.resolveItemWithTaxes(
        item.product_id,
        Number(item.quantity),
        overridePrice,
      );

      if (resolvedItem) {
        // 🔥 BLINDADO: nunca undefined
        const price =
          resolvedItem.price ??
          round2(resolvedItem.unit_price * resolvedItem.quantity);

        resolved.push({
          product_id: resolvedItem.product_id,
          quantity: resolvedItem.quantity,
          unit_price: resolvedItem.unit_price,
          price,
          taxes: resolvedItem.taxes ?? [],
        });
      } else {
        // Producto sin precio configurado
        const price = round2(item.unit_price * item.quantity);

        resolved.push({
          product_id: item.product_id ?? null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          price,
          taxes: item.taxes ?? [],
        });
      }
    }

    return resolved as ItemInput[];
  }

  // ─── Calcular totales ─────────────────────────────────────────────────────
  /**
   * subtotal      = Σ item.price
   * exempt_amount = Σ item.price de ítems sin taxes de línea
   * total_taxes   = Σ tax_amount (line) + Σ tax_amount (document, sobre subtotal)
   * total         = subtotal + total_taxes
   *
   * Los taxes con calculation_level='document' se consolidan y se calculan
   * sobre el subtotal total; sus filas van a document_taxes.
   */
  private async calculateTotals(
    items: ItemInput[],
    tx?: any,
  ): Promise<CalculatedTotals> {
    const db = tx ?? this.prisma;

    const subtotal = round2(
      items.reduce((acc, item) => acc + Number(item.price), 0),
    );

    // Consultar calculation_level solo para los taxes que no lo traen resuelto
    const unknownTaxIds = [
      ...new Set(
        items
          .flatMap((item) => item.taxes ?? [])
          .filter((t) => !t.calculation_level)
          .map((t) => t.tax_id),
      ),
    ];

    const taxLevelMap = new Map<string, string>();

    if (unknownTaxIds.length) {
      const records = await db.taxes.findMany({
        where: { id: { in: unknownTaxIds } },
        select: { id: true, calculation_level: true },
      });
      for (const r of records) taxLevelMap.set(r.id, r.calculation_level);
    }

    const getLevel = (t: TaxInput): string =>
      t.calculation_level ?? taxLevelMap.get(t.tax_id) ?? 'line';

    let lineTaxesTotal = 0;
    let exemptAmount = 0;
    const docLevelTaxMap = new Map<
      string,
      { tax_id: string; tax_rate: number }
    >();

    for (const item of items) {
      const itemTaxes = item.taxes ?? [];
      const lineTaxes = itemTaxes.filter((t) => getLevel(t) === 'line');
      const docTaxes = itemTaxes.filter((t) => getLevel(t) === 'document');

      lineTaxesTotal += lineTaxes.reduce(
        (acc, t) => acc + Number(t.tax_amount),
        0,
      );

      // Sin taxes de línea → el monto del ítem es exento
      if (lineTaxes.length === 0) {
        exemptAmount += Number(item.price);
      }

      for (const t of docTaxes) {
        if (!docLevelTaxMap.has(t.tax_id)) {
          docLevelTaxMap.set(t.tax_id, {
            tax_id: t.tax_id,
            tax_rate: Number(t.tax_rate),
          });
        }
      }
    }

    // Taxes de nivel documento: se calculan sobre el subtotal total
    const documentTaxes: CalculatedTotals['documentTaxes'] = [];
    let docTaxesTotal = 0;

    for (const [, tax] of docLevelTaxMap) {
      const taxAmount = round2(subtotal * (tax.tax_rate / 100));
      docTaxesTotal += taxAmount;
      documentTaxes.push({
        tax_id: tax.tax_id,
        tax_rate: tax.tax_rate,
        taxable_base: subtotal,
        tax_amount: taxAmount,
      });
    }

    const totalTaxes = round2(lineTaxesTotal + docTaxesTotal);

    return {
      subtotal,
      exempt_amount: round2(exemptAmount),
      total_taxes: totalTaxes,
      total: round2(subtotal + totalTaxes),
      documentTaxes,
    };
  }

  // ─── Persistir ítems y sus taxes de línea ────────────────────────────────
  private async persistItems(
    documentId: string,
    items: ItemInput[],
    tx: any,
  ): Promise<void> {
    for (const item of items) {
      if (item.price === undefined) {
        throw new Error('Price undefined - bug en resolveItems');
      }
      const docItem = await tx.document_items.create({
        data: {
          document_id: documentId,
          product_id: item.product_id ?? null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          price: Number(item.price ?? 0),
        },
      });

      // Solo los taxes de línea van a document_item_taxes
      const lineTaxes = (item.taxes ?? []).filter(
        (t) => (t.calculation_level ?? 'line') === 'line',
      );

      if (lineTaxes.length) {
        await tx.document_item_taxes.createMany({
          data: lineTaxes.map((t) => ({
            document_item_id: docItem.id,
            tax_id: t.tax_id,
            tax_rate: t.tax_rate,
            tax_amount: t.tax_amount,
          })),
        });
      }
    }
  }

  // ─── Crear manual ─────────────────────────────────────────────────────────
  async create(dto: CreateDocumentDto) {
    const docType = await this.prisma.document_types.findUnique({
      where: { id: dto.document_type_id },
      include: { document_sequences: true },
    });
    if (!docType)
      throw new NotFoundException('Tipo de documento no encontrado');

    // Resolver precios e impuestos ANTES de abrir la transacción
    const items = await this.resolveItems(dto.items);
    const totals = await this.calculateTotals(items);

    let createdId = '';

    await this.prisma.$transaction(async (tx) => {
      const number = await this.getNextNumber(
        dto.document_type_id,
        docType.document_sequences?.id ?? null,
        tx,
      );

      const document = await tx.documents.create({
        data: {
          document_type_id: dto.document_type_id,
          party_id: dto.party_id ?? null,
          number,
          date: new Date(dto.date),
          status: STATUS_DRAFT,
          subtotal: totals.subtotal,
          exempt_amount: totals.exempt_amount,
          total_taxes: totals.total_taxes,
          total: totals.total,
          descrip: dto.descrip ?? null,
          ref: dto.ref ?? null,
        },
      });

      createdId = document.id;

      await this.persistItems(document.id, items, tx);

      if (totals.documentTaxes.length) {
        await tx.document_taxes.createMany({
          data: totals.documentTaxes.map((t) => ({
            document_id: document.id,
            ...t,
          })),
        });
      }
    });

    if (!createdId)
      throw new BadRequestException('Error al crear el documento');

    return this.findOne(createdId);
  }

  // ─── Generar borradores desde viaje completado ────────────────────────────
  async generateDraftsFromTrip(
    tripId: string,
  ): Promise<{ created: number; skipped: number }> {
    const trip = await this.prisma.trips.findUnique({
      where: { id: tripId },
      include: {
        trip_stops: {
          include: {
            trip_orders: {
              include: {
                dispatch_order: {
                  include: {
                    customers: true,
                    dispatch_rates: { include: { transfer_rates: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!trip) throw new NotFoundException('Viaje no encontrado');

    const byCustomer = new Map<
      string,
      {
        customerId: string;
        customerName: string;
        dispatches: {
          orderId: string;
          orderNumber: string;
          rates: { rateId: string; rateName: string; value: number }[];
        }[];
      }
    >();

    for (const stop of trip.trip_stops) {
      for (const tripOrder of stop.trip_orders) {
        const dispatch = tripOrder.dispatch_order;
        if (!dispatch?.customer_id || !dispatch.customers) continue;

        const customerId = dispatch.customer_id;

        if (!byCustomer.has(customerId)) {
          byCustomer.set(customerId, {
            customerId,
            customerName: dispatch.customers.name,
            dispatches: [],
          });
        }

        const group = byCustomer.get(customerId)!;
        if (!group.dispatches.some((d) => d.orderId === dispatch.id)) {
          group.dispatches.push({
            orderId: dispatch.id,
            orderNumber: dispatch.order_number,
            rates: dispatch.dispatch_rates.map((dr) => ({
              rateId: dr.rate_id,
              rateName: dr.transfer_rates?.name ?? 'Sin nombre',
              value: Number(dr.value),
            })),
          });
        }
      }
    }

    const docType = await this.prisma.document_types.findUnique({
      where: { code: 'VEN' },
      include: { document_sequences: true },
    });
    if (!docType)
      throw new NotFoundException('Tipo de documento VEN no configurado');

    let created = 0;
    let skipped = 0;

    for (const [, group] of byCustomer) {
      const existing = await this.prisma.documents.findFirst({
        where: {
          party_id: group.customerId,
          ref: `TRIP-${tripId}`.substring(0, 50),
          status: { in: [STATUS_DRAFT, STATUS_PENDING] },
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      // Tarifas logísticas: sin taxes → todo exento
      const items: ItemInput[] = group.dispatches.flatMap((d) =>
        d.rates.map((rate) => ({
          product_id: null,
          quantity: 1,
          unit_price: rate.value,
          price: rate.value,
          taxes: [],
        })),
      );

      const totals = await this.calculateTotals(items);

      await this.prisma.$transaction(async (tx) => {
        const number = await this.getNextNumber(
          docType.id,
          docType.document_sequences?.id ?? null,
          tx,
        );

        const document = await tx.documents.create({
          data: {
            document_type_id: docType.id,
            party_id: group.customerId,
            number,
            date: new Date(),
            status: STATUS_PENDING,
            subtotal: totals.subtotal,
            exempt_amount: totals.exempt_amount,
            total_taxes: totals.total_taxes,
            total: totals.total,
            ref: `TRIP-${tripId}`.substring(0, 50),
            descrip:
              `V:${trip.reference_number ?? tripId.substring(0, 8)} ${group.customerName}`.substring(
                0,
                50,
              ),
          },
        });

        for (const dispatch of group.dispatches) {
          for (const rate of dispatch.rates) {
            const product = await tx.products.findFirst({
              where: { rate_id: rate.rateId, is_rate_type: true },
            });

            await tx.document_items.create({
              data: {
                document_id: document.id,
                product_id: product?.id ?? null,
                quantity: 1,
                unit_price: rate.value,
                price: rate.value,
              },
            });
          }
        }
      });

      created++;
    }

    return { created, skipped };
  }

  // ─── Listar ───────────────────────────────────────────────────────────────
  async findAll(documentTypeId?: string, status?: number) {
    return this.prisma.documents.findMany({
      where: {
        document_types: { code: { in: this.SALE_CODES } },
        ...(documentTypeId ? { document_type_id: documentTypeId } : {}),
        ...(status !== undefined ? { status } : {}),
      },
      include: {
        document_types: true,
        business_parties: true,
        document_items: {
          include: {
            products: true,
            document_item_taxes: { include: { taxes: true } },
          },
        },
        document_taxes: { include: { taxes: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // ─── Obtener uno ──────────────────────────────────────────────────────────
  async findOne(id: string) {
    if (!id || id === 'undefined') {
      throw new BadRequestException('ID inválido');
    }
    const doc = await this.prisma.documents.findUnique({
      where: { id },
      include: {
        document_types: true,
        business_parties: true,
        document_items: {
          include: {
            products: true,
            document_item_taxes: { include: { taxes: true } },
          },
        },
        document_taxes: { include: { taxes: true } },
      },
    });
    if (!doc) throw new NotFoundException('Documento no encontrado');
    return doc;
  }

  // ─── Actualizar ───────────────────────────────────────────────────────────
  async update(id: string, dto: UpdateDocumentDto) {
    const doc = await this.findOne(id);

    if (doc.status === STATUS_CONFIRMED)
      throw new BadRequestException(
        'No se puede modificar un documento confirmado',
      );
    if (doc.status === STATUS_CANCELLED)
      throw new BadRequestException(
        'No se puede modificar un documento anulado',
      );

    // Resolver ítems ANTES de abrir la transacción
    let items: ItemInput[] | null = null;
    let totals: CalculatedTotals | null = null;

    if (dto.items?.length) {
      items = await this.resolveItems(dto.items);
      totals = await this.calculateTotals(items);
    }

    await this.prisma.$transaction(async (tx) => {
      if (items && totals) {
        await tx.document_item_taxes.deleteMany({
          where: { document_items: { document_id: id } },
        });
        await tx.document_items.deleteMany({ where: { document_id: id } });

        await this.persistItems(id, items!, tx);

        await tx.document_taxes.deleteMany({ where: { document_id: id } });

        if (totals.documentTaxes.length) {
          await tx.document_taxes.createMany({
            data: totals.documentTaxes.map((t) => ({ document_id: id, ...t })),
          });
        }
      }

      await tx.documents.update({
        where: { id },
        data: {
          party_id: dto.party_id ?? doc.party_id,
          date: dto.date ? new Date(dto.date) : doc.date,
          status: dto.status ?? doc.status,
          subtotal: totals?.subtotal ?? Number(doc.subtotal),
          exempt_amount: totals?.exempt_amount ?? Number(doc.exempt_amount),
          total_taxes: totals?.total_taxes ?? Number(doc.total_taxes),
          total: totals?.total ?? Number(doc.total),
          descrip: dto.descrip ?? doc.descrip,
          ref: dto.ref ?? doc.ref,
          updated_at: new Date(),
        },
      });
    });

    return this.findOne(id);
  }

  // ─── Confirmar ────────────────────────────────────────────────────────────
  async confirm(id: string) {
    const doc = await this.findOne(id);
    if (doc.status === STATUS_CONFIRMED)
      throw new BadRequestException('El documento ya está confirmado');
    if (!doc.document_items.length)
      throw new BadRequestException('El documento no tiene ítems');

    return this.prisma.documents.update({
      where: { id },
      data: { status: STATUS_CONFIRMED, updated_at: new Date() },
    });
  }

  // ─── Anular ───────────────────────────────────────────────────────────────
  async cancel(id: string) {
    const doc = await this.findOne(id);
    if (doc.status === STATUS_CANCELLED)
      throw new BadRequestException('El documento ya está anulado');

    return this.prisma.documents.update({
      where: { id },
      data: { status: STATUS_CANCELLED, updated_at: new Date() },
    });
  }

  // ─── Eliminar (solo borradores) ───────────────────────────────────────────
  async remove(id: string) {
    const doc = await this.findOne(id);
    if (doc.status !== STATUS_DRAFT)
      throw new BadRequestException(
        'Solo se pueden eliminar documentos en borrador',
      );

    return this.prisma.$transaction(async (tx) => {
      await tx.document_item_taxes.deleteMany({
        where: { document_items: { document_id: id } },
      });
      await tx.document_taxes.deleteMany({ where: { document_id: id } });
      await tx.document_items.deleteMany({ where: { document_id: id } });
      return tx.documents.delete({ where: { id } });
    });
  }

  // ─── Secuencia ────────────────────────────────────────────────────────────
  private async getNextNumber(
    documentTypeId: string,
    sequenceId: string | null,
    tx?: any,
  ): Promise<number> {
    const db = tx ?? this.prisma;

    if (!sequenceId) {
      const last = await db.documents.findFirst({
        where: { document_type_id: documentTypeId },
        orderBy: { number: 'desc' },
      });
      return (last?.number ?? 0) + 1;
    }

    const seq = await db.document_sequences.update({
      where: { id: sequenceId },
      data: { current_number: { increment: 1 } },
    });

    return seq.current_number;
  }

  // ─── Todos los viajes completados ─────────────────────────────────────────
  async getAllCompletedTripIds(): Promise<string[]> {
    const trips = await this.prisma.trips.findMany({
      where: { status: 'COMPLETED' },
      select: { id: true },
    });
    return trips.map((t) => t.id);
  }
}

// ─── Utilidad ─────────────────────────────────────────────────────────────────
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
