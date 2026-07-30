// src/modules/erp/documents-sales/documents_sales.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateDocumentDto } from '../documents/dto/create-document.dto';

import { UpdateDocumentDto } from '../documents/dto/update-document.dto';

import { DocumentsSalesTotalsService } from './documents-sales-totals.service';

import { CurrentAccountsService } from '../current-accounts/current-accounts.service';

import { TaxResolutionService } from '../tax-engine/services/tax-resolution.service';

import { TaxCalculationService } from '../tax-engine/services/tax-calculation.service';

import { getCurrentCompanyId } from '@/common/context/request-context.helpers';

import { ItemInput } from './interfaces/item-input.interface';

import type { TaxContext } from '../tax-engine/interfaces/tax-context.interface';

const STATUS_DRAFT = 0;

const STATUS_PENDING = 1;

const STATUS_CONFIRMED = 2;

const STATUS_CANCELLED = 3;

@Injectable()
export class DocumentsSalesService {

  constructor(
    private readonly db: PrismaService,

    private readonly totalsService: DocumentsSalesTotalsService,

    private readonly currentAccountsService: CurrentAccountsService,

    private readonly taxResolution: TaxResolutionService,

    private readonly taxCalculation: TaxCalculationService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateDocumentDto) {
    console.log('[SalesService] create() called with dto:', JSON.stringify(dto, null, 2))

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

    // ─── Validar compatibilidad emisor ↔ comprobante ──────────────
    const company = await this.db.getDefaultClient().companies.findUnique({
      where: { id: getCurrentCompanyId() ?? '' },
      select: { vat_condition: true },
    })

    if (company?.vat_condition && docType.letter_type) {
      const validLetters = this.getValidLetterTypes(company.vat_condition)
      if (validLetters.length > 0 && !validLetters.includes(docType.letter_type)) {
        throw new BadRequestException(
          `El comprobante "${docType.code}" (letter_type: ${docType.letter_type}) ` +
          `no es válido para un emisor "${company.vat_condition}". ` +
          `Use comprobantes con letter_type: ${validLetters.join(', ')}`
        )
      }
    }

    // ─── Validar compatibilidad emisor × receptor → letter_type ──
    if (company?.vat_condition && dto.party_id && docType.letter_type) {
      const partner = await this.db.getDefaultClient().business_parties.findUnique({
        where: { id: dto.party_id },
        select: { vat_condition: true },
      })

      if (partner?.vat_condition) {
        const expectedLetter = this.getExpectedLetterType(company.vat_condition, partner.vat_condition)
        if (expectedLetter && docType.letter_type !== expectedLetter) {
          throw new BadRequestException(
            `Para emisor "${company.vat_condition}" y receptor "${partner.vat_condition}", ` +
            `el comprobante debe ser letra ${expectedLetter} (usó letra ${docType.letter_type}).`
          )
        }
      }
    }

    // ─── Tax Engine: resolver impuestos ──────────────────────────
    console.log('[SalesService] Resolving taxes via Tax Engine...')

    const taxContext: TaxContext = {
      issuerCompanyId: getCurrentCompanyId() ?? '00000000-0000-0000-0000-000000000000',
      issuerVatCondition: company?.vat_condition ?? undefined,
      partnerId: dto.party_id ?? undefined,
      partnerVatCondition: undefined,
      documentTypeId: dto.document_type_id,
      documentLetterType: docType.letter_type ?? undefined,
      currency: dto.currency_code ?? 'ARS',
      date: dto.date,
      operationType: 'SALE',
      items: dto.items.map(i => ({
        productId: i.product_id,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unit_price),
      })),
    }

    const resolution = await this.taxResolution.resolve(taxContext)
    const calculation = this.taxCalculation.calculate(resolution, taxContext.items)

    console.log('[SalesService] Tax Engine result:', JSON.stringify(calculation.document, null, 2))

    // ─── Mapear resultado del Tax Engine a ItemInput[] ──────────
    const items: ItemInput[] = calculation.document.items.map((item, idx) => ({
      product_id: item.productId ?? null,
      quantity: item.quantity,
      currency: dto.currency_code ?? 'ARS',
      exchange_rate: 1,
      original_unit_price: item.unitPrice,
      unit_price: item.unitPrice,
      converted_unit_price: item.unitPrice,
      price: item.total,
      total: item.total,
      exempt_amount: item.exemptAmount,
      taxable_base: item.taxableBase,
      total_taxes: item.totalTaxes,
      taxes: item.taxes.map(t => ({
        tax_id: t.tax_id,
        tax_rate: t.rate,
        tax_amount: t.amount,
        calculation_level: 'line' as const,
        is_included_in_price: t.isIncludedInPrice,
      })),
    }))

