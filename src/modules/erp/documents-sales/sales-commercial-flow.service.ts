import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type {
  UpdatePartnerShareSettingsDto,
  UpdateSalesFlowCommissionSettingsDto,
  UpdateSalesFlowSettingsDto,
} from './sales-flow-settings.dto';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';
import { WhatsAppNotificationsService } from '@/modules/notifications/whatsapp-notifications.service';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { requestContext } from '@/common/context/request-context';

@Injectable()
export class SalesCommercialFlowService {
  private readonly logger = new Logger(SalesCommercialFlowService.name);

  private convertPaymentAmount(amount: number, fromCurrency: string, toCurrency: string, exchangeRate?: number | null) {
    const from = fromCurrency?.toUpperCase();
    const to = toCurrency?.toUpperCase();
    const value = Number(amount);
    if (from === to) return value;
    const rate = Number(exchangeRate);
    if (!Number.isFinite(rate) || rate <= 0) return value;
    if (from === 'USD' && to === 'ARS') return value * rate;
    if (from === 'ARS' && to === 'USD') return value / rate;
    return value;
  }

  constructor(
    private readonly db: PrismaService,
    private readonly whatsAppNotifications: WhatsAppNotificationsService,
    private readonly notifications: NotificationsService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async getSettings() {
    return this.prisma.$transaction(async (tx) => {
      const settings = await tx.sales_flow_settings.upsert({
        where: { settings_key: 'default' },
        update: {},
        create: { settings_key: 'default' },
      });
      await this.syncDocumentTypes(tx, settings.accounting_basis, settings.payment_document_basis);
      const { default_commission_assignments: _commissionAssignments, ...visibleSettings } = settings;
      return visibleSettings;
    });
  }

  private async getCommissionSellers(client: any) {
    const [employees, partners] = await Promise.all([
      client.employees.findMany({
        where: { deleted_at: null, is_active: true, is_salesperson: true },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          party_id: true,
          default_commission_rate: true,
          commission_base: true,
        },
      }),
      client.partners.findMany({
        where: { deleted_at: null, is_active: true, is_salesperson: true, partner_kind: 'PARTNER', party_id: { not: null } },
        select: { id: true, first_name: true, last_name: true, party_id: true, default_commission_rate: true, commission_base: true },
      }),
    ]);

    return [
      ...employees.map((seller: any) => ({
        id: seller.id,
        seller_type: 'EMPLOYEE' as const,
        name: `${seller.first_name} ${seller.last_name}`.trim(),
        party_id: seller.party_id,
        default_commission_rate: Number(seller.default_commission_rate ?? 0),
        commission_base: seller.commission_base ?? 'INVOICED',
      })),
      ...partners.map((seller: any) => ({
        id: seller.id,
        seller_type: 'PARTNER' as const,
        name: `${seller.first_name} ${seller.last_name}`.trim(),
        party_id: seller.party_id,
        default_commission_rate: Number(seller.default_commission_rate ?? 0),
        commission_base: seller.commission_base ?? 'INVOICED',
      })),
    ].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }

  async getCommissionSettings() {
    return this.prisma.$transaction(async (tx) => {
      const settings = await tx.sales_flow_settings.upsert({
        where: { settings_key: 'default' },
        update: {},
        create: { settings_key: 'default' },
      });
      const assignments = Array.isArray(settings.default_commission_assignments)
        ? settings.default_commission_assignments
        : [];
      return {
        assignments,
        sellers: await this.getCommissionSellers(tx),
      };
    });
  }

