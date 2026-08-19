// src/modules/erp/documents-purchases/documents_purchases.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { parseLocalDateTime } from '@/common/utils/dates';

import { CreateDocumentDto } from '../documents/dto/create-document.dto';

import { UpdateDocumentDto } from '../documents/dto/update-document.dto';

import { DocumentsPurchasesTotalsService } from './documents-purchases-totals';

import { CurrentAccountsService } from '../current-accounts/current-accounts.service';

import { TaxResolutionService } from '../tax-engine/services/tax-resolution.service';

import { TaxCalculationService } from '../tax-engine/services/tax-calculation.service';

import { CurrencyConversionService } from '../currencies/currency-conversion.service';

import { FiscalValidationService } from '@/common/services/fiscal-validation.service';

import { getCurrentCompanyId } from '@/common/context/request-context.helpers';

import { ItemInput } from '../documents-sales/interfaces/item-input.interface';

import type { TaxContext } from '../tax-engine/interfaces/tax-context.interface';

const STATUS_DRAFT = 0;

const STATUS_PENDING = 1;

const STATUS_CONFIRMED = 2;

const STATUS_CANCELLED = 3;

@Injectable()
export class DocumentsPurchasesService {

  constructor(
    private readonly db: PrismaService,

    private readonly totalsService: DocumentsPurchasesTotalsService,

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

    // ─── Validar parent_document_id ───────────
    if (dto.parent_document_id) {
      const parentDoc = await this.prisma.documents.findUnique({
        where: { id: dto.parent_document_id },
        include: { document_types: { select: { category: true, direction: true } } },
      })
      if (!parentDoc) {
        throw new BadRequestException('El documento referenciado no existe')
      }
      if (parentDoc.status < 1) {
        throw new BadRequestException('El documento referenciado debe estar aprobado')
      }
      const parentCategory = parentDoc.document_types?.category
      const newCategory = docType.category
      const isNcNd = ['CREDIT_NOTE', 'DEBIT_NOTE'].includes(newCategory)
      const isInvoice = newCategory === 'INVOICE'

      if (isNcNd && parentCategory !== 'INVOICE') {
        throw new BadRequestException('Solo se puede referenciar una factura')
      }
      if (isInvoice && !['ORDER', 'REMITO', 'INVOICE'].includes(parentCategory)) {
        throw new BadRequestException('El documento referenciado debe ser una orden de compra, remito o factura')
      }
      if (parentDoc.document_types?.direction !== docType.direction) {
        throw new BadRequestException('El documento referenciado no coincide con la dirección del comprobante')
      }
      if (dto.party_id && parentDoc.party_id && dto.party_id !== parentDoc.party_id) {
        throw new BadRequestException('El cliente/proveedor no coincide con el de la factura referenciada')
      }
    }

    // ─── Validar contexto fiscal (proveedor emisor × empresa receptor) ──
    const fiscalCtx = await this.fiscalValidation.resolveFiscalContext({
      direction: 'PURCHASE',
      partyId: dto.party_id,
      documentLetterType: docType.letter_type ?? undefined,
    })

    // ─── Tax Engine: resolver impuestos ──────────────────────────

    const taxContext: TaxContext = {
      issuerCompanyId: getCurrentCompanyId() ?? '00000000-0000-0000-0000-000000000000',
      issuerVatCondition: fiscalCtx.issuerVatCondition || undefined,
      partnerId: dto.party_id ?? undefined,
      partnerVatCondition: fiscalCtx.partnerVatCondition || undefined,
      documentTypeId: dto.document_type_id,
      documentLetterType: docType.letter_type ?? undefined,
      currency: dto.currency_code ?? 'ARS',
      date: dto.date,
      operationType: 'PURCHASE',
      items: dtoItems.map(i => ({
        productId: i.product_id,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unit_price),
      })),
    }

    const resolution = await this.taxResolution.resolve(taxContext)
    const calculation = this.taxCalculation.calculate(resolution, taxContext.items)

    console.log('[PurchasesService] Tax Engine result:', JSON.stringify(calculation.document, null, 2))

