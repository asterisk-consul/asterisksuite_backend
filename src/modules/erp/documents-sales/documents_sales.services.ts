// src/modules/erp/documents-sales/documents_sales.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateDocumentDto } from '../documents/dto/create-document.dto';

import { UpdateDocumentDto } from '../documents/dto/update-document.dto';

import { DocumentsSalesTotalsService } from './documents-sales-totals.service';

import { CurrentAccountsService } from '../current-accounts/current-accounts.service';

import { TaxResolutionService } from '../tax-engine/services/tax-resolution.service';

import { TaxCalculationService } from '../tax-engine/services/tax-calculation.service';

import { CurrencyConversionService } from '../currencies/currency-conversion.service';

import { FiscalValidationService } from '@/common/services/fiscal-validation.service';

import { getCurrentCompanyId } from '@/common/context/request-context.helpers';

import { ItemInput } from './interfaces/item-input.interface';

import type { TaxContext } from '../tax-engine/interfaces/tax-context.interface';

import { Prisma } from '@/generated/prisma/client';

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

    private readonly conversionService: CurrencyConversionService,

    private readonly fiscalValidation: FiscalValidationService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateDocumentDto) {
    console.log('[SalesService] create() called with dto:', JSON.stringify(dto, null, 2))

    const dtoItems = dto.items ?? []

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

    // ─── Validar contexto fiscal (emisor × receptor) ───────────
    const fiscalCtx = await this.fiscalValidation.resolveFiscalContext({
      direction: 'SALE',
      partyId: dto.party_id,
      documentLetterType: docType.letter_type ?? undefined,
    })

    // ─── Tax Engine: resolver impuestos ──────────────────────────
    console.log('[SalesService] Resolving taxes via Tax Engine...')

    const taxContext: TaxContext = {
      issuerCompanyId: getCurrentCompanyId() ?? '00000000-0000-0000-0000-000000000000',
      issuerVatCondition: fiscalCtx.issuerVatCondition || undefined,
      partnerId: dto.party_id ?? undefined,
      partnerVatCondition: fiscalCtx.partnerVatCondition || undefined,
      documentTypeId: dto.document_type_id,
      documentLetterType: docType.letter_type ?? undefined,
      currency: dto.currency_code ?? 'ARS',
      date: dto.date,
      operationType: 'SALE',
      items: dtoItems.map(i => ({
        productId: i.product_id,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unit_price),
      })),
    }

    const resolution = await this.taxResolution.resolve(taxContext)
    const calculation = this.taxCalculation.calculate(resolution, taxContext.items)

    console.log('[SalesService] Tax Engine result:', JSON.stringify(calculation.document, null, 2))

    // ─── Resolver exchange rate ──────────────────────────────────
    const currencyCode = dto.currency_code ?? 'ARS'
    const baseCurrency = await this.conversionService.getBaseCurrency()
    const isBase = currencyCode.toUpperCase() === baseCurrency.code.toUpperCase()

    let exchangeRate = dto.exchange_rate ?? 1
    let rateType = (dto.rate_type as any) ?? null

    // For fiscal documents (A/B/C), force OFFICIAL
    if (docType.letter_type && ['A', 'B', 'C'].includes(docType.letter_type)) {
      rateType = 'OFFICIAL'
    }

    if (!isBase && !dto.exchange_rate) {
      try {
        const resolved = await this.conversionService.resolveRate(
          currencyCode,
          baseCurrency.code,
          new Date(dto.date),
          rateType,
        )
        exchangeRate = resolved.rate
        rateType = resolved.rateType
      } catch {
        // If no rate found, default to 1 (will be ARS equivalent)
        exchangeRate = 1
      }
    }

    // ─── Mapear resultado del Tax Engine a ItemInput[] ──────────
    const items: ItemInput[] = calculation.document.items.map((item, idx) => {
      const convertedUnitPrice = isBase ? null : this.conversionService.convertAmount(item.unitPrice, exchangeRate)
      const convertedPrice = isBase ? null : this.conversionService.convertAmount(item.total, exchangeRate)

      return {
        product_id: item.productId ?? null,
        quantity: item.quantity,
        currency: currencyCode,
        exchange_rate: exchangeRate,
        rate_type: rateType,
        original_unit_price: item.unitPrice,
        unit_price: item.unitPrice,
        converted_unit_price: convertedUnitPrice,
        price: item.total,
        total: item.total,
        exempt_amount: item.exemptAmount,
        taxable_base: item.taxableBase,
        total_taxes: item.totalTaxes,
        taxes: item.taxes.map(t => ({
          tax_id: t.tax_id,
          tax_rate: t.rate,
          tax_amount: t.amount,
          converted_tax_amount: isBase ? null : this.conversionService.convertAmount(t.amount, exchangeRate),
          calculation_level: 'line' as const,
          is_included_in_price: t.isIncludedInPrice,
        })),
      }
    })

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

    // ─── OPENING_BALANCE: usar dto.total directamente ────────────
    if (docType.category === 'OPENING_BALANCE' && dto.total) {
      totals.subtotal = dto.subtotal ?? dto.total
      totals.total = dto.total
      totals.exempt_amount = dto.total
      totals.taxable_base = 0
      totals.total_taxes = 0
      totals.documentTaxes = []
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

          exchange_rate: exchangeRate,

          rate_type: rateType,

          subtotal: totals.subtotal,

          exempt_amount: totals.exempt_amount,

          taxable_base: totals.taxable_base,

          total_taxes: totals.total_taxes,

          total: totals.total,

          descrip: dto.descrip ?? null,

          ref: dto.ref ?? null,

          validity_date: dto.validity_date ? new Date(dto.validity_date) : null,

          ...(!isBase ? await this.conversionService.convertDocumentFields(
            currencyCode,
            exchangeRate,
            rateType,
            {
              subtotal: Number(totals.subtotal),
              exempt_amount: Number(totals.exempt_amount),
              total_taxes: Number(totals.total_taxes),
              total: Number(totals.total),
              taxable_base: Number(totals.taxable_base),
            },
            new Date(dto.date),
          ) : {}),
        },
      });

      createdId = document.id;

      // ─── Crear extensión según categoría ────────────────────────
      if (docType.category === 'QUOTE') {
        await tx.presupuesto_documents.create({
          data: {
            document_id: document.id,
            validity_date: dto.validity_date ? new Date(dto.validity_date) : null,
            warranty_info: dto.warranty_info ?? null,
            exclusions: dto.exclusions ?? null,
            commercial_notes: dto.commercial_notes ?? null,
            internal_notes: dto.internal_notes ?? null,
            terms_and_conditions: dto.terms_and_conditions ?? null,
          },
        });
      }

      if (docType.category === 'ORDER') {
        await tx.orden_venta_documents.create({
          data: {
            document_id: document.id,
            priority: dto.priority ?? null,
            delivery_address: dto.delivery_address ?? null,
            delivery_contact: dto.delivery_contact ?? null,
            delivery_phone: dto.delivery_phone ?? null,
            delivery_time: dto.delivery_time ?? null,
            delivery_instructions: dto.delivery_instructions ?? null,
            transport_provider: dto.transport_provider ?? null,
            confirmed_delivery_date: dto.confirmed_delivery_date ? new Date(dto.confirmed_delivery_date) : null,
            seller_id: dto.seller_id ?? null,
          },
        });
      }

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

            converted_taxable_base: isBase ? null : this.conversionService.convertAmount(t.taxable_base, exchangeRate),

            converted_tax_amount: isBase ? null : this.conversionService.convertAmount(t.tax_amount, exchangeRate),
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

    // ─── Resolver exchange rate for update ────────────────────
    const updateCurrencyCode = dto.currency_code ?? doc.currency_code ?? 'ARS'
    const updateBaseCurrency = await this.conversionService.getBaseCurrency()
    const updateIsBase = updateCurrencyCode.toUpperCase() === updateBaseCurrency.code.toUpperCase()

    let updateExchangeRate = dto.exchange_rate ?? Number(doc.exchange_rate) ?? 1
    let updateRateType = (dto.rate_type as any) ?? doc.rate_type ?? null

    if (dto.items?.length) {
      if (!dto.currency_code) {
        throw new BadRequestException('currency_code es requerido');
      }

      const docType = await this.prisma.document_types.findUnique({
        where: { id: doc.document_type_id },
      });

      const partnerId = dto.party_id ?? doc.party_id
      const fiscalCtx = await this.fiscalValidation.resolveFiscalContext({
        direction: 'SALE',
        partyId: partnerId,
        documentLetterType: docType?.letter_type ?? undefined,
      })

      const taxContext: TaxContext = {
        issuerCompanyId: getCurrentCompanyId() ?? '00000000-0000-0000-0000-000000000000',
        issuerVatCondition: fiscalCtx.issuerVatCondition || undefined,
        partnerId: partnerId ?? undefined,
        partnerVatCondition: fiscalCtx.partnerVatCondition || undefined,
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

      // For fiscal documents (A/B/C), force OFFICIAL
      if (docType?.letter_type && ['A', 'B', 'C'].includes(docType.letter_type)) {
        updateRateType = 'OFFICIAL'
      }

      if (!updateIsBase && !dto.exchange_rate) {
        try {
          const resolved = await this.conversionService.resolveRate(
            updateCurrencyCode,
            updateBaseCurrency.code,
            new Date(dto.date ?? doc.date),
            updateRateType,
          )
          updateExchangeRate = resolved.rate
          updateRateType = resolved.rateType
        } catch {
          updateExchangeRate = 1
        }
      }

      items = calculation.document.items.map((item) => {
        const convertedUnitPrice = updateIsBase ? null : this.conversionService.convertAmount(item.unitPrice, updateExchangeRate)
        const convertedPrice = updateIsBase ? null : this.conversionService.convertAmount(item.total, updateExchangeRate)

        return {
          product_id: item.productId ?? null,
          quantity: item.quantity,
          currency: updateCurrencyCode,
          exchange_rate: updateExchangeRate,
          rate_type: updateRateType,
          original_unit_price: item.unitPrice,
          unit_price: item.unitPrice,
          converted_unit_price: convertedUnitPrice,
          price: item.total,
          converted_price: convertedPrice,
          total: item.total,
          exempt_amount: item.exemptAmount,
          taxable_base: item.taxableBase,
          total_taxes: item.totalTaxes,
          taxes: item.taxes.map(t => ({
            tax_id: t.tax_id,
            tax_rate: t.rate,
            tax_amount: t.amount,
            converted_tax_amount: updateIsBase ? null : this.conversionService.convertAmount(t.amount, updateExchangeRate),
            calculation_level: 'line' as const,
            is_included_in_price: t.isIncludedInPrice,
          })),
        }
      });

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

              converted_taxable_base: updateIsBase ? null : this.conversionService.convertAmount(t.taxable_base, updateExchangeRate),

              converted_tax_amount: updateIsBase ? null : this.conversionService.convertAmount(t.tax_amount, updateExchangeRate),
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

          currency_code: updateCurrencyCode,

          exchange_rate: updateExchangeRate,

          rate_type: updateRateType,

          subtotal: totals?.subtotal ?? Number(doc.subtotal),

          exempt_amount: totals?.exempt_amount ?? Number(doc.exempt_amount),

          taxable_base: totals?.taxable_base ?? Number(doc.taxable_base),

          total_taxes: totals?.total_taxes ?? Number(doc.total_taxes),

          total: totals?.total ?? Number(doc.total),

          descrip: dto.descrip ?? doc.descrip,

          ref: dto.ref ?? doc.ref,

          updated_at: new Date(),

          ...(!updateIsBase && totals ? await this.conversionService.convertDocumentFields(
            updateCurrencyCode,
            updateExchangeRate,
            updateRateType,
            {
              subtotal: Number(totals.subtotal),
              exempt_amount: Number(totals.exempt_amount),
              total_taxes: Number(totals.total_taxes),
              total: Number(totals.total),
              taxable_base: Number(totals.taxable_base),
            },
            new Date(dto.date ?? doc.date),
          ) : {}),
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

          rate_type: item.rate_type ?? null,

          converted_unit_price: item.converted_unit_price ?? null,

          converted_price: item.converted_price ?? null,

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

            converted_tax_amount: t.converted_tax_amount ?? null,
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

    category?: string,
  ) {
    return this.prisma.documents.findMany({
      where: {
        document_types: {
          direction: 1,

          ...(category ? { category } : {}),
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
  async findPending(partyId?: string, categories?: string[]) {
    const cats = categories ?? ['INVOICE']

    const docs = await this.prisma.documents.findMany({
      where: {
        document_types: {
          direction: 1,
          category: { in: cats },
        },
        status: 2,
        deleted_at: null,
        ...(partyId ? { party_id: partyId } : {}),
      },
      include: {
        document_types: { select: { code: true, description: true, direction: true, category: true } },
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
          exchange_rate: d.exchange_rate ? Number(d.exchange_rate) : null,
          rate_type: d.rate_type ?? null,
          converted_total: d.converted_total ? Number(d.converted_total) : null,
          party_id: d.party_id,
          party_name: d.business_parties?.name ?? null,
          party_type: d.business_parties?.type ?? null,
          document_type_code: d.document_types?.code ?? null,
          document_type_description: d.document_types?.description ?? null,
          document_type_category: d.document_types?.category ?? null,
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

        parent_document: {
          select: {
            id: true,
            number: true,
            descrip: true,
            status: true,
            document_types: { select: { code: true, description: true, category: true } },
          },
        },

        child_documents: {
          select: {
            id: true,
            number: true,
            descrip: true,
            status: true,
            total: true,
            document_types: { select: { code: true, description: true, category: true } },
          },
          orderBy: { created_at: 'asc' },
        },

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

        presupuesto_doc: true,
        orden_venta_doc: true,
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

      const category = doc.document_types?.category;

      if (!doc.document_items.length && category !== 'OPENING_BALANCE') {
        throw new BadRequestException('El documento no tiene ítems');
      }

      await tx.documents.update({
        where: { id },
        data: {
          status: STATUS_CONFIRMED,
          updated_at: new Date(),
        },
      });

      // ─── Stock automático si affects_stock ──────────────────────
      if (doc.document_types?.affects_stock) {
        const direction = doc.document_types.direction === 1 ? 'OUT' : 'IN';

        for (const item of doc.document_items) {
          if (!item.product_id) continue;

          // Buscar un almacén por defecto (el primero activo)
          const warehouse = await tx.warehouses.findFirst({ where: { active: true } });
          if (!warehouse) continue;

          const qty = new Prisma.Decimal(item.quantity);
          const signedQty = direction === 'IN' ? qty : qty.neg();

          // Crear movimiento de stock
          await tx.warehouse_stock_movements.create({
            data: {
              warehouse_id: warehouse.id,
              product_id: item.product_id,
              movement_type: 'DOCUMENT',
              direction,
              quantity: qty,
              reference_type: 'document',
              reference_id: doc.id,
              created_by: userId,
            },
          });

          // Actualizar stock
          const stock = await tx.warehouse_stock.findUnique({
            where: {
              warehouse_id_product_id: {
                warehouse_id: warehouse.id,
                product_id: item.product_id,
              },
            },
          });

          if (!stock) {
            if (direction === 'OUT') {
              throw new BadRequestException(`No hay stock para el producto ${item.product_id}`);
            }
            await tx.warehouse_stock.create({
              data: {
                warehouse_id: warehouse.id,
                product_id: item.product_id,
                quantity: qty,
              },
            });
          } else {
            const newQty = stock.quantity.plus(signedQty);
            if (newQty.isNegative()) {
              throw new BadRequestException(`Stock negativo no permitido para producto ${item.product_id}`);
            }
            await tx.warehouse_stock.update({
              where: { id: stock.id },
              data: { quantity: newQty, updated_at: new Date() },
            });
          }
        }
      }

      // ─── Cuenta corriente si affects_accounting ─────────────────
      if (doc.party_id && doc.document_types?.affects_accounting) {
        let currencyCode = doc.currency_code;

        if (!currencyCode) {
          const baseCurrency = await tx.currencies.findFirst({ where: { is_base: true } });
          currencyCode = baseCurrency?.code ?? 'ARS';
        }

        const partyType = doc.document_types?.direction === 1 ? 'CUSTOMER' : 'SUPPLIER';
        const docTotal = doc.total.toNumber();

        const entryType = category === 'CREDIT_NOTE' ? 'CREDIT_NOTE'
                        : category === 'DEBIT_NOTE' ? 'DEBIT_NOTE'
                        : category === 'OPENING_BALANCE' ? 'OPENING_BALANCE'
                        : 'INVOICE';

        const docTypeName = doc.document_types?.description ?? 'Documento';
        const docRef = doc.descrip;
        const description = docRef
          ? `${docTypeName} #${doc.number} - ${docRef}`
          : `${docTypeName} #${doc.number}`;

        await this.currentAccountsService.addEntry(
          {
            party_id: doc.party_id,
            party_type: partyType,
            currency_code: currencyCode,
            type: entryType,
            amount: docTotal,
            exchange_rate: doc.exchange_rate ? Number(doc.exchange_rate) : undefined,
            rate_type: doc.rate_type ?? undefined,
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
        const docTypeName = doc.document_types?.description ?? 'Documento';
        const docRef = doc.descrip;
        const baseDesc = docRef
          ? `${docTypeName} #${doc.number} - ${docRef}`
          : `${docTypeName} #${doc.number}`;
        const description = `Anulación ${baseDesc}`;

        await this.currentAccountsService.addEntry(
          {
            party_id: doc.party_id,
            party_type: partyType,
            currency_code: doc.currency_code,
            type: 'CREDIT_NOTE',
            amount: docTotal,
            exchange_rate: doc.exchange_rate ? Number(doc.exchange_rate) : undefined,
            rate_type: doc.rate_type ?? undefined,
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
  // ACCEPT (QUOTE → ORDER)
  // ─────────────────────────────────────────────
  async accept(id: string, userId: string) {
    const doc = await this.findOne(id);

    if (doc.status !== STATUS_CONFIRMED) {
      throw new BadRequestException('El presupuesto debe estar confirmado para aceptarlo');
    }

    // Buscar tipo de documento ORDER con la misma dirección
    const orderType = await this.prisma.document_types.findFirst({
      where: {
        category: 'ORDER',
        direction: doc.document_types.direction,
        active: true,
      },
      include: { document_sequences: true },
    });

    if (!orderType) {
      throw new NotFoundException('No hay tipo de documento "Orden" configurado. Creelo en Settings → Document Types.');
    }

    // Copiar items del presupuesto
    const items: ItemInput[] = doc.document_items.map((item) => ({
      product_id: item.product_id,
      quantity: Number(item.quantity),
      currency: item.currency_code ?? doc.currency_code ?? 'ARS',
      exchange_rate: Number(item.exchange_rate ?? 1),
      original_unit_price: Number(item.original_unit_price ?? item.unit_price),
      unit_price: Number(item.unit_price),
      converted_unit_price: Number(item.unit_price),
      price: Number(item.price),
      total: Number(item.price),
      exempt_amount: 0,
      taxable_base: Number(item.price),
      total_taxes: 0,
      taxes: [],
    }));

    const totals = this.totalsService.calculate(items);
    let createdId = '';

    await this.prisma.$transaction(async (tx) => {
      const number = await this.getNextNumber(orderType.id, orderType.document_sequences?.id ?? null, tx);

      const newDoc = await tx.documents.create({
        data: {
          document_type_id: orderType.id,
          party_id: doc.party_id,
          parent_document_id: doc.id,
          number,
          date: new Date(),
          status: STATUS_DRAFT,
          currency_code: doc.currency_code,
          subtotal: totals.subtotal,
          exempt_amount: totals.exempt_amount,
          taxable_base: totals.taxable_base,
          total_taxes: totals.total_taxes,
          total: totals.total,
          descrip: doc.descrip,
          ref: `PRES-${doc.number}`,
        },
      });

      createdId = newDoc.id;

      await this.persistItems(newDoc.id, items, tx);

      // Actualizar presupuesto a "Convertido" (status 5)
      await tx.documents.update({
        where: { id: doc.id },
        data: { status: 5, updated_at: new Date() },
      });
    });

    return this.findOne(createdId);
  }

  // ─────────────────────────────────────────────
  // DELIVER (ORDER → REMITO)
  // ─────────────────────────────────────────────
  async deliver(id: string, userId: string) {
    const doc = await this.findOne(id);

    if (doc.status !== STATUS_CONFIRMED) {
      throw new BadRequestException('La orden debe estar confirmada para despachar');
    }

    // Buscar tipo de documento REMITO con la misma dirección
    const remitoType = await this.prisma.document_types.findFirst({
      where: {
        category: 'REMITO',
        direction: doc.document_types.direction,
        active: true,
      },
      include: { document_sequences: true },
    });

    if (!remitoType) {
      throw new NotFoundException('No hay tipo de documento "Remito" configurado. Creelo en Settings → Document Types.');
    }

    // Copiar items de la orden
    const items: ItemInput[] = doc.document_items.map((item) => ({
      product_id: item.product_id,
      quantity: Number(item.quantity),
      currency: item.currency_code ?? doc.currency_code ?? 'ARS',
      exchange_rate: Number(item.exchange_rate ?? 1),
      original_unit_price: Number(item.original_unit_price ?? item.unit_price),
      unit_price: Number(item.unit_price),
      converted_unit_price: Number(item.unit_price),
      price: Number(item.price),
      total: Number(item.price),
      exempt_amount: 0,
      taxable_base: Number(item.price),
      total_taxes: 0,
      taxes: [],
    }));

    const totals = this.totalsService.calculate(items);
    let createdId = '';

    await this.prisma.$transaction(async (tx) => {
      const number = await this.getNextNumber(remitoType.id, remitoType.document_sequences?.id ?? null, tx);

      const newDoc = await tx.documents.create({
        data: {
          document_type_id: remitoType.id,
          party_id: doc.party_id,
          parent_document_id: doc.id,
          number,
          date: new Date(),
          status: STATUS_DRAFT,
          currency_code: doc.currency_code,
          subtotal: totals.subtotal,
          exempt_amount: totals.exempt_amount,
          taxable_base: totals.taxable_base,
          total_taxes: totals.total_taxes,
          total: totals.total,
          descrip: doc.descrip,
          ref: `OV-${doc.number}`,
          delivery_date: new Date(),
        },
      });

      createdId = newDoc.id;

      await this.persistItems(newDoc.id, items, tx);

      // Actualizar OV a "Entregada" (status 5)
      await tx.documents.update({
        where: { id: doc.id },
        data: { status: 5, updated_at: new Date() },
      });
    });

    return this.findOne(createdId);
  }

  // ─────────────────────────────────────────────
  // PARTIAL DELIVER (OV → Remito parcial)
  // ─────────────────────────────────────────────
  async partialDeliver(id: string, items: { document_item_id: string; quantity: number }[], userId: string) {
    const doc = await this.findOne(id);

    if (doc.status !== STATUS_CONFIRMED && doc.status !== 1) {
      throw new BadRequestException('La orden debe estar confirmada o aprobada para despachar');
    }

    // Buscar tipo REMITO
    const remitoType = await this.prisma.document_types.findFirst({
      where: { category: 'REMITO', direction: doc.document_types.direction, active: true },
      include: { document_sequences: true },
    });

    if (!remitoType) {
      throw new NotFoundException('No hay tipo de documento "Remito" configurado');
    }

    // Validar cantidades
    const sourceItems = doc.document_items;
    for (const req of items) {
      const sourceItem = sourceItems.find(i => i.id === req.document_item_id);
      if (!sourceItem) throw new BadRequestException(`Item ${req.document_item_id} no encontrado en la OV`);
      const alreadyDelivered = Number(sourceItem.quantity_delivered ?? 0);
      const pending = Number(sourceItem.quantity) - alreadyDelivered;
      if (req.quantity > pending) {
        throw new BadRequestException(`Cantidad ${req.quantity} excede el pendiente (${pending}) para item ${sourceItem.product_id}`);
      }
    }

    // Crear remito con solo los items indicados
    const remitoItems: ItemInput[] = items.map(req => {
      const sourceItem = sourceItems.find(i => i.id === req.document_item_id)!;
      return {
        product_id: sourceItem.product_id,
        quantity: req.quantity,
        currency: sourceItem.currency_code ?? doc.currency_code ?? 'ARS',
        exchange_rate: Number(sourceItem.exchange_rate ?? 1),
        original_unit_price: Number(sourceItem.original_unit_price ?? sourceItem.unit_price),
        unit_price: Number(sourceItem.unit_price),
        converted_unit_price: Number(sourceItem.unit_price),
        price: Number(sourceItem.unit_price) * req.quantity,
        total: Number(sourceItem.unit_price) * req.quantity,
        exempt_amount: 0,
        taxable_base: Number(sourceItem.unit_price) * req.quantity,
        total_taxes: 0,
        taxes: [],
      };
    });

    const totals = this.totalsService.calculate(remitoItems);
    let createdId = '';

    await this.prisma.$transaction(async (tx) => {
      const number = await this.getNextNumber(remitoType.id, remitoType.document_sequences?.id ?? null, tx);

      const newDoc = await tx.documents.create({
        data: {
          document_type_id: remitoType.id,
          party_id: doc.party_id,
          parent_document_id: doc.id,
          number,
          date: new Date(),
          status: STATUS_DRAFT,
          currency_code: doc.currency_code,
          subtotal: totals.subtotal,
          exempt_amount: totals.exempt_amount,
          taxable_base: totals.taxable_base,
          total_taxes: totals.total_taxes,
          total: totals.total,
          descrip: doc.descrip,
          ref: `OV-${doc.number}`,
          delivery_date: new Date(),
        },
      });

      createdId = newDoc.id;

      await this.persistItems(newDoc.id, remitoItems, tx);

      // Actualizar tracking en items de la OV
      for (const req of items) {
        const sourceItem = sourceItems.find(i => i.id === req.document_item_id)!;
        const newDelivered = Number(sourceItem.quantity_delivered ?? 0) + req.quantity;
        await tx.document_items.update({
          where: { id: req.document_item_id },
          data: { quantity_delivered: newDelivered },
        });
      }

      // Verificar si todos los items fueron entregados
      const allItems = await tx.document_items.findMany({ where: { document_id: id } });
      const allDelivered = allItems.every(i => Number(i.quantity_delivered ?? 0) >= Number(i.quantity));
      if (allDelivered) {
        await tx.documents.update({ where: { id }, data: { status: 5 } }); // ENTREGADA
      } else {
        await tx.documents.update({ where: { id }, data: { status: 4 } }); // PARCIAL_ENTREGADA
      }
    });

    return this.findOne(createdId);
  }

  // ─────────────────────────────────────────────
  // PARTIAL INVOICE (OV → Factura parcial)
  // ─────────────────────────────────────────────
  async partialInvoice(id: string, items: { document_item_id: string; quantity: number }[], userId: string) {
    const doc = await this.findOne(id);

    if (doc.status < 1) {
      throw new BadRequestException('La orden debe estar aprobada para facturar');
    }

    // Buscar tipo INVOICE
    const invoiceType = await this.prisma.document_types.findFirst({
      where: { category: 'INVOICE', direction: doc.document_types.direction, active: true },
      include: { document_sequences: true },
    });

    if (!invoiceType) {
      throw new NotFoundException('No hay tipo de documento "Factura" configurado');
    }

    // Validar cantidades
    const sourceItems = doc.document_items;
    for (const req of items) {
      const sourceItem = sourceItems.find(i => i.id === req.document_item_id);
      if (!sourceItem) throw new BadRequestException(`Item ${req.document_item_id} no encontrado`);
      const alreadyInvoiced = Number(sourceItem.quantity_invoiced ?? 0);
      const pending = Number(sourceItem.quantity) - alreadyInvoiced;
      if (req.quantity > pending) {
        throw new BadRequestException(`Cantidad ${req.quantity} excede el pendiente (${pending})`);
      }
    }

    // Crear factura con items seleccionados
    const invoiceItems: ItemInput[] = items.map(req => {
      const sourceItem = sourceItems.find(i => i.id === req.document_item_id)!;
      return {
        product_id: sourceItem.product_id,
        quantity: req.quantity,
        currency: sourceItem.currency_code ?? doc.currency_code ?? 'ARS',
        exchange_rate: Number(sourceItem.exchange_rate ?? 1),
        original_unit_price: Number(sourceItem.original_unit_price ?? sourceItem.unit_price),
        unit_price: Number(sourceItem.unit_price),
        converted_unit_price: Number(sourceItem.unit_price),
        price: Number(sourceItem.unit_price) * req.quantity,
        total: Number(sourceItem.unit_price) * req.quantity,
        exempt_amount: 0,
        taxable_base: Number(sourceItem.unit_price) * req.quantity,
        total_taxes: 0,
        taxes: [],
      };
    });

    const totals = this.totalsService.calculate(invoiceItems);
    let createdId = '';

    await this.prisma.$transaction(async (tx) => {
      const number = await this.getNextNumber(invoiceType.id, invoiceType.document_sequences?.id ?? null, tx);

      const newDoc = await tx.documents.create({
        data: {
          document_type_id: invoiceType.id,
          party_id: doc.party_id,
          parent_document_id: doc.id,
          number,
          date: new Date(),
          status: STATUS_DRAFT,
          currency_code: doc.currency_code,
          subtotal: totals.subtotal,
          exempt_amount: totals.exempt_amount,
          taxable_base: totals.taxable_base,
          total_taxes: totals.total_taxes,
          total: totals.total,
          descrip: doc.descrip,
          ref: `OV-${doc.number}`,
        },
      });

      createdId = newDoc.id;

      await this.persistItems(newDoc.id, invoiceItems, tx);

      // Actualizar tracking
      for (const req of items) {
        const sourceItem = sourceItems.find(i => i.id === req.document_item_id)!;
        const newInvoiced = Number(sourceItem.quantity_invoiced ?? 0) + req.quantity;
        await tx.document_items.update({
          where: { id: req.document_item_id },
          data: { quantity_invoiced: newInvoiced },
        });
      }

      // Verificar si todos los items fueron facturados
      const allItems = await tx.document_items.findMany({ where: { document_id: id } });
      const allInvoiced = allItems.every(i => Number(i.quantity_invoiced ?? 0) >= Number(i.quantity));
      if (allInvoiced) {
        await tx.documents.update({ where: { id }, data: { status: 6 } }); // FACTURADA
      }
    });

    return this.findOne(createdId);
  }

  // ─────────────────────────────────────────────
  // CHANGE STATUS (con validación de transiciones)
  // ─────────────────────────────────────────────
  async changeStatus(id: string, newStatus: number, userId: string) {
    const doc = await this.findOne(id);
    const category = doc.document_types?.category;

    // Importar dinámicamente para evitar circular deps
    const { getValidTransitions } = await import('../documents/types/document-statuses.js');
    const valid = getValidTransitions(category, doc.status);

    if (!valid.includes(newStatus)) {
      throw new BadRequestException(
        `Transición inválida: ${doc.status} → ${newStatus} para categoría ${category}`
      );
    }

    await this.prisma.documents.update({
      where: { id },
      data: { status: newStatus, updated_at: new Date() },
    });

    return this.findOne(id);
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

    // Con secuencia: incrementar y verificar que no exista
    let attempts = 0;
    while (attempts < 100) {
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

      const exists = await db.documents.findFirst({
        where: { document_type_id: documentTypeId, number: seq.current_number },
      });

      if (!exists) return seq.current_number;
      attempts++;
    }

    throw new BadRequestException('No se pudo generar un número único de documento');
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
}