  async updateCommissionSettings(dto: UpdateSalesFlowCommissionSettingsDto, userId: string) {
    const assignments = dto.assignments ?? [];
    const identity = (item: { seller_type: string; seller_id: string }) => `${item.seller_type}:${item.seller_id}`;
    if (new Set(assignments.map(identity)).size !== assignments.length) {
      throw new BadRequestException('Un vendedor no puede repetirse en la configuración');
    }
    if (assignments.some((item) =>
      !Number.isFinite(Number(item.participation_rate))
      || Number(item.participation_rate) < 0.01
      || Number(item.participation_rate) > 100
      || !Number.isFinite(Number(item.commission_rate))
      || Number(item.commission_rate) < 0
      || Number(item.commission_rate) > 100
    )) {
      throw new BadRequestException('La participación debe ser mayor que 0% y hasta 100%; la comisión puede ser de 0% a 100%');
    }

    await this.prisma.$transaction(async (tx) => {
      const employeeIds = assignments.filter((item) => item.seller_type === 'EMPLOYEE').map((item) => item.seller_id);
      const partnerIds = assignments.filter((item) => item.seller_type === 'PARTNER').map((item) => item.seller_id);
      const [employees, partners] = await Promise.all([
        employeeIds.length
          ? tx.employees.findMany({
              where: { id: { in: employeeIds }, deleted_at: null, is_active: true, is_salesperson: true },
              select: { id: true },
            })
          : [],
        partnerIds.length
          ? tx.partners.findMany({
              where: { id: { in: partnerIds }, deleted_at: null, is_active: true, is_salesperson: true, partner_kind: 'PARTNER', party_id: { not: null } },
              select: { id: true },
            })
          : [],
      ]);
      if (employees.length !== employeeIds.length || partners.length !== partnerIds.length) {
        throw new BadRequestException('Cada vendedor debe estar activo y habilitado para comisionar');
      }

      await tx.sales_flow_settings.upsert({
        where: { settings_key: 'default' },
        update: { default_commission_assignments: assignments as any, active_from: new Date(), updated_by: userId },
        create: {
          settings_key: 'default',
          default_commission_assignments: assignments as any,
          created_by: userId,
          updated_by: userId,
        },
      });
    });

    return this.getCommissionSettings();
  }

  async updatePartnerShareSettings(dto: UpdatePartnerShareSettingsDto, userId: string) {
    await this.prisma.sales_flow_settings.upsert({
      where: { settings_key: 'default' },
      update: { partner_share_basis: dto.partner_share_basis, active_from: new Date(), updated_by: userId },
      create: {
        settings_key: 'default',
        partner_share_basis: dto.partner_share_basis,
        created_by: userId,
        updated_by: userId,
      },
    });
    return this.getSettings();
  }

  private async syncDocumentTypes(tx: any, accountingBasis: string, paymentDocumentBasis: string) {
    const orderAffectsAccounting = ['ORDER', 'ORDER_THEN_INVOICE'].includes(accountingBasis);
    const invoiceAffectsAccounting = ['INVOICE', 'ORDER_THEN_INVOICE'].includes(accountingBasis);
    const orderAffectsPayment = ['ORDER', 'BOTH'].includes(paymentDocumentBasis);
    const invoiceAffectsPayment = ['INVOICE', 'BOTH'].includes(paymentDocumentBasis);

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
  }

  private deliveryStatusLabel(status: string) {
    return ({
      PENDING: 'pendiente de condiciones',
      ELIGIBLE: 'habilitada para remitir',
      DRAFT_CREATED: 'con remito en borrador',
      DELIVERED: 'entregada',
    } as Record<string, string>)[status] ?? status;
  }

  async updateSettings(dto: UpdateSalesFlowSettingsDto, userId: string) {
    if (dto.require_payment_for_delivery && dto.delivery_payment_percentage <= 0) {
      throw new BadRequestException('El porcentaje requerido debe ser mayor que cero cuando se controla el pago');
    }
    if (dto.default_order_assignee_id) {
      const companyId = getCurrentCompanyId();
      const membership = companyId
        ? await this.db.getDefaultClient().company_users.findUnique({
            where: { company_id_user_id: { company_id: companyId, user_id: dto.default_order_assignee_id } },
          })
        : null;
      if (!membership) throw new BadRequestException('El responsable predeterminado no pertenece a esta empresa');
    }
    if (dto.default_order_auditor_id) {
      const companyId = getCurrentCompanyId();
      const membership = companyId
        ? await this.db.getDefaultClient().company_users.findUnique({
            where: { company_id_user_id: { company_id: companyId, user_id: dto.default_order_auditor_id } },
          })
        : null;
      if (!membership) throw new BadRequestException('El auditor predeterminado no pertenece a esta empresa');
    }
    return this.prisma.$transaction(async (tx) => {
      const settings = await tx.sales_flow_settings.upsert({
        where: { settings_key: 'default' },
        update: { ...dto, active_from: new Date(), updated_by: userId },
        create: { settings_key: 'default', ...dto, created_by: userId, updated_by: userId },
      });

      await this.syncDocumentTypes(tx, dto.accounting_basis, dto.payment_document_basis);

      const recalculatedDeliveryOrders = await this.reapplyDeliveryRulesToUnstartedOrders(tx, settings, userId);

      const { default_commission_assignments: _commissionAssignments, ...visibleSettings } = settings;
      return { ...visibleSettings, recalculated_delivery_orders: recalculatedDeliveryOrders };
    }, { maxWait: 10_000, timeout: 60_000 });
  }