    // ─── Resolver exchange rate ──────────────────────────────────
    const currencyCode = dto.currency_code ?? 'ARS'
    const baseCurrency = await this.conversionService.getBaseCurrency()
    const isBase = currencyCode.toUpperCase() === baseCurrency.code.toUpperCase()

    let exchangeRate = dto.exchange_rate ?? 1
    let rateType = (dto.rate_type as any) ?? null

    if (docType.letter_type && ['A', 'B', 'C'].includes(docType.letter_type)) {
      rateType = 'OFFICIAL'
    }

    if (!isBase && !dto.exchange_rate) {
      try {
        const resolved = await this.conversionService.resolveRate(
          currencyCode,
          baseCurrency.code,
          parseLocalDateTime(dto.date),
          rateType,
        )
        exchangeRate = resolved.rate
        rateType = resolved.rateType
      } catch {
        exchangeRate = 1
      }
    }

    // ─── Mapear resultado del Tax Engine a ItemInput[] ──────────
    const items: ItemInput[] = calculation.document.items.map((item, idx) => ({
      product_id: item.productId ?? null,
      quantity: item.quantity,
      currency: currencyCode,
      exchange_rate: exchangeRate,
      original_unit_price: item.unitPrice,
      unit_price: item.unitPrice,
      converted_unit_price: isBase ? null : this.conversionService.convertAmount(item.unitPrice, exchangeRate),
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
    }))

    // Usar totals del Tax Engine
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

          date: parseLocalDateTime(dto.date),

          status: STATUS_DRAFT,

          currency_code: currencyCode,

          exchange_rate: exchangeRate,

          rate_type: rateType,

          subtotal: totals.subtotal,

          exempt_amount: totals.exempt_amount,

          taxable_base: totals.taxable_base,

          total_taxes: totals.total_taxes,

          total: totals.total,

          descrip: dto.descrip ?? null,

          ref: dto.ref ?? null,

          parent_document_id: dto.parent_document_id ?? null,

