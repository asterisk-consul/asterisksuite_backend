import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { convertWithMarketRate, normalizeMarketRate } from '@/common/utils/currency-conversion';
import { DocumentSequencesService } from '@/modules/erp/document-sequences/document-sequences.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { AssociateQuoteDto } from './dto/associate-quote.dto';
import { ConvertQuoteDto } from './dto/convert-quote.dto';
import { DocumentsPurchasesService } from '@/modules/erp/documents-purchases/documents_purchases.service';
import { OperationStatus, InternationalExpenseType, QuoteStatus } from '@/generated/prisma/enums';
import {
  hasInternationalTransitMovements,
  receiveInternationalRemitoFromTransit,
  registerInternationalPurchaseInTransit,
} from './international-stock';

@Injectable()
export class InternationalOperationsService {
  constructor(
    private db: PrismaService,
    private sequencesService: DocumentSequencesService,
    private purchases: DocumentsPurchasesService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateOperationDto) {
    const sequence = await this.prisma.document_sequences.findFirst({
      where: { prefix: 'IMP', active: true, deleted_at: null },
    });

    if (!sequence) {
      throw new BadRequestException(
        'No existe una secuencia de numeración con prefijo "IMP". Crear una secuencia en Ajustes → Secuencias de Documento.',
      );
    }

    const nextNumber = await this.sequencesService.getNextNumber(sequence.id);
    const year = new Date().getFullYear();
    const number = `IMP-${year}-${String(nextNumber).padStart(5, '0')}`;

    return this.prisma.international_operations.create({
      data: {
        number,
        name: dto.name,
        operation_type: dto.operation_type ?? 'IMPORT',
        transport_type: dto.transport_type ?? 'MARITIME',
        status: 'PLANNED',
        primary_supplier_id: dto.primary_supplier_id,
        origin_country: dto.origin_country,
        origin_location: dto.origin_location,
        origin_location_id: dto.origin_location_id,
        destination_country: dto.destination_country,
        destination_location: dto.destination_location,
        destination_location_id: dto.destination_location_id,
        estimated_departure_date: dto.estimated_departure_date
          ? new Date(dto.estimated_departure_date)
          : null,
        estimated_arrival_date: dto.estimated_arrival_date
          ? new Date(dto.estimated_arrival_date)
          : null,
        currency_code: dto.currency_code,
        incoterm: dto.incoterm,
        responsible_user_id: dto.responsible_user_id,
        customs_broker_op_number: dto.customs_broker_op_number,
        sim_number: dto.sim_number,
        supplier_purchase_order: dto.supplier_purchase_order,
        notes: dto.notes,
      },
      include: {
        primary_supplier: { select: { id: true, name: true, tax_id: true } },
        containers: true,
      },
    });
  }

