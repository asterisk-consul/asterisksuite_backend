import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateSaleDocumentDto } from './dto/create-sale-document.dto';
import { UpdateSaleDocumentDto } from './dto/update-sale-document.dto';

const STATUS_DRAFT = 0;
const STATUS_PENDING = 1;
const STATUS_CONFIRMED = 2;
const STATUS_CANCELLED = 3;

const DEFAULT_SALE_DOC_TYPE_ID = '84052621-1431-425b-a301-ce6429fafb6a';

@Injectable()
export class DocumentsSalesService {
  private readonly SALE_CODES = ['VEN', 'NC', 'ND'];

  constructor(private prisma: PrismaService) {}

  // ─── Crear manual ─────────────────────────────────────────────────────────
  async create(dto: CreateSaleDocumentDto) {
    const docType = await this.prisma.document_types.findUnique({
      where: { id: dto.document_type_id },
      include: { document_sequences: true },
    });
    if (!docType)
      throw new NotFoundException('Tipo de documento no encontrado');

    return this.prisma.$transaction(async (tx) => {
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
          subtotal: dto.subtotal,
          exempt_amount: dto.exempt_amount,
          total_taxes: dto.total_taxes,
          total: dto.total,
          descrip: dto.descrip ?? null,
          ref: dto.ref ?? null,
        },
      });

      for (const item of dto.items) {
        const docItem = await tx.document_items.create({
          data: {
            document_id: document.id,
            product_id: item.product_id ?? null,
            quantity: item.quantity,
            unit_price: item.unit_price,
            price: item.price,
          },
        });

        if (item.taxes?.length) {
          await tx.document_item_taxes.createMany({
            data: item.taxes.map((t) => ({
              document_item_id: docItem.id,
              tax_id: t.tax_id,
              tax_rate: t.tax_rate,
              tax_amount: t.tax_amount,
            })),
          });
        }
      }

      if (dto.taxes?.length) {
        await tx.document_taxes.createMany({
          data: dto.taxes.map((t) => ({
            document_id: document.id,
            tax_id: t.tax_id,
            tax_rate: t.tax_rate,
            taxable_base: t.taxable_base,
            tax_amount: t.tax_amount,
          })),
        });
      }

      return this.findOne(document.id);
    });
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
                    dispatch_rates: {
                      include: { transfer_rates: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!trip) throw new NotFoundException('Viaje no encontrado');

    // Agrupar despachos por cliente
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
        const alreadyAdded = group.dispatches.some(
          (d) => d.orderId === dispatch.id,
        );
        if (!alreadyAdded) {
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

      const allRates = group.dispatches.flatMap((d) => d.rates);
      const subtotal = allRates.reduce((acc, r) => acc + r.value, 0);

      await this.prisma.$transaction(async (tx) => {
        // ← número se obtiene DENTRO de la transacción para evitar duplicados
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
            subtotal,
            exempt_amount: 0,
            total_taxes: 0,
            total: subtotal,
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
        document_types: {
          code: { in: this.SALE_CODES },
        },
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
  async update(id: string, dto: UpdateSaleDocumentDto) {
    const doc = await this.findOne(id);

    if (doc.status === STATUS_CONFIRMED)
      throw new BadRequestException(
        'No se puede modificar un documento confirmado',
      );
    if (doc.status === STATUS_CANCELLED)
      throw new BadRequestException(
        'No se puede modificar un documento anulado',
      );

    return this.prisma.$transaction(async (tx) => {
      await tx.documents.update({
        where: { id },
        data: {
          party_id: dto.party_id ?? doc.party_id,
          date: dto.date ? new Date(dto.date) : doc.date,
          status: dto.status ?? doc.status,
          subtotal: dto.subtotal ?? doc.subtotal,
          exempt_amount: dto.exempt_amount ?? doc.exempt_amount,
          total_taxes: dto.total_taxes ?? doc.total_taxes,
          total: dto.total ?? doc.total,
          descrip: dto.descrip ?? doc.descrip,
          ref: dto.ref ?? doc.ref,
          updated_at: new Date(),
        },
      });

      if (dto.items?.length) {
        await tx.document_item_taxes.deleteMany({
          where: { document_items: { document_id: id } },
        });
        await tx.document_items.deleteMany({ where: { document_id: id } });

        for (const item of dto.items) {
          const docItem = await tx.document_items.create({
            data: {
              document_id: id,
              product_id: item.product_id ?? null,
              quantity: item.quantity,
              unit_price: item.unit_price,
              price: item.price,
            },
          });

          if (item.taxes?.length) {
            await tx.document_item_taxes.createMany({
              data: item.taxes.map((t) => ({
                document_item_id: docItem.id,
                tax_id: t.tax_id,
                tax_rate: t.tax_rate,
                tax_amount: t.tax_amount,
              })),
            });
          }
        }
      }

      if (dto.taxes?.length) {
        await tx.document_taxes.deleteMany({ where: { document_id: id } });
        await tx.document_taxes.createMany({
          data: dto.taxes.map((t) => ({
            document_id: id,
            tax_id: t.tax_id,
            tax_rate: t.tax_rate,
            taxable_base: t.taxable_base,
            tax_amount: t.tax_amount,
          })),
        });
      }

      return this.findOne(id);
    });
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
