// src/modules/erp/documents-sales/documents_sales.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateDocumentDto } from '../documents/dto/create-document.dto';

import { UpdateDocumentDto } from '../documents/dto/update-document.dto';

import { DocumentsSalesItemsService } from './documents-sales-items.service';

import { DocumentsSalesTotalsService } from './documents-sales-totals.service';

import { ItemInput } from './interfaces/item-input.interface';

const STATUS_DRAFT = 0;

const STATUS_PENDING = 1;

const STATUS_CONFIRMED = 2;

const STATUS_CANCELLED = 3;

@Injectable()
export class DocumentsSalesService {
  private readonly SALE_CODES = ['VEN', 'NCV', 'NDV'];

  constructor(
    private readonly prisma: PrismaService,

    private readonly itemsService: DocumentsSalesItemsService,

    private readonly totalsService: DocumentsSalesTotalsService,
  ) {}

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateDocumentDto) {
    const docType = await this.prisma.document_types.findUnique({
      where: {
        id: dto.document_type_id,
      },

      include: {
        document_sequences: true,
      },
    });

    if (!docType) {
      throw new NotFoundException('Tipo de documento no encontrado');
    }

    const items = await this.itemsService.resolveItems(
      dto.items,

      dto.document_type_id,

      dto.currency_code,
    );

    const totals = this.totalsService.calculate(items);

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

          currency_code: dto.currency_code,

          subtotal: totals.subtotal,

          exempt_amount: totals.exempt_amount,

          taxable_base: totals.taxable_base,

          total_taxes: totals.total_taxes,

          total: totals.total,

          descrip: dto.descrip ?? null,

          ref: dto.ref ?? null,
        },
      });

      createdId = document.id;

      await this.persistItems(
        document.id,

        items,

        tx,
      );

      if (totals.documentTaxes.length) {
        await tx.document_taxes.createMany({
          data: totals.documentTaxes.map((t) => ({
            document_id: document.id,

            tax_id: t.tax_id,

            tax_rate: t.tax_rate,

            taxable_base: t.taxable_base,

            tax_amount: t.tax_amount,
          })),
        });
      }
    });

    if (!createdId) {
      throw new BadRequestException('No se pudo crear el documento');
    }

    return this.findOne(createdId);
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  async update(
    id: string,

    dto: UpdateDocumentDto,
  ) {
    const doc = await this.findOne(id);

    if (doc.status === STATUS_CONFIRMED) {
      throw new BadRequestException(
        'No se puede modificar un documento confirmado',
      );
    }

    if (doc.status === STATUS_CANCELLED) {
      throw new BadRequestException(
        'No se puede modificar un documento anulado',
      );
    }

    let items: ItemInput[] | null = null;

    let totals: any = null;

    if (dto.items?.length) {
      if (!dto.currency_code) {
        throw new BadRequestException('currency_code es requerido');
      }

      items = await this.itemsService.resolveItems(
        dto.items,

        doc.document_type_id,

        dto.currency_code,
      );

      totals = this.totalsService.calculate(items);
    }

    await this.prisma.$transaction(async (tx) => {
      if (items && totals) {
        await tx.document_item_taxes.deleteMany({
          where: {
            document_items: {
              document_id: id,
            },
          },
        });

        await tx.document_items.deleteMany({
          where: {
            document_id: id,
          },
        });

        await tx.document_taxes.deleteMany({
          where: {
            document_id: id,
          },
        });

        await this.persistItems(
          id,

          items,

          tx,
        );

        if (totals.documentTaxes.length) {
          await tx.document_taxes.createMany({
            data: totals.documentTaxes.map((t) => ({
              document_id: id,

              tax_id: t.tax_id,

              tax_rate: t.tax_rate,

              taxable_base: t.taxable_base,

              tax_amount: t.tax_amount,
            })),
          });
        }
      }

      await tx.documents.update({
        where: {
          id,
        },

        data: {
          party_id: dto.party_id ?? doc.party_id,

          date: dto.date ? new Date(dto.date) : doc.date,

          status: dto.status ?? doc.status,

          currency_code: dto.currency_code ?? doc.currency_code,

          subtotal: totals?.subtotal ?? Number(doc.subtotal),

          exempt_amount: totals?.exempt_amount ?? Number(doc.exempt_amount),

          taxable_base: totals?.taxable_base ?? Number(doc.taxable_base),

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

  // ─────────────────────────────────────────────
  // PERSIST ITEMS
  // ─────────────────────────────────────────────
  private async persistItems(
    documentId: string,

    items: ItemInput[],

    tx: any,
  ) {
    for (const item of items) {
      const docItem = await tx.document_items.create({
        data: {
          document_id: documentId,

          product_id: item.product_id ?? null,

          quantity: item.quantity,

          unit_price: item.unit_price,

          original_unit_price: item.original_unit_price,

          currency_code: item.currency,

          exchange_rate: item.exchange_rate,

          price: item.price,
        },
      });

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

  // ─────────────────────────────────────────────
  // FIND ALL
  // ─────────────────────────────────────────────
  async findAll(
    documentTypeId?: string,

    status?: number,
  ) {
    return this.prisma.documents.findMany({
      where: {
        document_types: {
          code: {
            in: this.SALE_CODES,
          },
        },

        ...(documentTypeId
          ? {
              document_type_id: documentTypeId,
            }
          : {}),

        ...(status !== undefined ? { status } : {}),
      },

      include: {
        document_types: true,

        business_parties: true,

        document_items: {
          include: {
            products: true,

            document_item_taxes: {
              include: {
                taxes: true,
              },
            },
          },
        },

        document_taxes: {
          include: {
            taxes: true,
          },
        },
      },

      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // ─────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────
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

            document_item_taxes: {
              include: {
                taxes: true,
              },
            },
          },
        },

        document_taxes: {
          include: {
            taxes: true,
          },
        },
      },
    });

    if (!doc) {
      throw new NotFoundException('Documento no encontrado');
    }

    return doc;
  }
  // ─────────────────────────────────────────────
  // GENERAR BORRADORES DESDE VIAJE
  // ─────────────────────────────────────────────
  async generateDraftsFromTrip(
    tripId: string,
  ): Promise<{ created: number; skipped: number }> {
    const trip = await this.prisma.trips.findUnique({
      where: {
        id: tripId,
      },

      select: {
        id: true,

        reference_number: true,
      },
    });

    if (!trip) {
      throw new NotFoundException('Viaje no encontrado');
    }

    // ─────────────────────────────────────────────
    // QUERY OPTIMIZADA
    // ─────────────────────────────────────────────
    const tripOrders = await this.prisma.trip_stop_orders.findMany({
      where: {
        trip_stop: {
          trip_id: tripId,
        },
      },

      select: {
        dispatch_order: {
          select: {
            id: true,

            order_number: true,

            customer_id: true,

            customers: {
              select: {
                name: true,
              },
            },

            dispatch_rates: {
              select: {
                rate_id: true,

                value: true,

                transfer_rates: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const byCustomer = new Map<
      string,
      {
        customerId: string;

        customerName: string;

        dispatches: {
          orderId: string;

          orderNumber: string;

          rates: {
            rateId: string;

            rateName: string;

            value: number;
          }[];
        }[];
      }
    >();

    // ─────────────────────────────────────────────
    // AGRUPAR
    // ─────────────────────────────────────────────
    for (const row of tripOrders) {
      const dispatch = row.dispatch_order;

      if (!dispatch?.customer_id || !dispatch.customers) {
        continue;
      }

      const customerId = dispatch.customer_id;

      if (!byCustomer.has(customerId)) {
        byCustomer.set(customerId, {
          customerId,

          customerName: dispatch.customers.name,

          dispatches: [],
        });
      }

      const group = byCustomer.get(customerId)!;

      const exists = group.dispatches.some((d) => d.orderId === dispatch.id);

      if (!exists) {
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

    // ─────────────────────────────────────────────
    // TIPO DOC
    // ─────────────────────────────────────────────
    const docType = await this.prisma.document_types.findUnique({
      where: {
        code: 'VEN',
      },

      include: {
        document_sequences: true,
      },
    });

    if (!docType) {
      throw new NotFoundException('Tipo de documento VEN no configurado');
    }

    // ─────────────────────────────────────────────
    // MONEDA BASE
    // ─────────────────────────────────────────────
    const baseCurrency = await this.prisma.currencies.findFirst({
      where: {
        is_base: true,
      },
    });

    if (!baseCurrency) {
      throw new NotFoundException('No hay moneda base configurada');
    }

    // ─────────────────────────────────────────────
    // EVITAR N+1
    // ─────────────────────────────────────────────
    const existingDocs = await this.prisma.documents.findMany({
      where: {
        ref: `TRIP-${tripId}`.substring(0, 50),

        status: {
          in: [STATUS_DRAFT, STATUS_PENDING],
        },
      },

      select: {
        party_id: true,
      },
    });

    const existingPartyIds = new Set(existingDocs.map((d) => d.party_id));

    let created = 0;

    let skipped = 0;

    // ─────────────────────────────────────────────
    // CREAR DOCUMENTOS
    // ─────────────────────────────────────────────
    for (const [, group] of byCustomer) {
      if (existingPartyIds.has(group.customerId)) {
        skipped++;

        continue;
      }

      const items: ItemInput[] = group.dispatches.flatMap((dispatch) =>
        dispatch.rates.map((rate) => ({
          product_id: null,

          quantity: 1,

          currency: baseCurrency.code,

          exchange_rate: 1,

          original_unit_price: rate.value,

          unit_price: rate.value,

          price: rate.value,

          exempt_amount: 0,

          taxable_base: rate.value,

          total_taxes: 0,

          total: rate.value,

          taxes: [],
        })),
      );

      const totals = this.totalsService.calculate(items);

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

            currency_code: baseCurrency.code,

            subtotal: totals.subtotal,

            exempt_amount: totals.exempt_amount,

            taxable_base: totals.taxable_base,

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

        // ─────────────────────────────────────────
        // CREAR ITEMS MASIVO
        // ─────────────────────────────────────────
        await tx.document_items.createMany({
          data: items.map((item) => ({
            document_id: document.id,

            product_id: item.product_id,

            quantity: item.quantity,

            unit_price: item.unit_price,

            original_unit_price: item.original_unit_price,

            currency_code: item.currency,

            exchange_rate: item.exchange_rate,

            price: item.price,
          })),
        });
      });

      created++;
    }

    return {
      created,

      skipped,
    };
  }
  // ─────────────────────────────────────────────
  // CONFIRM
  // ─────────────────────────────────────────────
  async confirm(id: string) {
    const doc = await this.findOne(id);

    if (doc.status === STATUS_CONFIRMED) {
      throw new BadRequestException('El documento ya está confirmado');
    }

    if (!doc.document_items.length) {
      throw new BadRequestException('El documento no tiene ítems');
    }

    return this.prisma.documents.update({
      where: { id },

      data: {
        status: STATUS_CONFIRMED,

        updated_at: new Date(),
      },
    });
  }

  // ─────────────────────────────────────────────
  // CANCEL
  // ─────────────────────────────────────────────
  async cancel(id: string) {
    const doc = await this.findOne(id);

    if (doc.status === STATUS_CANCELLED) {
      throw new BadRequestException('El documento ya está anulado');
    }

    return this.prisma.documents.update({
      where: { id },

      data: {
        status: STATUS_CANCELLED,

        updated_at: new Date(),
      },
    });
  }

  // ─────────────────────────────────────────────
  // REMOVE
  // ─────────────────────────────────────────────
  async remove(id: string) {
    const doc = await this.findOne(id);

    if (doc.status !== STATUS_DRAFT) {
      throw new BadRequestException('Solo se pueden eliminar borradores');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.document_item_taxes.deleteMany({
        where: {
          document_items: {
            document_id: id,
          },
        },
      });

      await tx.document_taxes.deleteMany({
        where: {
          document_id: id,
        },
      });

      await tx.document_items.deleteMany({
        where: {
          document_id: id,
        },
      });

      return tx.documents.delete({
        where: { id },
      });
    });
  }

  // ─────────────────────────────────────────────
  // NEXT NUMBER
  // ─────────────────────────────────────────────
  private async getNextNumber(
    documentTypeId: string,

    sequenceId: string | null,

    tx?: any,
  ): Promise<number> {
    const db = tx ?? this.prisma;

    if (!sequenceId) {
      const last = await db.documents.findFirst({
        where: {
          document_type_id: documentTypeId,
        },

        orderBy: {
          number: 'desc',
        },
      });

      return (last?.number ?? 0) + 1;
    }

    const seq = await db.document_sequences.update({
      where: {
        id: sequenceId,
      },

      data: {
        current_number: {
          increment: 1,
        },
      },
    });

    return seq.current_number;
  }

  // ─────────────────────────────────────────────
  // COMPLETED TRIPS
  // ─────────────────────────────────────────────
  async getAllCompletedTripIds(): Promise<string[]> {
    const trips = await this.prisma.trips.findMany({
      where: {
        status: 'COMPLETED',
      },

      select: {
        id: true,
      },
    });

    return trips.map((t) => t.id);
  }
}
