import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { UpdateSalesFlowSettingsDto } from './sales-flow-settings.dto';

@Injectable()
export class SalesCommercialFlowService {
  constructor(private readonly db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async getSettings() {
    return this.prisma.sales_flow_settings.upsert({
      where: { settings_key: 'default' },
      update: {},
      create: { settings_key: 'default' },
    });
  }

  async updateSettings(dto: UpdateSalesFlowSettingsDto, userId: string) {
    if (dto.require_payment_for_delivery && dto.delivery_payment_percentage <= 0) {
      throw new BadRequestException('El porcentaje requerido debe ser mayor que cero cuando se controla el pago');
    }
    return this.prisma.$transaction(async (tx) => {
      const settings = await tx.sales_flow_settings.upsert({
        where: { settings_key: 'default' },
        update: { ...dto, active_from: new Date(), updated_by: userId },
        create: { settings_key: 'default', ...dto, created_by: userId, updated_by: userId },
      });

      const orderAffectsAccounting = ['ORDER', 'ORDER_THEN_INVOICE'].includes(dto.accounting_basis);
      const invoiceAffectsAccounting = ['INVOICE', 'ORDER_THEN_INVOICE'].includes(dto.accounting_basis);
      const orderAffectsPayment = ['ORDER', 'BOTH'].includes(dto.payment_document_basis);
      const invoiceAffectsPayment = ['INVOICE', 'BOTH'].includes(dto.payment_document_basis);

      await Promise.all([
        tx.document_types.updateMany({
          where: { direction: 1, category: 'ORDER' },
          data: { affects_accounting: orderAffectsAccounting, affects_payment: orderAffectsPayment },
        }),
        tx.document_types.updateMany({
          where: { direction: 1, category: 'INVOICE' },
          data: { affects_accounting: invoiceAffectsAccounting, affects_payment: invoiceAffectsPayment },
        }),
      ]);

      return settings;
    });
  }

  async createForOrder(tx: any, document: { id: string; party_id: string | null; currency_code: string | null; total: any }, userId?: string) {
    const settings = await tx.sales_flow_settings.upsert({
      where: { settings_key: 'default' }, update: {}, create: { settings_key: 'default' },
    });
    const operation = await tx.commercial_operations.create({
      data: {
        root_document_id: document.id,
        party_id: document.party_id,
        currency_code: document.currency_code,
        accounting_basis: settings.accounting_basis,
        payment_document_basis: settings.payment_document_basis,
        require_payment_for_delivery: settings.require_payment_for_delivery,
        delivery_payment_percentage: settings.delivery_payment_percentage,
        require_invoice_for_delivery: settings.require_invoice_for_delivery,
        auto_create_delivery_note: settings.auto_create_delivery_note,
        allow_partial_delivery: settings.allow_partial_delivery,
        ordered_total: document.total,
        delivery_status: settings.require_payment_for_delivery || settings.require_invoice_for_delivery ? 'PENDING' : 'ELIGIBLE',
        released_at: settings.require_payment_for_delivery || settings.require_invoice_for_delivery ? null : new Date(),
        created_by: userId,
      },
    });
    await tx.documents.update({ where: { id: document.id }, data: { commercial_operation_id: operation.id } });
    return operation;
  }

  async inheritFromParent(tx: any, documentId: string, parentDocumentId?: string | null) {
    if (!parentDocumentId) return null;
    const parent = await tx.documents.findUnique({ where: { id: parentDocumentId }, select: { commercial_operation_id: true } });
    if (!parent?.commercial_operation_id) return null;
    await tx.documents.update({ where: { id: documentId }, data: { commercial_operation_id: parent.commercial_operation_id } });
    return parent.commercial_operation_id;
  }

  async refresh(operationId: string) {
    const operation = await this.prisma.commercial_operations.findUnique({
      where: { id: operationId },
      include: { documents: { where: { deleted_at: null }, include: { document_types: { select: { category: true } } } } },
    });
    if (!operation) return null;

    const invoices = operation.documents.filter((d: any) => d.document_types.category === 'INVOICE' && d.status !== 3);
    const invoicedTotal = invoices.reduce((sum: number, d: any) => sum + Number(d.total), 0);
    const applications = await this.prisma.payment_documents.findMany({
      where: {
        deleted_at: null,
        document: { commercial_operation_id: operationId },
        payment: { status: { in: ['CONFIRMED', 'PAID'] }, deleted_at: null },
      },
      select: { amount_applied: true },
    });
    const paidTotal = applications.reduce((sum: number, item: any) => sum + Number(item.amount_applied), 0);
    const orderedTotal = Number(operation.ordered_total);
    const percentage = orderedTotal > 0 ? (paidTotal / orderedTotal) * 100 : 100;
    const paymentReady = !operation.require_payment_for_delivery || percentage + 0.0001 >= Number(operation.delivery_payment_percentage);
    const invoiceReady = !operation.require_invoice_for_delivery || invoicedTotal > 0;
    const eligible = paymentReady && invoiceReady;
    const alreadyDelivered = ['DRAFT_CREATED', 'DELIVERED'].includes(operation.delivery_status);

    return this.prisma.commercial_operations.update({
      where: { id: operationId },
      data: {
        invoiced_total: invoicedTotal,
        paid_total: paidTotal,
        ...(!alreadyDelivered ? { delivery_status: eligible ? 'ELIGIBLE' : 'PENDING', released_at: eligible ? operation.released_at ?? new Date() : null } : {}),
      },
    });
  }

  async listDeliveryQueue() {
    return this.prisma.commercial_operations.findMany({
      where: { delivery_status: { in: ['ELIGIBLE', 'DRAFT_CREATED'] } },
      include: {
        root_document: { include: { document_types: true, document_items: { include: { products: true } } } },
        party: { select: { id: true, name: true, tax_id: true } },
      },
      orderBy: [{ released_at: 'asc' }, { created_at: 'asc' }],
    });
  }
}
