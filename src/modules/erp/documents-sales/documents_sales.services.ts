import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ProductPriceService } from '../pricing/product-pricing/product-pricing.service';
import { CreateDocumentDto } from '../documents/dto/create-document.dto';
import { UpdateDocumentDto } from '../documents/dto/update-document.dto';

const STATUS_DRAFT = 0;
const STATUS_PENDING = 1;
const STATUS_CONFIRMED = 2;
const STATUS_CANCELLED = 3;

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface TaxInput {
  tax_id: string;
  tax_rate: number;
  tax_amount: number;
  calculation_level: string; // siempre requerido internamente
  is_included_in_price: boolean;
}

interface ItemInput {
  product_id: string | null;
  quantity: number;
  unit_price: number;
  price: number;
  taxes: TaxInput[];
}

interface CalculatedTotals {
  subtotal: number;
  exempt_amount: number;
  taxable_base: number;
  total_taxes: number;
  total: number;
  documentTaxes: {
    tax_id: string;
    tax_rate: number;
    taxable_base: number;
    tax_amount: number;
  }[];
}

interface DocTypeTax {
  tax_id: string;
  tax_rate: number;
  calculation_level: string;
}

@Injectable()
export class DocumentsSalesService {
  private readonly SALE_CODES = ['VEN', 'NCV', 'NDV'];

  constructor(
    private prisma: PrismaService,
    private productPriceService: ProductPriceService,
  ) {}

  // ─── Taxes del tipo de documento ─────────────────────────────────────────
  private async loadDocTypeTaxes(
    documentTypeId: string,
  ): Promise<DocTypeTax[]> {
    const rows = await this.prisma.document_type_taxes.findMany({
      where: { document_type_id: documentTypeId },
      include: { taxes: true },
    });

    return rows.map((r) => ({
      tax_id: r.tax_id,
      tax_rate: Number(r.taxes.rate),
      calculation_level: r.taxes.calculation_level,
    }));
  }

  // ─── Resolver ítems ───────────────────────────────────────────────────────
  /**
   * Para cada ítem:
   *
   * 1. unit_price:
   *    - Si viene override del frontend (> 0) → ese valor
   *    - Si el producto tiene price_enabled → último product_price activo
   *      via ProductPriceService.resolvePrice()
   *    - Si es rate_type o sin precio → 0
   *
   * 2. taxes:
   *    - Si el producto tiene product_taxes activos → esos
   *    - Si no tiene → los del document_type (docTypeTaxes)
   *    - Si tiene ambos → se suman (concat)
   *    - is_included_in_price=true → tax_amount=0 (ya está en el precio)
   *    - calculation_level='document' → tax_amount=0 aquí,
   *      se calcula sobre el subtotal global en calculateTotals
   */
  private async resolveItems(
    dtoItems: CreateDocumentDto['items'],
    documentTypeId: string,
  ): Promise<ItemInput[]> {
    const docTypeTaxes = await this.loadDocTypeTaxes(documentTypeId);
    const resolved: ItemInput[] = [];

    for (const item of dtoItems) {
      // ── Ítem libre sin producto ────────────────────────────────────────
      if (!item.product_id) {
        resolved.push({
          product_id: null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          price: round2(item.unit_price * item.quantity),
          taxes: docTypeTaxes.map((t) => ({
            tax_id: t.tax_id,
            tax_rate: t.tax_rate,
            tax_amount: 0,
            calculation_level: t.calculation_level,
            is_included_in_price: false,
          })),
        });
        continue;
      }

      // ── Cargar producto con sus taxes ──────────────────────────────────
      const product = await this.prisma.products.findUnique({
        where: { id: item.product_id },
        include: {
          product_taxes: {
            where: { active: true, deleted_at: null },
            include: { taxes: true },
          },
        },
      });

      if (!product) {
        throw new NotFoundException(
          `Producto ${item.product_id} no encontrado`,
        );
      }

      // ── Resolver unit_price via ProductPriceService ────────────────────
      let unitPrice =
        Number(item.unit_price) > 0
          ? Number(item.unit_price) // override manual del frontend
          : 0;

      if (unitPrice === 0) {
        const priceData = await this.productPriceService.resolvePrice(
          product.id,
        );
        // resolvePrice maneja internamente: is_rate_type, price_enabled, sin precio activo
        if (priceData) {
          unitPrice = priceData.price; // exemptionRate lo ignoramos, viene del cliente
        }
      }

      const price = round2(unitPrice * item.quantity);

      // ── Taxes propios del producto ─────────────────────────────────────
      const productTaxes: TaxInput[] = product.product_taxes.map((pt) => {
        const taxRate = Number(pt.taxes.rate);
        const level = pt.taxes.calculation_level;
        const included = pt.is_included_in_price;

        const taxAmount =
          included || level === 'document'
            ? 0
            : round2(price * (taxRate / 100));

        return {
          tax_id: pt.tax_id,
          tax_rate: taxRate,
          tax_amount: taxAmount,
          calculation_level: level,
          is_included_in_price: included,
        };
      });

      // ── Taxes del document_type que no están ya en el producto ─────────
      const productTaxIds = new Set(productTaxes.map((t) => t.tax_id));
      const fallbackTaxes: TaxInput[] = docTypeTaxes
        .filter((t) => !productTaxIds.has(t.tax_id))
        .map((t) => ({
          tax_id: t.tax_id,
          tax_rate: t.tax_rate,
          tax_amount: 0,
          calculation_level: t.calculation_level,
          is_included_in_price: false,
        }));

      resolved.push({
        product_id: product.id,
        quantity: item.quantity,
        unit_price: unitPrice,
        price,
        taxes: [...productTaxes, ...fallbackTaxes],
      });
    }

    return resolved;
  }

