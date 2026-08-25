import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { DocumentSequencesService } from '@/modules/erp/document-sequences/document-sequences.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { OperationStatus, InternationalExpenseType } from '@/generated/prisma/enums';

@Injectable()
export class InternationalOperationsService {
  constructor(
    private db: PrismaService,
    private sequencesService: DocumentSequencesService,
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
                document_types: { select: { code: true, description: true, category: true } },
                business_parties: { select: { id: true, name: true } },
                payment_documents: {
                  include: {
                    payment: { select: { id: true, number: true, amount: true, currency_code: true, status: true, date: true, payment_method: true } },
                  },
                },
              },
            },
          },
        },
        operation_payments: {
          include: {
            payment: true,
          },
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

    const validTransitions: Record<OperationStatus, OperationStatus[]> = {
      PLANNED: ['IN_PREPARATION', 'CANCELLED'],
      IN_PREPARATION: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['IN_TRANSIT'],
      IN_TRANSIT: ['ARRIVED'],
      ARRIVED: ['CUSTOMS'],
      CUSTOMS: ['RELEASED'],
      RELEASED: ['DELIVERED'],
      DELIVERED: ['CLOSED'],
      CLOSED: [],
      CANCELLED: [],
    };

    const allowed = validTransitions[operation.status] ?? [];
    if (!allowed.includes(status)) {
      throw new BadRequestException(
        `No se puede cambiar de estado "${operation.status}" a "${status}"`,
      );
    }

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
      OTHER: 'Otros',
    };

    let totalOriginal = 0;
    let totalBase = 0;
    let paidOriginal = 0;
    let paidBase = 0;

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
        };
      }
      expenseGroups[expenseType].total += docTotal;
      expenseGroups[expenseType].paid += docPaid;
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
        total: { amount: totalOriginal, baseAmount: totalBase },
        paid: { amount: paidOriginal, baseAmount: paidBase },
        pending: { amount: totalOriginal - paidOriginal, baseAmount: totalBase - paidBase },
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
    await this.findOne(operationId);

    const doc = await this.prisma.documents.findFirst({
      where: { id: documentId, deleted_at: null },
    });
    if (!doc) throw new NotFoundException('Documento no encontrado');

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

    return this.prisma.international_operation_documents.create({
      data: {
        operation_id: operationId,
        document_id: documentId,
        expense_type: expenseType ?? 'MERCHANDISE',
        custom_expense_description: customExpenseDescription ?? null,
        container_id: containerId ?? null,
        exchange_rate: exchangeRate ?? null,
      },
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

    return this.prisma.international_operation_documents.delete({
      where: { operation_id_document_id: { operation_id: operationId, document_id: documentId } },
    });
  }

  async associatePayment(operationId: string, paymentId: string) {
    await this.findOne(operationId);

    const pay = await this.prisma.payments.findFirst({
      where: { id: paymentId, deleted_at: null },
    });
    if (!pay) throw new NotFoundException('Pago no encontrado');

    const existing = await this.prisma.international_operation_payments.findUnique({
      where: { operation_id_payment_id: { operation_id: operationId, payment_id: paymentId } },
    });
    if (existing) {
      throw new BadRequestException('El pago ya está asociado a esta operación');
    }

    return this.prisma.international_operation_payments.create({
      data: { operation_id: operationId, payment_id: paymentId },
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

  async associatePurchaseOrder(operationId: string, documentId: string) {
    await this.findOne(operationId);

    const po = await this.prisma.orden_compra_documents.findFirst({
      where: { document_id: documentId },
    });
    if (!po) throw new NotFoundException('Orden de compra no encontrada');

    return this.prisma.orden_compra_documents.update({
      where: { document_id: documentId },
      data: { international_operation_id: operationId },
    });
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