  async findAll(params?: {
    status?: OperationStatus;
    supplier_id?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { deleted_at: null };

    if (params?.status) {
      where.status = params.status;
    }
    if (params?.supplier_id) {
      where.primary_supplier_id = params.supplier_id;
    }
    if (params?.search) {
      where.OR = [
        { number: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
        { customs_broker_op_number: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.international_operations.findMany({
        where,
        include: {
          primary_supplier: { select: { id: true, name: true } },
          containers: { select: { id: true, status: true } },
          operation_documents: { select: { document_id: true } },
          operation_payments: { select: { payment_id: true } },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.international_operations.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const operation = await this.prisma.international_operations.findFirst({
      where: { id, deleted_at: null },
      include: {
        primary_supplier: true,
        origin_loc: true,
        destination_loc: true,
        containers: {
          where: { deleted_at: null },
          include: {
            events: { orderBy: { event_date: 'asc' } },
          },
        },
        operation_documents: {
          include: {
            document: {
              include: {
                document_types: { select: { code: true, description: true, category: true, direction: true } },
                business_parties: { select: { id: true, name: true } },
                payment_documents: {
                  include: {
                    payment: { select: { id: true, number: true, amount: true, currency_code: true, status: true, date: true, payment_method: true } },
                  },
                },
                document_items: {
                  include: { products: { select: { id: true, name: true, sku: true } } },
                },
              },
            },
          },
        },
        operation_payments: {
          include: {
            payment: true,
            container: { select: { id: true, container_number: true } },
          },
        },
        operation_quotes: {
          where: { deleted_at: null },
          include: {
            container: { select: { id: true, container_number: true } },
            converted_document: { select: { id: true, number: true, status: true, deleted_at: true, document_types: { select: { code: true, category: true } } } },
            document: {
              include: {
                document_types: { select: { code: true, description: true, category: true } },
                business_parties: { select: { id: true, name: true } },
                document_items: {
                  include: { products: { select: { id: true, name: true, sku: true } } },
                },
              },
            },
          },
          orderBy: { created_at: 'asc' },
        },
        purchase_orders: {
          include: {
            document: {
              include: {
                document_items: {
                  include: { products: { select: { id: true, name: true, sku: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!operation) {
      throw new NotFoundException('Operación internacional no encontrada');
    }

    return operation;
  }

  async update(id: string, dto: UpdateOperationDto) {
    await this.findOne(id);

    return this.prisma.international_operations.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.operation_type && { operation_type: dto.operation_type }),
        ...(dto.transport_type && { transport_type: dto.transport_type }),
        ...(dto.primary_supplier_id !== undefined && {
          primary_supplier_id: dto.primary_supplier_id,
        }),
        ...(dto.origin_country !== undefined && { origin_country: dto.origin_country }),
        ...(dto.origin_location !== undefined && { origin_location: dto.origin_location }),
        ...(dto.origin_location_id !== undefined && { origin_location_id: dto.origin_location_id }),
        ...(dto.destination_country !== undefined && {
          destination_country: dto.destination_country,
        }),
        ...(dto.destination_location !== undefined && {
          destination_location: dto.destination_location,
        }),
        ...(dto.destination_location_id !== undefined && {
          destination_location_id: dto.destination_location_id,
        }),
        ...(dto.estimated_departure_date !== undefined && {
          estimated_departure_date: dto.estimated_departure_date
            ? new Date(dto.estimated_departure_date)
            : null,
        }),
        ...(dto.actual_departure_date !== undefined && {
          actual_departure_date: dto.actual_departure_date
            ? new Date(dto.actual_departure_date)
            : null,
        }),
        ...(dto.estimated_arrival_date !== undefined && {
          estimated_arrival_date: dto.estimated_arrival_date
            ? new Date(dto.estimated_arrival_date)
            : null,
        }),
        ...(dto.actual_arrival_date !== undefined && {
          actual_arrival_date: dto.actual_arrival_date
            ? new Date(dto.actual_arrival_date)
            : null,
        }),
        ...(dto.currency_code !== undefined && { currency_code: dto.currency_code }),
        ...(dto.incoterm !== undefined && { incoterm: dto.incoterm }),
        ...(dto.responsible_user_id !== undefined && {
          responsible_user_id: dto.responsible_user_id,
        }),
        ...(dto.customs_broker_op_number !== undefined && {
          customs_broker_op_number: dto.customs_broker_op_number,
        }),
        ...(dto.sim_number !== undefined && { sim_number: dto.sim_number }),
        ...(dto.supplier_purchase_order !== undefined && {
          supplier_purchase_order: dto.supplier_purchase_order,
        }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
      include: {
        primary_supplier: { select: { id: true, name: true } },
        containers: true,
      },
    });
  }

  async updateStatus(id: string, status: OperationStatus) {
    const operation = await this.findOne(id);

    const data: any = { status };

    if (status === 'IN_TRANSIT' && !operation.actual_departure_date) {
      data.actual_departure_date = new Date();
    }
    if (status === 'ARRIVED' && !operation.actual_arrival_date) {
      data.actual_arrival_date = new Date();
    }

    return this.prisma.international_operations.update({
      where: { id },
      data,
      include: {
        primary_supplier: { select: { id: true, name: true } },
        containers: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.international_operations.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async getSummary(id: string) {
    const operation = await this.findOne(id);

    const containerCount = operation.containers.length;
    const purchaseOrderCount = operation.purchase_orders.length;

    const documentIds = operation.operation_documents.map((d) => d.document_id);
    const paymentIds = operation.operation_payments.map((p) => p.payment_id);

    // Agrupar documentos por expense_type Y por moneda
    const expenseGroups: Record<string, {
      type: string;
      label: string;
      total: number;
      paid: number;
      documents: any[];
      currency: string;
      unconvertedCount: number;
      unconvertedAmount: number;
    }> = {};

    // Agrupar financial por moneda
    const financialByCurrency: Record<string, {
      currency: string;
      total: number;
      paid: number;
      pending: number;
    }> = {};

    const expenseTypeLabels: Record<string, string> = {
      MERCHANDISE: 'Mercadería',
      INTERNATIONAL_FREIGHT: 'Flete Internacional',
      INSURANCE: 'Seguro',
      CUSTOMS_BROKER: 'Despachante',
      COMMERCIAL_AGENT: 'Agente Comercial',
      PORT_EXPENSE: 'Gastos Portuarios',
      STORAGE: 'Almacenaje',
      LOCAL_TRANSPORT: 'Transporte Interno',
      CUSTOMS_DUTIES: 'Derechos de Aduana',
      NACIONALIZACION: 'Nacionalización',
      OTHER: 'Otros',
    };

    let totalOriginal = 0;
    let totalBase = 0;
    let paidOriginal = 0;
    let paidBase = 0;

    // Consolidado en la moneda de la operación: cada documento se convierte
    // con el exchange_rate asignado al asociarlo; los sin TC se rastrean aparte.
    const opCurrency = operation.currency_code ?? 'USD';
    let totalOpCurrency = 0;
    let paidOpCurrency = 0;
    let unconvertedCount = 0;
    let unconvertedAmount = 0;

    for (const rel of operation.operation_documents) {
      const doc = rel.document;
      if (!doc) continue;

      const docTotal = Number(doc.total ?? 0);
      const docBase = Number(doc.converted_total ?? doc.total ?? 0);
      const docPaid = doc.payment_documents?.reduce((sum: number, pd: any) => sum + Number(pd.amount_applied ?? 0), 0) ?? 0;
      const docCurrency = doc.currency_code ?? 'USD';

      totalOriginal += docTotal;
      totalBase += docBase;
      paidOriginal += docPaid;
      paidBase += docPaid;

      // Consolidado en moneda de operación
      const convertedTotal = convertWithMarketRate(docTotal, docCurrency, opCurrency, rel.exchange_rate ? Number(rel.exchange_rate) : null);
      const convertedPaid = convertWithMarketRate(docPaid, docCurrency, opCurrency, rel.exchange_rate ? Number(rel.exchange_rate) : null);
      if (convertedTotal != null) {
        totalOpCurrency += convertedTotal;
        paidOpCurrency += convertedPaid ?? 0;
      } else {
        unconvertedCount += 1;
        unconvertedAmount += docTotal;
      }

      // Financial por moneda
      if (!financialByCurrency[docCurrency]) {
        financialByCurrency[docCurrency] = {
          currency: docCurrency,
          total: 0,
          paid: 0,
          pending: 0,
        };
      }
      financialByCurrency[docCurrency].total += docTotal;
      financialByCurrency[docCurrency].paid += docPaid;
      financialByCurrency[docCurrency].pending = financialByCurrency[docCurrency].total - financialByCurrency[docCurrency].paid;

      const expenseType = rel.expense_type ?? 'MERCHANDISE';
      if (!expenseGroups[expenseType]) {
        expenseGroups[expenseType] = {
          type: expenseType,
          label: expenseTypeLabels[expenseType] ?? expenseType,
          total: 0,
          paid: 0,
          documents: [],
          currency: opCurrency,
          unconvertedCount: 0,
          unconvertedAmount: 0,
        };
      }
      // Totales del grupo en la moneda de la operación
      if (convertedTotal != null) {
        expenseGroups[expenseType].total += convertedTotal;
        expenseGroups[expenseType].paid += convertedPaid ?? 0;
      } else {
        expenseGroups[expenseType].unconvertedCount += 1;
        expenseGroups[expenseType].unconvertedAmount += docTotal;
      }
      expenseGroups[expenseType].documents.push({
        ...rel,
        paid_amount: docPaid,
        pending_amount: docTotal - docPaid,
      });
    }

    if (paymentIds.length > 0) {
      const pays = await this.prisma.payments.findMany({
        where: { id: { in: paymentIds }, deleted_at: null },
        select: { amount: true, converted_amount: true, currency_code: true },
      });
      for (const pay of pays) {
        paidOriginal += Number(pay.amount);
        paidBase += Number(pay.converted_amount ?? pay.amount);
        const payCurrency = pay.currency_code ?? opCurrency;
        if (payCurrency === opCurrency) {
          paidOpCurrency += Number(pay.amount);
        } else if (pay.converted_amount != null) {
          paidOpCurrency += Number(pay.converted_amount);
        } else {
          unconvertedCount += 1;
          unconvertedAmount += Number(pay.amount);
        }
      }
    }

    const productCount = operation.purchase_orders.reduce((acc, po) => {
      return acc + (po.document?.document_items?.length ?? 0);
    }, 0);

    const now = new Date();
    const eta = operation.estimated_arrival_date;
    const etaApproaching =
      eta && !operation.actual_arrival_date
        ? Math.ceil((new Date(eta).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) <= 3
        : false;
    const etaOverdue =
      eta && !operation.actual_arrival_date ? new Date(eta) < now : false;

    return {
      operation: {
        id: operation.id,
        number: operation.number,
        name: operation.name,
        status: operation.status,
        operation_type: operation.operation_type,
        transport_type: operation.transport_type,
        origin_country: operation.origin_country,
        destination_country: operation.destination_country,
        estimated_arrival_date: operation.estimated_arrival_date,
        actual_arrival_date: operation.actual_arrival_date,
        incoterm: operation.incoterm,
        primary_supplier: operation.primary_supplier,
      },
      containers: operation.containers,
      stats: {
        containerCount,
        purchaseOrderCount,
        documentCount: documentIds.length,
        paymentCount: paymentIds.length,
        productCount,
      },
      financial: {
        currency: opCurrency,
        total: { amount: totalOpCurrency, baseAmount: totalOpCurrency },
        paid: { amount: paidOpCurrency, baseAmount: paidOpCurrency },
        pending: { amount: totalOpCurrency - paidOpCurrency, baseAmount: totalOpCurrency - paidOpCurrency },
        unconverted: { count: unconvertedCount, amount: unconvertedAmount },
      },
      financialByCurrency: Object.values(financialByCurrency).map(f => ({
        currency: f.currency,
        total: f.total,
        paid: f.paid,
        pending: f.pending,
      })),
      expenseGroups: Object.values(expenseGroups).map(g => ({
        type: g.type,
        label: g.label,
        total: g.total,
        paid: g.paid,
        pending: g.total - g.paid,
        currency: g.currency,
        unconvertedCount: g.unconvertedCount,
        unconvertedAmount: g.unconvertedAmount,
        documentCount: g.documents.length,
        documents: g.documents,
      })),
      alerts: {
        etaApproaching,
        etaOverdue,
        pendingClosure: operation.status === 'DELIVERED',
      },
    };
  }

  async associateDocument(operationId: string, documentId: string, expenseType?: InternationalExpenseType, containerId?: string, customExpenseDescription?: string, exchangeRate?: number) {
    const operation = await this.findOne(operationId);
    await this.requireContainer(this.prisma, operationId, containerId);
    if (expenseType === 'OTHER' && !customExpenseDescription?.trim()) throw new BadRequestException('Indicá el concepto de la categoría Otros');

    const doc = await this.prisma.documents.findFirst({
      where: { id: documentId, deleted_at: null },
      include: {
        document_types: { select: { category: true, direction: true } },
        document_items: { where: { deleted_at: null } },
      },
    });
    if (!doc) throw new NotFoundException('Documento no encontrado');

    if (!['ORDER', 'INVOICE'].includes(doc.document_types?.category ?? '') || ![-1, 1].includes(Number(doc.document_types?.direction))) {
      throw new BadRequestException('Solo se pueden asociar órdenes y facturas de compra o venta. Los presupuestos se vinculan desde Presupuestos.');
    }
    if (doc.status === 3 || doc.status >= 7) throw new BadRequestException('No se puede asociar un documento anulado');
    const documentCurrency = doc.currency_code ?? operation.currency_code ?? 'ARS';
    const operationCurrency = operation.currency_code ?? documentCurrency;
    const normalizedExchangeRate = normalizeMarketRate(exchangeRate, documentCurrency, operationCurrency);

    if (documentCurrency !== operationCurrency && !normalizedExchangeRate) {
      throw new BadRequestException('Debe ingresar una cotización válida para asociar monedas diferentes');
    }

    const existing = await this.prisma.international_operation_documents.findUnique({
      where: { operation_id_document_id: { operation_id: operationId, document_id: documentId } },
    });
    if (existing) {
      throw new BadRequestException('El documento ya está asociado a esta operación');
    }

    if (containerId) {
      const container = await this.prisma.international_containers.findFirst({
        where: { id: containerId, operation_id: operationId, deleted_at: null },
      });
      if (!container) {
        throw new BadRequestException('El contenedor no pertenece a esta operación');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM tenant.international_operations WHERE id = ${operationId}::uuid FOR UPDATE`;
      await this.requireContainer(tx, operationId, containerId);
      const relation = await tx.international_operation_documents.create({
        data: {
          operation_id: operationId,
          document_id: documentId,
          expense_type: expenseType ?? 'MERCHANDISE',
          custom_expense_description: customExpenseDescription ?? null,
          container_id: containerId ?? null,
          exchange_rate: normalizedExchangeRate,
        },
      });

      if (doc.document_types?.category === 'ORDER' && doc.document_types.direction === -1) {
        await tx.orden_compra_documents.update({ where: { document_id: documentId }, data: { international_operation_id: operationId } });
      }
      if ((expenseType ?? 'MERCHANDISE') === 'MERCHANDISE' && containerId && doc.status === 2) {
        if (['ORDER', 'INVOICE'].includes(doc.document_types?.category ?? '')) {
          await registerInternationalPurchaseInTransit(tx, documentId, containerId);
        } else if (doc.document_types?.category === 'REMITO') {
          await receiveInternationalRemitoFromTransit(tx, doc, containerId);
        }
      }

      return relation;
    });
  }

  async disassociateDocument(operationId: string, documentId: string) {
    await this.findOne(operationId);

    const existing = await this.prisma.international_operation_documents.findUnique({
      where: { operation_id_document_id: { operation_id: operationId, document_id: documentId } },
    });
    if (!existing) {
      throw new NotFoundException('El documento no está asociado a esta operación');
    }

    if (await hasInternationalTransitMovements(this.prisma, documentId)) {
      throw new BadRequestException('No se puede desasociar el documento porque ya generó movimientos de stock en tránsito');
    }

    return this.prisma.international_operation_documents.delete({
      where: { operation_id_document_id: { operation_id: operationId, document_id: documentId } },
    });
  }

  async associatePayment(operationId: string, paymentId: string, containerId?: string) {
    await this.findOne(operationId);

    const pay = await this.prisma.payments.findFirst({
      where: { id: paymentId, deleted_at: null },
    });
    if (!pay) throw new NotFoundException('Pago no encontrado');

    if (containerId) {
      const container = await this.prisma.international_containers.findFirst({
        where: { id: containerId, operation_id: operationId, deleted_at: null },
      });
      if (!container) {
        throw new BadRequestException('El contenedor no pertenece a esta operación');
      }
    }

    const existing = await this.prisma.international_operation_payments.findUnique({
      where: { operation_id_payment_id: { operation_id: operationId, payment_id: paymentId } },
    });
    if (existing) {
      throw new BadRequestException('El pago ya está asociado a esta operación');
    }

    return this.prisma.international_operation_payments.create({
      data: {
        operation_id: operationId,
        payment_id: paymentId,
        container_id: containerId ?? null,
      },
    });
  }

  async disassociatePayment(operationId: string, paymentId: string) {
    await this.findOne(operationId);

    const existing = await this.prisma.international_operation_payments.findUnique({
      where: { operation_id_payment_id: { operation_id: operationId, payment_id: paymentId } },
    });
    if (!existing) {
      throw new NotFoundException('El pago no está asociado a esta operación');
    }

    return this.prisma.international_operation_payments.delete({
      where: { operation_id_payment_id: { operation_id: operationId, payment_id: paymentId } },
    });
  }

  private async requireContainer(client: any, operationId: string, containerId?: string) {
    if (!containerId) throw new BadRequestException('Primero creá un contenedor y seleccioná a cuál asociar el documento');
    const container = await client.international_containers.findFirst({ where: { id: containerId, operation_id: operationId, deleted_at: null }, select: { id: true } });
    if (!container) throw new BadRequestException('El contenedor no existe o no pertenece a esta operación');
    return container;
  }

  async associateQuote(operationId: string, documentId: string, assignment: AssociateQuoteDto) {
    const operation = await this.findOne(operationId);
    await this.requireContainer(this.prisma, operationId, assignment.container_id);
    if (assignment.expense_type === 'OTHER' && !assignment.custom_expense_description?.trim()) throw new BadRequestException('Indicá el concepto de la categoría Otros');

    const doc = await this.prisma.documents.findFirst({
      where: { id: documentId, deleted_at: null },
      include: { document_types: { select: { category: true, direction: true } } },
    });
    if (!doc) throw new NotFoundException('Documento no encontrado');
    if (doc.document_types?.category !== 'QUOTE') {
      throw new BadRequestException('El documento debe ser un presupuesto (categoría QUOTE)');
    }
    if (Number(doc.document_types?.direction) !== -1) {
      throw new BadRequestException('El presupuesto debe ser de compra');
    }

    const existing = await this.prisma.international_operation_quotes.findFirst({
      where: { operation_id: operationId, document_id: documentId, deleted_at: null },
    });
    if (existing) {
      throw new BadRequestException('El presupuesto ya está asociado a esta operación');
    }

    if (doc.status === 3 || doc.status >= 7) throw new BadRequestException('El presupuesto está anulado');
    const currency = doc.currency_code ?? operation.currency_code ?? 'ARS';
    const operationCurrency = operation.currency_code ?? currency;
    const rate = normalizeMarketRate(assignment.exchange_rate, currency, operationCurrency);
    if (currency !== operationCurrency && !rate) throw new BadRequestException('Indicá una cotización válida para la moneda de la operación');
    return this.prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM tenant.international_operations WHERE id = ${operationId}::uuid FOR UPDATE`;
      await this.requireContainer(tx, operationId, assignment.container_id);
      return tx.international_operation_quotes.create({ data: { operation_id: operationId, document_id: documentId, container_id: assignment.container_id, expense_type: assignment.expense_type, custom_expense_description: assignment.expense_type === 'OTHER' ? assignment.custom_expense_description?.trim() : null, exchange_rate: rate } });
    });
  }

  async updateQuoteStatus(operationId: string, quoteId: string, status: QuoteStatus) {
    await this.findOne(operationId);
    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM tenant.international_operations WHERE id = ${operationId}::uuid FOR UPDATE`;
      const quote = await tx.international_operation_quotes.findFirst({ where: { id: quoteId, operation_id: operationId, deleted_at: null } });
      if (!quote) throw new NotFoundException('Presupuesto no encontrado');
      if (quote.converted_document_id) throw new BadRequestException('El presupuesto ya fue transformado; gestioná el comprobante generado');
      if (status === 'ACCEPTED') {
        await this.requireContainer(tx, operationId, quote.container_id ?? undefined);
        const converted = await tx.international_operation_quotes.findFirst({
          where: { operation_id: operationId, container_id: quote.container_id, expense_type: quote.expense_type, custom_expense_description: quote.custom_expense_description, deleted_at: null, converted_document_id: { not: null } }, select: { id: true },
        });
        if (converted) throw new BadRequestException('Esta categoría y contenedor ya tienen un presupuesto transformado');
        await tx.international_operation_quotes.updateMany({
          where: { operation_id: operationId, container_id: quote.container_id, expense_type: quote.expense_type, custom_expense_description: quote.custom_expense_description, deleted_at: null, id: { not: quoteId }, status: { in: ['PENDING', 'ACCEPTED'] } },
          data: { status: 'REJECTED' },
        });
      }
      return tx.international_operation_quotes.update({ where: { id: quoteId }, data: { status }, include: { document: { include: { business_parties: true } } } });
    });
  }

  async convertQuote(operationId: string, quoteId: string, dto: ConvertQuoteDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM tenant.international_operations WHERE id = ${operationId}::uuid FOR UPDATE`;
      const operation = await tx.international_operations.findFirst({ where: { id: operationId, deleted_at: null }, select: { currency_code: true } });
      if (!operation) throw new NotFoundException('Operación internacional no encontrada');
      await this.requireContainer(tx, operationId, dto.container_id);
      const quote = await tx.international_operation_quotes.findFirst({
        where: { id: quoteId, operation_id: operationId, deleted_at: null },
        include: { document: { include: { document_types: true, document_items: { where: { deleted_at: null } }, document_taxes: true } } },
      });
      if (!quote) throw new NotFoundException('Presupuesto no encontrado');
      const source = quote.document;
      if (source.deleted_at || source.status === 3 || source.status >= 7 || source.document_types.category !== 'QUOTE' || source.document_types.direction !== -1) {
        throw new BadRequestException('El origen debe ser un presupuesto de compra activo');
      }
      if (quote.container_id && (quote.container_id !== dto.container_id || quote.expense_type !== dto.expense_type)) {
        throw new BadRequestException('La transformación debe conservar el contenedor y la categoría del presupuesto');
      }
      const custom = quote.container_id ? quote.custom_expense_description : dto.expense_type === 'OTHER' ? dto.custom_expense_description?.trim() ?? null : null;
      if (dto.expense_type === 'OTHER' && !custom) throw new BadRequestException('Indicá el concepto de la categoría Otros');
      const type = await tx.document_types.findFirst({ where: { id: dto.document_type_id, direction: -1, category: { in: ['ORDER', 'INVOICE'] }, active: true } });
      if (!type) throw new BadRequestException('Elegí un tipo de orden de compra o factura de compra activo');
      if (quote.converted_document_id) {
        const existing = await tx.documents.findFirst({ where: { id: quote.converted_document_id, deleted_at: null } });
        if (!existing || existing.document_type_id !== dto.document_type_id || existing.status === 3) throw new BadRequestException('El presupuesto ya tiene un comprobante generado; abrilo para gestionarlo');
        const document = dto.confirm && existing.status === 0 ? await this.purchases.confirm(existing.id, userId, undefined, tx) : existing;
        return { document, existing: true };
      }
      const sibling = await tx.international_operation_quotes.findFirst({ where: { operation_id: operationId, container_id: dto.container_id, expense_type: dto.expense_type, custom_expense_description: custom, deleted_at: null, id: { not: quoteId }, converted_document_id: { not: null } }, select: { id: true } });
      if (sibling) throw new BadRequestException('Esta categoría y contenedor ya tienen un presupuesto transformado');
      if (!source.document_items.length) throw new BadRequestException('El presupuesto no tiene ítems');
      if (source.document_items.some(item => Number(item.original_unit_price ?? item.unit_price) === 0 && Number(item.price) > 0)) {
        throw new BadRequestException('El presupuesto histórico no tiene un precio unitario válido. Revisá sus ítems antes de transformarlo.');
      }
      const currency = source.currency_code ?? operation.currency_code ?? 'ARS';
      const rate = normalizeMarketRate(quote.exchange_rate == null ? dto.exchange_rate : Number(quote.exchange_rate), currency, operation.currency_code ?? currency);
      if (currency !== (operation.currency_code ?? currency) && !rate) throw new BadRequestException('Indicá la cotización del presupuesto para asociar el documento generado');
      const adjustments = Array.isArray(source.commercial_adjustments) ? source.commercial_adjustments : [];
      if (adjustments.length && !type.accepts_commercial_adjustments) throw new BadRequestException('El tipo destino no acepta los descuentos del presupuesto; revisá su configuración');
      const created = await this.purchases.create({
        document_type_id: type.id,
        party_id: source.party_id ?? undefined,
        date: new Date().toISOString().slice(0, 10),
        currency_code: currency,
        exchange_rate: source.exchange_rate == null ? undefined : Number(source.exchange_rate),
        rate_type: source.rate_type ?? undefined,
        descrip: source.descrip ?? `Presupuesto #${source.number}`,
        ref: `Presupuesto #${source.number}`,
        commercial_adjustments: adjustments as any,
        items: source.document_items.map(item => ({ product_id: item.product_id ?? undefined, variant_id: item.variant_id ?? undefined, quantity: Number(item.quantity), unit_price: Number(item.original_unit_price ?? item.unit_price), discount_percentage: Number(item.discount_percentage ?? 0), purchase_unit_id: item.purchase_unit_id ?? undefined, unit_conversion_factor: Number(item.unit_conversion_factor ?? 1) })),
      }, userId, tx);
      await tx.international_operation_documents.create({ data: { operation_id: operationId, document_id: created.id, container_id: dto.container_id, expense_type: dto.expense_type, custom_expense_description: custom, exchange_rate: rate } });
      if (type.category === 'ORDER') await tx.orden_compra_documents.update({ where: { document_id: created.id }, data: { international_operation_id: operationId } });
      await tx.international_operation_quotes.updateMany({ where: { operation_id: operationId, container_id: dto.container_id, expense_type: dto.expense_type, custom_expense_description: custom, deleted_at: null, id: { not: quoteId }, status: { in: ['PENDING', 'ACCEPTED'] } }, data: { status: 'REJECTED' } });
      await tx.international_operation_quotes.update({ where: { id: quoteId }, data: { status: 'ACCEPTED', converted_document_id: created.id, container_id: dto.container_id, expense_type: dto.expense_type, custom_expense_description: custom, exchange_rate: rate, updated_by: userId } });
      const document = dto.confirm ? await this.purchases.confirm(created.id, userId, undefined, tx) : created;
      return { document, existing: false };
    }, { timeout: 30_000 });
  }

  async disassociateQuote(operationId: string, quoteId: string) {
    await this.findOne(operationId);

    const quote = await this.prisma.international_operation_quotes.findFirst({
      where: { id: quoteId, operation_id: operationId, deleted_at: null },
    });
    if (!quote) throw new NotFoundException('Presupuesto no encontrado');

    if (quote.converted_document_id) throw new BadRequestException('No se puede desasociar un presupuesto transformado; conserva el vínculo con el documento generado');

    return this.prisma.international_operation_quotes.delete({
      where: { id: quoteId },
    });
  }

  async associatePurchaseOrder(operationId: string, documentId: string, containerId?: string, expenseType?: InternationalExpenseType, customExpenseDescription?: string, exchangeRate?: number) {

    const po = await this.prisma.orden_compra_documents.findFirst({
      where: { document_id: documentId },
    });
    if (!po) throw new NotFoundException('Orden de compra no encontrada');

    return this.associateDocument(operationId, documentId, expenseType, containerId, customExpenseDescription, exchangeRate);
  }

  async disassociatePurchaseOrder(operationId: string, documentId: string) {
    await this.findOne(operationId);

    const po = await this.prisma.orden_compra_documents.findFirst({
      where: { document_id: documentId, international_operation_id: operationId },
    });
    if (!po) {
      throw new NotFoundException('La orden de compra no está asociada a esta operación');
    }

    return this.prisma.orden_compra_documents.update({
      where: { document_id: documentId },
      data: { international_operation_id: null },
    });
  }
}