  private async reapplyDeliveryRulesToUnstartedOrders(tx: any, settings: any, userId: string) {
    const batchSize = 50;
    let afterId: string | undefined;
    let recalculated = 0;

    while (true) {
      const operations = await tx.commercial_operations.findMany({
        where: {
          delivery_note_id: null,
          delivery_status: { in: ['PENDING', 'ELIGIBLE'] },
          root_document: { is: { deleted_at: null, status: { not: 8 } } },
          OR: [
            { require_payment_for_delivery: { not: settings.require_payment_for_delivery } },
            { delivery_payment_percentage: { not: settings.delivery_payment_percentage } },
            { require_invoice_for_delivery: { not: settings.require_invoice_for_delivery } },
          ],
          ...(afterId ? { id: { gt: afterId } } : {}),
        },
        select: { id: true },
        orderBy: { id: 'asc' },
        take: batchSize,
      });
      if (!operations.length) break;

      const ids = operations.map((operation: { id: string }) => operation.id);
      await tx.commercial_operations.updateMany({
        where: { id: { in: ids } },
        data: {
          require_payment_for_delivery: settings.require_payment_for_delivery,
          delivery_payment_percentage: settings.delivery_payment_percentage,
          require_invoice_for_delivery: settings.require_invoice_for_delivery,
          updated_by: userId,
        },
      });
      for (const operation of operations) {
        await this.refresh(operation.id, tx);
      }

      recalculated += operations.length;
      afterId = operations[operations.length - 1].id;
    }

    return recalculated;
  }

  async createForOrder(tx: any, document: { id: string; party_id: string | null; currency_code: string | null; total: any }, userId?: string) {
    const settings = await tx.sales_flow_settings.upsert({
      where: { settings_key: 'default' }, update: {}, create: { settings_key: 'default' },
    });
    await this.syncDocumentTypes(tx, settings.accounting_basis, settings.payment_document_basis);
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
    const sharePartners = await tx.partners.findMany({
      where: {
        deleted_at: null,
        is_active: true,
        partner_kind: 'PARTNER',
        party_id: { not: null },
        share_percentage: { gt: 0, lte: 100 },
      },
      select: { id: true, share_percentage: true },
    });
    if (sharePartners.length) {
      await tx.sales_partner_share_assignments.createMany({
        data: sharePartners.map((partner: any) => ({
          document_id: document.id,
          partner_id: partner.id,
          share_percentage: partner.share_percentage,
          calculation_basis: settings.partner_share_basis ?? 'ORDER',
          created_by: userId,
        })),
      });
    }
    const defaults = Array.isArray(settings.default_commission_assignments)
      ? settings.default_commission_assignments as Array<{
          seller_type: 'EMPLOYEE' | 'PARTNER';
          seller_id: string;
          participation_rate: number;
          commission_rate: number;
          commission_base: 'INVOICED' | 'PAID';
        }>
      : [];
    if (defaults.length) {
      await tx.sales_commission_assignments.createMany({
        data: defaults.map((assignment) => ({
          document_id: document.id,
          seller_type: assignment.seller_type,
          seller_id: assignment.seller_type === 'EMPLOYEE' ? assignment.seller_id : null,
          partner_id: assignment.seller_type === 'PARTNER' ? assignment.seller_id : null,
          participation_rate: assignment.participation_rate,
          commission_rate: assignment.commission_rate,
          commission_base: assignment.commission_base,
          created_by: userId,
        })),
      });
    }
    return operation;
  }

  async inheritFromParent(tx: any, documentId: string, parentDocumentId?: string | null) {
    if (!parentDocumentId) return null;
    const parent = await tx.documents.findUnique({ where: { id: parentDocumentId }, select: { commercial_operation_id: true } });
    if (!parent?.commercial_operation_id) return null;
    await tx.documents.update({ where: { id: documentId }, data: { commercial_operation_id: parent.commercial_operation_id } });
    return parent.commercial_operation_id;
  }