          ...(!isBase ? await this.conversionService.convertDocumentFields(
            currencyCode, exchangeRate, rateType,
            { subtotal: totals.subtotal, exempt_amount: totals.exempt_amount, taxable_base: totals.taxable_base, total_taxes: totals.total_taxes, total: totals.total },
            parseLocalDateTime(dto.date),
          ) : {}),
        },
      });

      createdId = document.id;

      // ─── Crear extensión según categoría ────────────────────────
      if (docType.category === 'ORDER') {
        await tx.orden_compra_documents.create({
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
            buyer_id: dto.buyer_id ?? null,
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
        direction: 'PURCHASE',
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
        operationType: 'PURCHASE',
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
        currency: updateCurrencyCode,
        exchange_rate: updateExchangeRate,
        original_unit_price: item.unitPrice,
        unit_price: item.unitPrice,
        converted_unit_price: updateIsBase ? null : this.conversionService.convertAmount(item.unitPrice, updateExchangeRate),
        price: item.total,
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

          date: dto.date ? parseLocalDateTime(dto.date) : doc.date,

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
            updateCurrencyCode, updateExchangeRate, updateRateType,
            { subtotal: totals.subtotal, exempt_amount: totals.exempt_amount, taxable_base: totals.taxable_base, total_taxes: totals.total_taxes, total: totals.total },
            parseLocalDateTime(dto.date ?? doc.date),
          ) : {}),
        },
      });
    });

    // ─── Upsert extensión ORDER ──────────────────────────────────
    if (doc.document_types?.category === 'ORDER') {
      await this.prisma.orden_compra_documents.upsert({
        where: { document_id: id },
        create: {
          document_id: id,
          priority: dto.priority ?? null,
          delivery_address: dto.delivery_address ?? null,
          delivery_contact: dto.delivery_contact ?? null,
          delivery_phone: dto.delivery_phone ?? null,
          delivery_time: dto.delivery_time ?? null,
          delivery_instructions: dto.delivery_instructions ?? null,
          transport_provider: dto.transport_provider ?? null,
          confirmed_delivery_date: dto.confirmed_delivery_date ? new Date(dto.confirmed_delivery_date) : null,
          buyer_id: dto.buyer_id ?? null,
        },
        update: {
          ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
          ...(dto.delivery_address !== undefined ? { delivery_address: dto.delivery_address } : {}),
          ...(dto.delivery_contact !== undefined ? { delivery_contact: dto.delivery_contact } : {}),
          ...(dto.delivery_phone !== undefined ? { delivery_phone: dto.delivery_phone } : {}),
          ...(dto.delivery_time !== undefined ? { delivery_time: dto.delivery_time } : {}),
          ...(dto.delivery_instructions !== undefined ? { delivery_instructions: dto.delivery_instructions } : {}),
          ...(dto.transport_provider !== undefined ? { transport_provider: dto.transport_provider } : {}),
          ...(dto.confirmed_delivery_date !== undefined ? { confirmed_delivery_date: dto.confirmed_delivery_date ? new Date(dto.confirmed_delivery_date) : null } : {}),
          ...(dto.buyer_id !== undefined ? { buyer_id: dto.buyer_id } : {}),
        },
      });
    }

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

    category?: string,

    direction?: number,
  ) {
    return this.prisma.documents.findMany({
      where: {
        document_types: {
          direction: direction ?? -1,
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

        orden_compra_doc: true,

        payment_documents: {
          where: { deleted_at: null },
          select: { id: true, amount_applied: true },
        },
      },
    });

    if (!doc) {
      throw new NotFoundException('Documento no encontrado');
    }

    return doc;
  }

  // ─────────────────────────────────────────────
  // FIND PENDING (saldo pendiente de pago)
  // ─────────────────────────────────────────────
  async findPending(partyId?: string) {
    const docs = await this.prisma.documents.findMany({
      where: {
        document_types: {
          direction: -1,
          affects_payment: true,
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
  // GENERAR BORRADORES DESDE VIAJE
  // ─────────────────────────────────────────────
  async generateDraftsFromTrip(tripId: string): Promise<{ created: number; skipped: number }> {
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
        code: 'COM',
      },

      include: {
        document_sequences: true,
      },
    });

    if (!docType) {
      throw new NotFoundException('Tipo de documento COM no configurado');
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
  async confirm(id: string, userId: string, options?: { updateProductPrices?: boolean | string }) {
    const updateProductPrices = options?.updateProductPrices === true || options?.updateProductPrices === 'true';
    console.log('[confirm-purchases] options:', JSON.stringify(options), '→ updateProductPrices:', updateProductPrices);
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

      // Crear entrada de cuenta corriente solo si el tipo afecta contabilidad
      if (doc.party_id && doc.document_types?.affects_accounting) {
        const partyType = doc.document_types?.direction === -1 ? 'SUPPLIER' : 'CUSTOMER';
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
            currency_code: doc.currency_code,
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

      // ─── Sync product prices from purchase invoice ───
      if (updateProductPrices) {
        await this.syncProductPricesFromPurchase(tx, doc);
      }

      return tx.documents.findUnique({ where: { id } });
    });
  }

  /**
   * Sync product prices/costs from purchase invoice items.
   * - FINISHED_PRODUCT / SERVICE → product_price
   * - RAW_MATERIAL (with variants) → product_variant_costs
   * - RAW_MATERIAL (without variants) → products.current_cost
   */
  private async syncProductPricesFromPurchase(tx: any, doc: any) {
    console.log('[syncProductPrices] INICIO - updateProductPrices=true');
    console.log('[syncProductPrices] doc.currency_code:', doc.currency_code);
    console.log('[syncProductPrices] items count:', doc.document_items?.length);

    const currencies = await tx.currencies.findMany({
      where: { deleted_at: null },
      select: { id: true, code: true },
    });
    const currencyMap = Object.fromEntries(currencies.map((c: any) => [c.code, c.id]));
    console.log('[syncProductPrices] currencies:', Object.keys(currencyMap));

    for (const item of doc.document_items) {
      console.log('[syncProductPrices] ─── item ───');
      console.log('[syncProductPrices] item.product_id:', item.product_id);
      console.log('[syncProductPrices] item.unit_price:', item.unit_price);
      console.log('[syncProductPrices] item.currency_code:', item.currency_code);

      if (!item.product_id) {
        console.log('[syncProductPrices] SKIP: no product_id');
        continue;
      }

      const product = await tx.products.findUnique({
        where: { id: item.product_id },
        select: { id: true, product_type: true, price_enabled: true, current_cost: true },
      });

      console.log('[syncProductPrices] product:', product?.id, product?.product_type);

      if (!product) {
        console.log('[syncProductPrices] SKIP: product not found');
        continue;
      }

      const currencyId = currencyMap[item.currency_code ?? doc.currency_code];
      console.log('[syncProductPrices] currencyId resolved:', currencyId);

      if (!currencyId) {
        console.log('[syncProductPrices] SKIP: no currencyId');
        continue;
      }

      const itemPrice = Number(item.unit_price);
      console.log('[syncProductPrices] itemPrice:', itemPrice);

      if (product.product_type === 'FINISHED_PRODUCT' || product.product_type === 'SERVICE') {
        const existing = await tx.product_price.findUnique({
          where: { product_id_currency_id: { product_id: item.product_id, currency_id: currencyId } },
        });
        console.log('[syncProductPrices] existing price:', existing?.id, existing?.price?.toString());

        if (!existing) {
          console.log('[syncProductPrices] CREANDO precio nuevo');
          await tx.product_price.create({
            data: {
              product_id: item.product_id,
              currency_id: currencyId,
              price: itemPrice,
              exemption_rate: 0,
            },
          });
        } else if (Number(existing.price) !== itemPrice) {
          console.log('[syncProductPrices] ACTUALIZANDO precio:', existing.price?.toString(), '->', itemPrice);
          await tx.product_price.update({
            where: { id: existing.id },
            data: { price: itemPrice, updated_at: new Date() },
          });
        } else {
          console.log('[syncProductPrices] SKIP: precio ya es igual');
        }
      } else if (product.product_type === 'RAW_MATERIAL') {
        console.log('[syncProductPrices] procesando RAW_MATERIAL');
        const variants = await tx.product_variants.findMany({
          where: { product_id: item.product_id, deleted_at: null },
          select: { id: true },
        });
        console.log('[syncProductPrices] variants:', variants.length);

        if (variants.length > 0) {
          const variantId = variants[0].id;
          const existingCost = await tx.product_variant_costs.findFirst({
            where: { variant_id: variantId, currency_id: currencyId, deleted_at: null },
          });

          if (!existingCost) {
            console.log('[syncProductPrices] CREANDO variant cost');
            await tx.product_variant_costs.create({
              data: {
                variant_id: variantId,
                currency_id: currencyId,
                cost: itemPrice,
                source: 'PURCHASE',
              },
            });
          } else if (Number(existingCost.cost) !== itemPrice) {
            console.log('[syncProductPrices] ACTUALIZANDO variant cost');
            await tx.product_variant_costs.update({
              where: { id: existingCost.id },
              data: { cost: itemPrice, updated_at: new Date() },
            });
          }
        } else {
          const currentCost = product.current_cost ? Number(product.current_cost) : null;
          if (currentCost === null || currentCost !== itemPrice) {
            console.log('[syncProductPrices] ACTUALIZANDO current_cost');
            await tx.products.update({
              where: { id: item.product_id },
              data: { current_cost: itemPrice, updated_at: new Date() },
            });
          }
        }
      } else {
        console.log('[syncProductPrices] SKIP: tipo no soportado:', product.product_type);
      }
    }
    console.log('[syncProductPrices] FIN');
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
      console.log('[cancel-purchases] doc.party_id:', doc.party_id)
      console.log('[cancel-purchases] affects_accounting:', doc.document_types?.affects_accounting)

      if (doc.party_id && doc.document_types?.affects_accounting) {
        const partyType = doc.document_types?.direction === -1 ? 'SUPPLIER' : 'CUSTOMER';
        const docTotal = doc.total.toNumber();

        // La reversión siempre es CREDIT_NOTE para compras
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