  // ─── Calcular totales ─────────────────────────────────────────────────────
  /**
   * subtotal      = Σ item.price
   * exempt_amount = subtotal * (party.exemption_rate / 100)
   * taxable_base  = subtotal - exempt_amount
   *
   * Taxes 'line':
   *   tax_amount ya calculado en resolveItems → se agrupa y suma por tax_id
   *
   * Taxes 'document':
   *   tax_amount = taxable_base * (rate / 100) → una sola vez al final
   *
   * total_taxes = Σ lineTaxes + Σ docTaxes
   * total       = subtotal + total_taxes
   */
  private async calculateTotals(
    items: ItemInput[],
    partyId?: string | null,
  ): Promise<CalculatedTotals> {
    const subtotal = round2(items.reduce((acc, i) => acc + Number(i.price), 0));

    // ── Exención desde el cliente ──────────────────────────────────────────
    let exemptionRate = 0;
    if (partyId) {
      const party = await this.prisma.business_parties.findUnique({
        where: { id: partyId },
        select: { exemption_rate: true },
      });
      exemptionRate = Number(party?.exemption_rate ?? 0);
    }

    const exemptAmount = round2(subtotal * (exemptionRate / 100));
    const taxableBase = round2(subtotal - exemptAmount);

    // ── Agrupar taxes por nivel ────────────────────────────────────────────
    const lineTaxMap = new Map<
      string,
      {
        tax_id: string;
        tax_rate: number;
        taxable_base: number;
        tax_amount: number;
      }
    >();

    const docTaxMap = new Map<
      string,
      {
        tax_id: string;
        tax_rate: number;
      }
    >();

    for (const item of items) {
      for (const t of item.taxes) {
        if (t.is_included_in_price) continue;

        if (t.calculation_level === 'line') {
          const existing = lineTaxMap.get(t.tax_id);
          if (existing) {
            existing.tax_amount = round2(existing.tax_amount + t.tax_amount);
            existing.taxable_base = round2(
              existing.taxable_base + Number(item.price),
            );
          } else {
            lineTaxMap.set(t.tax_id, {
              tax_id: t.tax_id,
              tax_rate: t.tax_rate,
              taxable_base: Number(item.price),
              tax_amount: t.tax_amount,
            });
          }
        } else {
          // 'document' → solo registrar rate, el monto se calcula después
          if (!docTaxMap.has(t.tax_id)) {
            docTaxMap.set(t.tax_id, {
              tax_id: t.tax_id,
              tax_rate: t.tax_rate,
            });
          }
        }
      }
    }

    // ── Consolidar document_taxes ──────────────────────────────────────────
    const documentTaxes: CalculatedTotals['documentTaxes'] = [];
    let totalTaxes = 0;

    for (const [, t] of lineTaxMap) {
      totalTaxes = round2(totalTaxes + t.tax_amount);
      documentTaxes.push(t);
    }

    for (const [, t] of docTaxMap) {
      const taxAmount = round2(taxableBase * (t.tax_rate / 100));
      totalTaxes = round2(totalTaxes + taxAmount);
      documentTaxes.push({
        tax_id: t.tax_id,
        tax_rate: t.tax_rate,
        taxable_base: taxableBase,
        tax_amount: taxAmount,
      });
    }

    return {
      subtotal,
      exempt_amount: exemptAmount,
      taxable_base: taxableBase,
      total_taxes: totalTaxes,
      total: round2(subtotal + totalTaxes),
      documentTaxes,
    };
  }

  // ─── Persistir ítems ──────────────────────────────────────────────────────
  private async persistItems(
    documentId: string,
    items: ItemInput[],
    tx: any,
  ): Promise<void> {
    for (const item of items) {
      const docItem = await tx.document_items.create({
        data: {
          document_id: documentId,
          product_id: item.product_id ?? null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          price: item.price,
        },
      });

      // Solo taxes de línea no incluidos en precio → document_item_taxes
      const lineTaxes = item.taxes.filter(
        (t) => t.calculation_level === 'line' && !t.is_included_in_price,
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

  // ─── Crear ────────────────────────────────────────────────────────────────
  async create(dto: CreateDocumentDto) {
    const docType = await this.prisma.document_types.findUnique({
      where: { id: dto.document_type_id },
      include: { document_sequences: true },
    });
    if (!docType)
      throw new NotFoundException('Tipo de documento no encontrado');

    const items = await this.resolveItems(dto.items, dto.document_type_id);
    const totals = await this.calculateTotals(items, dto.party_id);

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

    let items: ItemInput[] | null = null;
    let totals: CalculatedTotals | null = null;

    if (dto.items?.length) {
      items = await this.resolveItems(dto.items, doc.document_type_id);
      totals = await this.calculateTotals(items, dto.party_id ?? doc.party_id);
    }
    if (doc.source === 'import')
      throw new BadRequestException(
        'No se pueden modificar documentos importados',
      );

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

  // ─── Generar borradores desde viaje ───────────────────────────────────────
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

      // Tarifas logísticas sin taxes → todo exento
      const items: ItemInput[] = group.dispatches.flatMap((d) =>
        d.rates.map((rate) => ({
          product_id: null,
          quantity: 1,
          unit_price: rate.value,
          price: rate.value,
          taxes: [],
        })),
      );

      const totals = await this.calculateTotals(items, group.customerId);

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
    if (!id || id === 'undefined') throw new BadRequestException('ID inválido');

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

  // ─── Viajes completados ───────────────────────────────────────────────────
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