  async refresh(operationId: string, client: any = this.prisma) {
    const operation = await client.commercial_operations.findUnique({
      where: { id: operationId },
      include: {
        documents: { where: { deleted_at: null }, include: { document_types: { select: { category: true } } } },
        root_document: { select: { currency_code: true } },
      },
    });
    if (!operation) return null;

    const invoices = operation.documents.filter((d: any) => d.document_types.category === 'INVOICE' && d.status !== 3);
    const invoicedTotal = invoices.reduce((sum: number, d: any) => sum + Number(d.total), 0);
    const applications = await client.payment_documents.findMany({
      where: {
        deleted_at: null,
        document: { commercial_operation_id: operationId },
        payment: { status: { in: ['CONFIRMED', 'PAID'] }, deleted_at: null },
      },
      select: {
        amount_applied: true,
        payment: { select: { currency_code: true, exchange_rate: true } },
        document: { select: { currency_code: true, exchange_rate: true } },
      },
    });
    const operationCurrency = operation.currency_code ?? operation.root_document?.currency_code ?? 'ARS';
    const paidTotal = applications.reduce((sum: number, item: any) => {
      const amount = Number(item.amount_applied);
      const paymentCurrency = item.payment?.currency_code ?? operationCurrency;
      const rateValue = item.payment?.exchange_rate ?? item.document?.exchange_rate;
      const rate = rateValue == null ? null : Number(rateValue);
      return sum + this.convertPaymentAmount(amount, paymentCurrency, operationCurrency, rate);
    }, 0);
    const orderedTotal = Number(operation.ordered_total);
    const percentage = orderedTotal > 0 ? (paidTotal / orderedTotal) * 100 : 100;
    const paymentReady = !operation.require_payment_for_delivery || percentage + 0.0001 >= Number(operation.delivery_payment_percentage);
    const invoiceReady = !operation.require_invoice_for_delivery || invoicedTotal > 0;
    const eligible = paymentReady && invoiceReady;
    const alreadyDelivered = ['DRAFT_CREATED', 'DELIVERED'].includes(operation.delivery_status);

    const updated = await client.commercial_operations.update({
      where: { id: operationId },
      data: {
        invoiced_total: invoicedTotal,
        paid_total: paidTotal,
        ...(!alreadyDelivered ? { delivery_status: eligible ? 'ELIGIBLE' : 'PENDING', released_at: eligible ? operation.released_at ?? new Date() : null } : {}),
      },
    });

    const isDeliveryConditionTransition = operation.delivery_status !== updated.delivery_status
      && ['PENDING', 'ELIGIBLE'].includes(operation.delivery_status)
      && ['PENDING', 'ELIGIBLE'].includes(updated.delivery_status);
    if (isDeliveryConditionTransition) {
      const root = await client.documents.findUnique({
        where: { id: operation.root_document_id },
        select: {
          id: true,
          number: true,
          auditor_user_id: true,
          document_types: { select: { description: true } },
        },
      });
      if (root) {
        const message = `${root.document_types.description} N.º ${root.number}: condición de entrega ${this.deliveryStatusLabel(operation.delivery_status)} → ${this.deliveryStatusLabel(updated.delivery_status)}.`;
        const recordActivity = (tx: any) => this.notifications.createDocumentActivity({
          tx,
          documentId: root.id,
          auditorUserId: root.auditor_user_id,
          actorUserId: requestContext.getStore()?.userId ?? null,
          eventType: 'DELIVERY_STATUS_CHANGED',
          message,
          notificationTitle: 'Cambió la condición de entrega de una OV bajo tu seguimiento',
          targetPath: `/erp/sales/${root.id}`,
        });
        if (typeof client.$transaction === 'function') {
          await client.$transaction(recordActivity);
        } else {
          await recordActivity(client);
        }
      }
    }

    const becameReadyForDelivery = operation.delivery_status !== 'ELIGIBLE'
      && updated.delivery_status === 'ELIGIBLE'
      && operation.require_payment_for_delivery;
    // refresh() is also called with a transaction client while rules are being
    // recalculated. Queue the WhatsApp only after a committed request-level refresh.
    if (becameReadyForDelivery && typeof client.$transaction === 'function') {
      const companyId = getCurrentCompanyId();
      if (companyId) {
        try {
          const root = await client.documents.findUnique({
            where: { id: operation.root_document_id },
            select: {
              id: true,
              number: true,
              descrip: true,
              ref: true,
              assigned_to: true,
              business_parties: { select: { name: true } },
            },
          });
          if (root?.assigned_to) {
            await this.whatsAppNotifications.enqueueOrderReadyForDelivery({
              companyId,
              recipientUserId: root.assigned_to,
              documentId: root.id,
              operationId: operation.id,
              documentNumber: root.number,
              documentReference: root.ref?.trim() || root.descrip?.trim(),
              partyName: root.business_parties?.name,
              readyAt: updated.released_at ?? new Date(),
            });
          }
        } catch (error) {
          // The commercial operation must remain valid even if WhatsApp is unavailable.
          this.logger.warn(`No se pudo encolar el aviso de OV lista para entrega ${operation.root_document_id}: ${String(error)}`);
        }
      }
    }

    return updated;
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