    const totals = {
      subtotal: calculation.document.subtotal,
      exempt_amount: calculation.document.exemptAmount,
      taxable_base: calculation.document.taxableBase,
      total_taxes: calculation.document.totalTaxes,
      total: calculation.document.total,
      documentTaxes: calculation.document.documentTaxes.map(t => ({
        tax_id: t.tax_id,
        tax_rate: t.rate,
        taxable_base: t.taxableBase,
        tax_amount: t.amount,
      })),
    }

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
      throw new BadRequestException('No se puede modificar un documento confirmado');
    }

    if (doc.status === STATUS_CANCELLED) {
      throw new BadRequestException('No se puede modificar un documento anulado');
    }

    let items: ItemInput[] | null = null;

    let totals: any = null;

    if (dto.items?.length) {
      if (!dto.currency_code) {
        throw new BadRequestException('currency_code es requerido');
      }

      const docType = await this.prisma.document_types.findUnique({
        where: { id: doc.document_type_id },
      });

      const company = await this.db.getDefaultClient().companies.findUnique({
        where: { id: getCurrentCompanyId() ?? '' },
        select: { vat_condition: true },
      })

      const taxContext: TaxContext = {
        issuerCompanyId: getCurrentCompanyId() ?? '00000000-0000-0000-0000-000000000000',
        issuerVatCondition: company?.vat_condition ?? undefined,
        partnerId: dto.party_id ?? doc.party_id ?? undefined,
        partnerVatCondition: undefined,
        documentTypeId: doc.document_type_id,
        documentLetterType: docType?.letter_type ?? undefined,
        currency: dto.currency_code,
        date: dto.date ?? new Date(doc.date).toISOString(),
        operationType: 'SALE',
        items: dto.items.map(i => ({
          productId: i.product_id,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unit_price),
        })),
      };

      const resolution = await this.taxResolution.resolve(taxContext);
      const calculation = this.taxCalculation.calculate(resolution, taxContext.items);

      items = calculation.document.items.map((item) => ({
        product_id: item.productId ?? null,
        quantity: item.quantity,
        currency: dto.currency_code ?? 'ARS',
        exchange_rate: 1,
        original_unit_price: item.unitPrice,
        unit_price: item.unitPrice,
        converted_unit_price: item.unitPrice,
        price: item.total,
        total: item.total,
        exempt_amount: item.exemptAmount,
        taxable_base: item.taxableBase,
        total_taxes: item.totalTaxes,
        taxes: item.taxes.map(t => ({
          tax_id: t.tax_id,
          tax_rate: t.rate,
          tax_amount: t.amount,
          calculation_level: 'line' as const,
          is_included_in_price: t.isIncludedInPrice,
        })),
      }));

      totals = {
        subtotal: calculation.document.subtotal,
        exempt_amount: calculation.document.exemptAmount,
        taxable_base: calculation.document.taxableBase,
        total_taxes: calculation.document.totalTaxes,
        total: calculation.document.total,
        documentTaxes: calculation.document.documentTaxes.map(t => ({
          tax_id: t.tax_id,
          tax_rate: t.rate,
          taxable_base: t.taxableBase,
          tax_amount: t.amount,
        })),
      };
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

      const lineTaxes = item.taxes.filter((t) => t.calculation_level === 'line' && !t.is_included_in_price);

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
          direction: 1,
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
  // FIND PENDING (saldo pendiente de pago/cobro)
  // ─────────────────────────────────────────────
  async findPending(partyId?: string) {
    const docs = await this.prisma.documents.findMany({
      where: {
        document_types: {
          direction: 1,
        },
        status: 2,
        deleted_at: null,
        ...(partyId ? { party_id: partyId } : {}),
      },
      include: {
        document_types: { select: { code: true, description: true, direction: true } },
        business_parties: { select: { id: true, name: true, type: true } },
      },
      orderBy: { date: 'asc' },
    });

    return docs
      .map((d) => {
        const total = Number(d.total);
        const paid = Number(d.paid_amount);
        const pending = total - paid;
        return {
          id: d.id,
          number: d.number,
          date: d.date,
          total,
          paid_amount: paid,
          pending_amount: pending,
          currency_code: d.currency_code,
          party_id: d.party_id,
          party_name: d.business_parties?.name ?? null,
          party_type: d.business_parties?.type ?? null,
          document_type_code: d.document_types?.code ?? null,
          document_type_description: d.document_types?.description ?? null,
        };
      })
      .filter((d) => d.pending_amount > 0.01);
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
    overrideDocumentTypeId?: string,
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
    const docType = overrideDocumentTypeId
      ? await this.prisma.document_types.findUnique({
          where: { id: overrideDocumentTypeId },
          include: { document_sequences: true },
        })
      : await this.prisma.document_types.findUnique({
          where: { code: 'VEN' },
          include: { document_sequences: true },
        });

    if (!docType) {
      throw new NotFoundException('Tipo de documento no encontrado');
    }

    // ─────────────────────────────────────────────
    // IMPUESTOS DEL TIPO DE DOCUMENTO
    // ─────────────────────────────────────────────
    const docTypeTaxRows = await this.prisma.document_type_taxes.findMany({
      where: { document_type_id: docType.id },
      include: { taxes: true },
    });

    const docTypeTaxes = docTypeTaxRows.map((r) => ({
      tax_id: r.tax_id,
      tax_rate: Number(r.taxes.rate),
      calculation_level: r.taxes.calculation_level,
    }));

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
        dispatch.rates.map((rate) => {
          const taxes = docTypeTaxes.map((t) => ({
            tax_id: t.tax_id,
            tax_rate: t.tax_rate,
            tax_amount: Math.round(rate.value * (t.tax_rate / 100) * 100) / 100,
            calculation_level: t.calculation_level,
            is_included_in_price: false,
          }));

          const totalTaxes = taxes.reduce((acc, t) => acc + t.tax_amount, 0);

          return {
            product_id: null,
            quantity: 1,
            currency: baseCurrency.code,
            exchange_rate: 1,
            original_unit_price: rate.value,
            unit_price: rate.value,
            price: rate.value,
            exempt_amount: 0,
            taxable_base: rate.value,
            total_taxes: totalTaxes,
            total: rate.value + totalTaxes,
            taxes,
          };
        }),
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

            descrip: `V:${trip.reference_number ?? tripId.substring(0, 8)} ${group.customerName}`.substring(0, 50),
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
  async confirm(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const doc = await this.findOne(id);

      if (doc.status === STATUS_CONFIRMED) {
        throw new BadRequestException('El documento ya está confirmado');
      }

      if (!doc.document_items.length) {
        throw new BadRequestException('El documento no tiene ítems');
      }

      await tx.documents.update({
        where: { id },
        data: {
          status: STATUS_CONFIRMED,
          updated_at: new Date(),
        },
      });

      if (doc.party_id && doc.document_types?.affects_accounting) {
        let currencyCode = doc.currency_code;

        if (!currencyCode) {
          const baseCurrency = await tx.currencies.findFirst({ where: { is_base: true } });
          currencyCode = baseCurrency?.code ?? 'ARS';
        }

        const partyType = doc.document_types?.direction === 1 ? 'CUSTOMER' : 'SUPPLIER';
        const docTotal = doc.total.toNumber();

        // Determinar tipo de entrada según la categoría del documento
        const category = doc.document_types?.category;
        const entryType = category === 'CREDIT_NOTE' ? 'CREDIT_NOTE'
                        : category === 'DEBIT_NOTE' ? 'DEBIT_NOTE'
                        : 'INVOICE';

        const description = category === 'CREDIT_NOTE' ? `NC venta #${doc.number}`
                          : category === 'DEBIT_NOTE' ? `ND venta #${doc.number}`
                          : `Factura venta #${doc.number}`;

        await this.currentAccountsService.addEntry(
          {
            party_id: doc.party_id,
            party_type: partyType,
            currency_code: currencyCode,
            type: entryType,
            amount: docTotal,
            description,
            reference_type: 'document',
            reference_id: doc.id,
          },
          userId,
        );
      }

      return tx.documents.findUnique({
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
    });
  }

  // ─────────────────────────────────────────────
  // CANCEL
  // ─────────────────────────────────────────────
  async cancel(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const doc = await this.findOne(id);

      if (doc.status === STATUS_CANCELLED) {
        throw new BadRequestException('El documento ya está anulado');
      }

      // Validar que no existan pagos activos asociados al documento
      const associatedPayments = await tx.payment_documents.findMany({
        where: { document_id: id },
        include: { payments: true },
      });

      const activePayments = associatedPayments.filter(
        ap => ap.payments.status === 'CONFIRMED' || ap.payments.status === 'PAID'
      );

      if (activePayments.length > 0) {
        throw new BadRequestException(
          'No se puede anular el documento porque tiene pagos asociados. Primero anule los pagos.'
        );
      }

      await tx.documents.update({
        where: { id },
        data: {
          status: STATUS_CANCELLED,
          updated_at: new Date(),
        },
      });

      // Revertir entrada de cuenta corriente solo si el tipo afecta contabilidad
      console.log('[cancel] doc.party_id:', doc.party_id)
      console.log('[cancel] affects_accounting:', doc.document_types?.affects_accounting)
      console.log('[cancel] would create entry:', !!(doc.party_id && doc.document_types?.affects_accounting))

      if (doc.party_id && doc.document_types?.affects_accounting) {
        const partyType = doc.document_types?.direction === 1 ? 'CUSTOMER' : 'SUPPLIER';
        const docTotal = doc.total.toNumber();

        // La reversión siempre es CREDIT_NOTE para ventas
        // (incluso si el original era DEBIT_NOTE, la anulación es crédito)
        const category = doc.document_types?.category;
        const description = category === 'CREDIT_NOTE' ? `Anulación NC venta #${doc.number}`
                          : category === 'DEBIT_NOTE' ? `Anulación ND venta #${doc.number}`
                          : `Anulación factura venta #${doc.number}`;

        await this.currentAccountsService.addEntry(
          {
            party_id: doc.party_id,
            party_type: partyType,
            currency_code: doc.currency_code,
            type: 'CREDIT_NOTE',
            amount: docTotal,
            description,
            reference_type: 'document_reversal',
            reference_id: doc.id,
          },
          userId,
        );
      }

      return tx.documents.findUnique({ where: { id } });
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

  // ─────────────────────────────────────────────
  // GET COMPLETED TRIPS PENDING INVOICING
  // ─────────────────────────────────────────────
  async getCompletedTripsPending() {
    const completedTrips = await this.prisma.trips.findMany({
      where: { status: 'COMPLETED' },
      select: {
        id: true,
        reference_number: true,
        status: true,
      },
    });

    const results: {
      id: string;
      reference_number: string | null;
      total_orders: number;
      total_amount: number;
    }[] = [];

    for (const trip of completedTrips) {
      const existingDocs = await this.prisma.documents.findMany({
        where: {
          ref: `TRIP-${trip.id}`.substring(0, 50),
          status: { in: [STATUS_DRAFT, STATUS_PENDING, STATUS_CONFIRMED] },
        },
        select: { id: true },
      });

      if (existingDocs.length > 0) continue;

      const tripOrders = await this.prisma.trip_stop_orders.findMany({
        where: { trip_stop: { trip_id: trip.id } },
        select: {
          dispatch_order: {
            select: {
              dispatch_rates: {
                select: { value: true },
              },
            },
          },
        },
      });

      const totalAmount = tripOrders.reduce((acc, row) => {
        const rates = row.dispatch_order?.dispatch_rates ?? [];
        return acc + rates.reduce((sum, r) => sum + Number(r.value), 0);
      }, 0);

      results.push({
        id: trip.id,
        reference_number: trip.reference_number,
        total_orders: tripOrders.length,
        total_amount: totalAmount,
      });
    }

    return results;
  }

  // ─────────────────────────────────────────────
  // GENERATE FROM SELECTED TRIPS
  // ─────────────────────────────────────────────
  async generateFromSelectedTrips(
    tripIds: string[],
    documentTypeId: string,
  ): Promise<{ results: { tripId: string; created: number; skipped: number }[] }> {
    const docType = await this.prisma.document_types.findUnique({
      where: { id: documentTypeId },
      select: { id: true, code: true, direction: true },
    });

    if (!docType) {
      throw new NotFoundException('Tipo de documento no encontrado');
    }

    const results: { tripId: string; created: number; skipped: number }[] = [];

    for (const tripId of tripIds) {
      const result = await this.generateDraftsFromTrip(tripId, documentTypeId);
      results.push({ tripId, created: result.created, skipped: result.skipped });
    }

    return { results };
  }

  private getValidLetterTypes(issuerCondition: string): string[] {
    const map: Record<string, string[]> = {
      'RESPONSABLE_INSCRIPTO': ['A', 'B'],
      'MONOTRIBUTO': ['C'],
      'EXENTO': ['C'],
    }
    return map[issuerCondition] ?? []
  }

  /**
   * Matriz emisor × receptor → letra esperada
   * RI + RI → A
   * RI + Mono/CF/Exento → B
   * Mono/Exento + * → C
   */
  private getExpectedLetterType(issuer: string, partner: string): string | null {
    const issuerNorm = issuer.toUpperCase()
    if (issuerNorm === 'MONOTRIBUTO' || issuerNorm === 'EXENTO') return 'C'

    const partnerNorm = partner.toUpperCase()
    if (partnerNorm === 'RI' || partnerNorm === 'RESPONSABLE_INSCRIPTO') return 'A'
    return 'B'
  }
}
