import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateHrValeDto } from './dto/create-hr-vale.dto';
import { ConfirmHrValeDto } from './dto/confirm-hr-vale.dto';
import { parseLocalDateTime } from '@/common/utils/dates';
import { recalculateCurrentAccountLedger, removeDocumentAccountEffects } from '../current-accounts/current-account-ledger';
import { BankMovementsService } from '../bank-movements/bank-movements.service';
import { CreatePartnerInvestmentPlanDto } from './dto/create-partner-investment-plan.dto';

@Injectable()
export class HrService {
  private readonly logger = new Logger(HrService.name);

  constructor(
    private db: PrismaService,
    private bankMovements: BankMovementsService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  /** Calcula la comisión acumulada de una OV y descuenta liquidaciones anteriores. */
  private async getCommissionMetrics(
    documentId: string,
    ovSubtotal: number,
    ovTotal: number,
    commissionRate: number,
    commissionBase?: string | null,
    asOf?: Date,
    sellerId?: string,
    sellerType: 'EMPLOYEE' | 'PARTNER' = 'EMPLOYEE',
    participationRate = 100,
    dbClient: any = this.prisma,
  ) {
    const document = await dbClient.documents.findUnique({
      where: { id: documentId },
      select: { commercial_operation_id: true },
    });

    let baseAmount = 0;
    if (commissionBase === 'PAID') {
      const applications = await dbClient.payment_documents.findMany({
        where: {
          deleted_at: null,
          payment: {
            deleted_at: null,
            status: { in: ['CONFIRMED', 'PAID'] },
            ...(asOf ? { date: { lte: asOf } } : {}),
          },
          OR: document?.commercial_operation_id
            ? [{ document: { commercial_operation_id: document.commercial_operation_id } }]
            : [{ document_id: documentId }, { document: { parent_document_id: documentId } }],
        },
        select: { amount_applied: true },
      });
      const paidGross = applications.reduce((sum, item) => sum + Number(item.amount_applied), 0);
      baseAmount = ovTotal > 0 ? ovSubtotal * Math.min(paidGross / ovTotal, 1) : 0;
    } else {
      const invoices = await dbClient.documents.findMany({
        where: {
          parent_document_id: documentId,
          deleted_at: null,
          status: { in: [1, 2] },
          ...(asOf ? { date: { lte: asOf } } : {}),
          document_types: { category: 'INVOICE' },
        },
        select: { subtotal: true },
      });
      baseAmount = Math.min(
        ovSubtotal,
        invoices.reduce((sum, invoice) => sum + Number(invoice.subtotal), 0),
      );
    }

    const details = await dbClient.hr_vale_commission_details.findMany({
      where: {
        document_id: documentId,
        ...(sellerId
          ? sellerType === 'PARTNER'
            ? { seller_type: 'PARTNER', partner_id: sellerId }
            : { seller_type: 'EMPLOYEE', seller_id: sellerId }
          : {}),
        hr_vale: {
          deleted_at: null,
          status: { not: 'CANCELLED' },
          ...(asOf ? { date: { lte: asOf } } : {}),
        },
      },
      select: { commission_amount: true },
    });
    const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
    const settledAmount = round2(details.reduce((sum, detail) => sum + Number(detail.commission_amount), 0));
    const accruedAmount = round2((((baseAmount * participationRate) / 100) * commissionRate) / 100);

    return {
      baseAmount,
      accruedAmount,
      settledAmount,
      pendingAmount: round2(Math.max(0, accruedAmount - settledAmount)),
    };
  }

  /** Calcula participación societaria en lote para no cargar facturas y vales por cada OV. */
  private async getPartnerShareMetricsForAssignments(assignments: any[], asOf: Date, dbClient: any = this.prisma) {
    const metrics = new Map<string, { baseAmount: number; accruedAmount: number; settledAmount: number; pendingAmount: number }>();
    if (!assignments.length) return metrics;

    const documentIds = [...new Set(assignments.map((assignment) => assignment.document_id))];
    const partnerIds = [...new Set(assignments.map((assignment) => assignment.partner_id))];
    const invoiceDocumentIds = assignments
      .filter((assignment) => assignment.calculation_basis === 'INVOICED')
      .map((assignment) => assignment.document_id);

    const [invoices, settledDetails] = await Promise.all([
      invoiceDocumentIds.length
        ? dbClient.documents.findMany({
            where: {
              parent_document_id: { in: [...new Set(invoiceDocumentIds)] },
              deleted_at: null,
              status: { in: [1, 2] },
              date: { lte: asOf },
              document_types: { category: 'INVOICE' },
            },
            select: { parent_document_id: true, subtotal: true, currency_code: true },
          })
        : [],
      dbClient.hr_vale_partner_share_details.findMany({
        where: {
          document_id: { in: documentIds },
          partner_id: { in: partnerIds },
          hr_vale: { deleted_at: null, status: { not: 'CANCELLED' }, date: { lte: asOf } },
        },
        select: { document_id: true, partner_id: true, share_amount: true },
      }),
    ]);

    const invoiceTotals = new Map<string, number>();
    const assignmentByDocument = new Map(assignments.map((assignment) => [assignment.document_id, assignment]));
    for (const invoice of invoices) {
      const assignment = assignmentByDocument.get(invoice.parent_document_id);
      if (!assignment || (invoice.currency_code && assignment.document.currency_code && invoice.currency_code !== assignment.document.currency_code)) continue;
      invoiceTotals.set(invoice.parent_document_id, (invoiceTotals.get(invoice.parent_document_id) ?? 0) + Number(invoice.subtotal));
    }

    const settledTotals = new Map<string, number>();
    for (const detail of settledDetails) {
      const key = `${detail.document_id}:${detail.partner_id}`;
      settledTotals.set(key, (settledTotals.get(key) ?? 0) + Number(detail.share_amount));
    }

    const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
    for (const assignment of assignments) {
      const documentSubtotal = Number(assignment.document.subtotal);
      const baseAmount = assignment.calculation_basis === 'ORDER'
        ? assignment.document.status > 0 && assignment.document.status !== 8 ? documentSubtotal : 0
        : Math.min(documentSubtotal, invoiceTotals.get(assignment.document_id) ?? 0);
      const accruedAmount = round2((baseAmount * Number(assignment.share_percentage)) / 100);
      const settledAmount = round2(settledTotals.get(`${assignment.document_id}:${assignment.partner_id}`) ?? 0);
      metrics.set(`${assignment.document_id}:${assignment.partner_id}`, {
        baseAmount,
        accruedAmount,
        settledAmount,
        pendingAmount: round2(Math.max(0, accruedAmount - settledAmount)),
      });
    }
    return metrics;
  }

  // ══════════════════════════════════════════════════════════
  // VALES
  // ══════════════════════════════════════════════════════════

  async createVale(dto: CreateHrValeDto, userId: string) {
    if (!Number.isFinite(dto.amount) || dto.amount <= 0) throw new BadRequestException('El importe debe ser mayor a cero');
    const party = await this.prisma.business_parties.findUnique({
      where: { id: dto.party_id },
    });
    if (!party) {
      throw new NotFoundException('Persona no encontrada');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM tenant.business_parties WHERE id = ${dto.party_id}::uuid FOR UPDATE`;
      const partner = dto.party_type === 'PARTNER'
        ? await tx.partners.findFirst({ where: { party_id: dto.party_id, deleted_at: null }, select: { partner_kind: true } })
        : null;
      const allowedTypes = dto.party_type === 'PARTNER'
        ? partner?.partner_kind === 'INVESTOR'
          ? ['APORTE', 'RETIRO']
          : ['APORTE', 'RETIRO', 'SUELDO', 'COMISION', 'REEMBOLSO', 'PRESTAMO']
        : dto.party_type === 'EMPLOYEE' ? ['SUELDO', 'ADELANTO', 'EXTRAS', 'COMISION'] : [];
      if (!allowedTypes.includes(dto.type)) throw new BadRequestException('El concepto no corresponde al tipo de persona');

      const lastVale = await tx.hr_vales.findFirst({
        where: { party_id: dto.party_id },
        orderBy: { number: 'desc' },
      });
      return tx.hr_vales.create({
        data: {
          number: (lastVale?.number ?? 0) + 1,
          party_id: dto.party_id,
          party_type: dto.party_type,
          type: dto.type as any,
          amount: dto.amount,
          currency_code: dto.currency_code.toUpperCase(),
          exchange_rate: dto.exchange_rate,
          rate_type: (dto.rate_type as any) ?? 'OFFICIAL',
          converted_amount: dto.converted_amount,
          date: parseLocalDateTime(dto.date),
          description: dto.description,
          status: 'DRAFT',
          created_by: userId,
        },
        include: {
          party: { select: { id: true, name: true, tax_id: true } },
        },
      });
    });
  }

  async findAllVales(params?: {
    party_id?: string;
    party_type?: string;
    status?: string;
    type?: string;
    user_id?: string;
  }) {
    const where: any = { deleted_at: null };

    if (params?.party_id) where.party_id = params.party_id;
    if (params?.party_type) where.party_type = params.party_type;
    if (params?.status) where.status = params.status;
    if (params?.type) where.type = params.type;
    if (params?.user_id) where.created_by = params.user_id;

    const vales = await this.prisma.hr_vales.findMany({
      where,
      include: {
        party: {
          select: {
            id: true,
            name: true,
            tax_id: true,
            partners: { where: { deleted_at: null }, take: 1, select: { partner_kind: true } },
          },
        },
      },
      orderBy: [{ date: 'desc' }, { created_at: 'desc' }],
    });

    const employeeVales = vales.filter((vale) => vale.party_type === 'EMPLOYEE' || ['SUELDO', 'ADELANTO', 'EXTRAS', 'COMISION'].includes(vale.type));
    const cancelledVales = vales.filter((vale) => vale.status === 'CANCELLED');
    const documentLookupVales = [...new Map([...employeeVales, ...cancelledVales].map((vale) => [vale.id, vale])).values()];
    const valeDocuments = documentLookupVales.length
      ? await this.prisma.documents.findMany({
          where: {
            document_types: { category: 'VALE' },
            OR: documentLookupVales.map((vale) => ({ party_id: vale.party_id, descrip: `Vale #${vale.number}` })),
          },
          orderBy: { created_at: 'desc' },
          select: { id: true, party_id: true, descrip: true, total: true, paid_amount: true, status: true, deleted_at: true },
        })
      : [];
    const cancelledValeKeys = new Set(cancelledVales.map((vale) => `${vale.party_id}:Vale #${vale.number}`));
    const cancelledValeDocuments = valeDocuments.filter((document) => cancelledValeKeys.has(`${document.party_id}:${document.descrip}`));
    const cancelledValeDocumentIds = cancelledValeDocuments.map((document) => document.id);
    const [activeValeLedgerEntries, activeValePayments] = cancelledValeDocumentIds.length
      ? await Promise.all([
          this.prisma.current_account_entries.findMany({
            where: {
              reference_id: { in: cancelledValeDocumentIds },
              reference_type: { in: ['document', 'document_reversal', 'order_invoice_replacement', 'order_invoice_replacement_reversal'] },
              deleted_at: null,
            },
            select: { reference_id: true },
          }),
          this.prisma.payment_documents.findMany({
            where: {
              document_id: { in: cancelledValeDocumentIds },
              deleted_at: null,
              payment: { deleted_at: null, status: { notIn: ['CANCELLED', 'REVERSED'] } },
            },
            select: { document_id: true },
          }),
        ])
      : [[], []];
    const valeDocumentsByKey = new Map<string, (typeof valeDocuments)[number]>();
    for (const document of valeDocuments) {
      const key = `${document.party_id}:${document.descrip}`;
      if (!valeDocumentsByKey.has(key)) valeDocumentsByKey.set(key, document);
    }
    const valeDocumentsWithLedgerEntries = new Set(activeValeLedgerEntries.map((entry) => entry.reference_id).filter(Boolean));
    const valeDocumentsWithActivePayments = new Set(activeValePayments.map((payment) => payment.document_id));
    const paymentDocumentByVale = new Map<string, { id: string; pending: number }>();
    for (const vale of employeeVales) {
      const document = valeDocumentsByKey.get(`${vale.party_id}:Vale #${vale.number}`);
      if (document) {
        paymentDocumentByVale.set(`${document.party_id}:${document.descrip}`, {
          id: document.id,
          pending: Math.max(0, Number(document.total) - Number(document.paid_amount)),
        });
      }
    }

    const partnerValeIds = vales.filter((vale) => vale.party_type === 'PARTNER').map((vale) => vale.id);
    const cancelledPartnerValeIds = vales
      .filter((vale) => vale.party_type === 'PARTNER' && vale.status === 'CANCELLED')
      .map((vale) => vale.id);
    const [cashMovements, bankMovements, cashCancellations, bankCancellations] = await Promise.all([
      partnerValeIds.length
        ? this.prisma.cash_box_movements.findMany({
            where: { reference_type: 'hr_vale', reference_id: { in: partnerValeIds }, deleted_at: null },
            select: { reference_id: true, cash_box: { select: { name: true } } },
          })
        : Promise.resolve([]),
      partnerValeIds.length
        ? this.prisma.bank_account_movements.findMany({
            where: { reference_type: 'hr_vale', reference_id: { in: partnerValeIds }, deleted_at: null },
            select: { reference_id: true, bank_account: { select: { name: true, bank_name: true } } },
          })
        : Promise.resolve([]),
      cancelledPartnerValeIds.length
        ? this.prisma.cash_box_movements.findMany({
            where: { reference_type: 'hr_vale_cancellation', reference_id: { in: cancelledPartnerValeIds }, deleted_at: null },
            select: { reference_id: true },
          })
        : Promise.resolve([]),
      cancelledPartnerValeIds.length
        ? this.prisma.bank_account_movements.findMany({
            where: { reference_type: 'hr_vale_cancellation', reference_id: { in: cancelledPartnerValeIds }, deleted_at: null },
            select: { reference_id: true },
          })
        : Promise.resolve([]),
    ]);
    const activeCashValeIds = new Set(cashMovements.map((movement) => movement.reference_id).filter(Boolean));
    const activeBankValeIds = new Set(bankMovements.map((movement) => movement.reference_id).filter(Boolean));
    const cancelledCashValeIds = new Set(cashCancellations.map((movement) => movement.reference_id).filter(Boolean));
    const cancelledBankValeIds = new Set(bankCancellations.map((movement) => movement.reference_id).filter(Boolean));
    const treasuryReconciliationValeIds = new Set(
      cancelledPartnerValeIds.filter((id) =>
        (activeCashValeIds.has(id) && !cancelledCashValeIds.has(id))
        || (!activeCashValeIds.has(id) && activeBankValeIds.has(id) && !cancelledBankValeIds.has(id)),
      ),
    );
    const treasuryTargetByVale = new Map<string, { type: 'CASH_BOX' | 'BANK_ACCOUNT'; label: string }>();
    for (const movement of cashMovements) {
      if (movement.reference_id) {
        treasuryTargetByVale.set(movement.reference_id, {
          type: 'CASH_BOX',
          label: `Caja · ${movement.cash_box.name}`,
        });
      }
    }
    for (const movement of bankMovements) {
      if (movement.reference_id && !treasuryTargetByVale.has(movement.reference_id) && movement.bank_account) {
        treasuryTargetByVale.set(movement.reference_id, {
          type: 'BANK_ACCOUNT',
          label: `Banco · ${[movement.bank_account.bank_name, movement.bank_account.name].filter(Boolean).join(' · ')}`,
        });
      }
    }

    // Resolver created_by a nombre de usuario
    const userIds = [...new Set(vales.map((v) => v.created_by).filter(Boolean))] as string[];
    const users =
      userIds.length > 0
        ? await this.db.getDefaultClient().users.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true },
          })
        : [];
    const userMap = new Map(users.map((u) => [u.id, u.name]));

    return vales.map((v) => ({
      ...v,
      partner_kind: v.party_type === 'PARTNER' ? v.party.partners[0]?.partner_kind ?? 'PARTNER' : null,
      created_by_name: v.created_by ? (userMap.get(v.created_by) ?? null) : null,
      treasury_target: treasuryTargetByVale.get(v.id) ?? null,
      document_needs_reconciliation: (() => {
        const document = valeDocumentsByKey.get(`${v.party_id}:Vale #${v.number}`);
        return v.status === 'CANCELLED' && Boolean(document) && (
          document.status !== 3
          || Number(document.paid_amount) !== 0
          || document.deleted_at === null
          || valeDocumentsWithLedgerEntries.has(document.id)
        );
      })(),
      document_reconciliation_blocked: (() => {
        const document = valeDocumentsByKey.get(`${v.party_id}:Vale #${v.number}`);
        return Boolean(document && valeDocumentsWithActivePayments.has(document.id));
      })(),
      treasury_needs_reconciliation: treasuryReconciliationValeIds.has(v.id),
      payment_document: v.party_type === 'EMPLOYEE' || ['SUELDO', 'ADELANTO', 'EXTRAS', 'COMISION'].includes(v.type)
        ? paymentDocumentByVale.get(`${v.party_id}:Vale #${v.number}`) ?? null
        : null,
    }));
  }

  async findOneVale(id: string) {
    const vale = await this.prisma.hr_vales.findUnique({
      where: { id },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
        commission_details: {
          include: {
            document: {
              select: { id: true, number: true, date: true },
            },
          },
        },
        partner_share_details: {
          include: {
            document: { select: { id: true, number: true, date: true } },
          },
        },
      },
    });

    if (!vale) {
      throw new NotFoundException('Vale no encontrado');
    }

    return vale;
  }

  async getPartnerFunds(partyId: string, currencyCode: string, client: any = this.prisma, excludeInstallmentId?: string) {
    const totals = await client.hr_vales.groupBy({
      by: ['type'],
      where: { party_id: partyId, party_type: 'PARTNER', currency_code: currencyCode, type: { in: ['APORTE', 'RETIRO'] }, status: { in: ['CONFIRMED', 'PAID'] }, deleted_at: null },
      _sum: { amount: true },
    });
    const contributions = Number(totals.find((row: any) => row.type === 'APORTE')?._sum.amount ?? 0);
    const withdrawals = Number(totals.find((row: any) => row.type === 'RETIRO')?._sum.amount ?? 0);
    const balance = Math.round((contributions - withdrawals) * 100) / 100;
    const plannedWithdrawalsResult = client.hr_partner_investment_installments?.aggregate
      ? await client.hr_partner_investment_installments.aggregate({
          where: {
            ...(excludeInstallmentId ? { id: { not: excludeInstallmentId } } : {}),
            plan: { currency_code: currencyCode, partner: { party_id: partyId, deleted_at: null } },
            vale: { status: 'DRAFT', deleted_at: null },
          },
          _sum: { amount: true },
        })
      : { _sum: { amount: 0 } };
    const plannedWithdrawals = Math.round((Number(plannedWithdrawalsResult._sum.amount ?? 0) + Number.EPSILON) * 100) / 100;
    const remuneration = await client.documents.aggregate({
      where: { party_id: partyId, currency_code: currencyCode, document_types: { category: 'VALE' }, ref: { in: ['SUELDO', 'ADELANTO', 'EXTRAS', 'COMISION'] }, status: 2, deleted_at: null },
      _sum: { total: true, paid_amount: true },
    });
    const remunerationPending = Math.max(0, Math.round((Number(remuneration._sum.total ?? 0) - Number(remuneration._sum.paid_amount ?? 0)) * 100) / 100);
    return {
      currency_code: currencyCode,
      contributions,
      withdrawals,
      balance,
      planned_withdrawals: plannedWithdrawals,
      available: Math.max(0, Math.round((balance - plannedWithdrawals + Number.EPSILON) * 100) / 100),
      remuneration_pending: remunerationPending,
    };
  }

  async getPartnerInvestmentPlans(partnerId: string) {
    const partner = await this.prisma.partners.findFirst({
      where: { id: partnerId, partner_kind: 'INVESTOR', deleted_at: null },
      select: { id: true },
    });
    if (!partner) throw new NotFoundException('Inversionista no encontrado');

    const plans = await this.prisma.hr_partner_investment_plans.findMany({
      where: { partner_id: partnerId },
      include: {
        installments: {
          include: {
            vale: { select: { id: true, number: true, amount: true, date: true, status: true, description: true } },
          },
          orderBy: { installment_number: 'asc' },
        },
      },
      take: 100,
      orderBy: { created_at: 'desc' },
    });

    return plans.map((plan) => {
      const pendingAmount = plan.installments.reduce((sum, installment) =>
        sum + (installment.vale.status === 'DRAFT' ? Number(installment.amount) : 0), 0);
      const allCancelled = plan.installments.every((installment) => installment.vale.status === 'CANCELLED');
      const allPaid = plan.installments.every((installment) => installment.vale.status === 'PAID');
      return {
        ...plan,
        total_amount: Number(plan.total_amount),
        pending_amount: Math.round((pendingAmount + Number.EPSILON) * 100) / 100,
        status: allCancelled ? 'CANCELLED' : allPaid ? 'COMPLETED' : 'ACTIVE',
        installments: plan.installments.map((installment) => ({
          ...installment,
          amount: Number(installment.amount),
          vale: { ...installment.vale, amount: Number(installment.vale.amount) },
        })),
      };
    });
  }

  async createPartnerInvestmentPlan(partnerId: string, dto: CreatePartnerInvestmentPlanDto, userId: string) {
    const partner = await this.prisma.partners.findFirst({
      where: { id: partnerId, partner_kind: 'INVESTOR', is_active: true, deleted_at: null, party_id: { not: null } },
      select: { id: true, party_id: true },
    });
    if (!partner?.party_id) throw new NotFoundException('Inversionista activo no encontrado');
    if (dto.installments.length < 2 || dto.installments.length > 120) {
      throw new BadRequestException('El plan debe tener entre 2 y 120 cuotas');
    }

    const normalizedInstallments = dto.installments.map((installment) => ({
      date: parseLocalDateTime(installment.due_date),
      cents: Math.round(Number(installment.amount) * 100),
    }));
    if (normalizedInstallments.some((installment) => !Number.isFinite(installment.cents) || installment.cents < 1)) {
      throw new BadRequestException('Cada cuota debe ser mayor que cero y tener hasta dos decimales');
    }
    for (let index = 1; index < normalizedInstallments.length; index++) {
      if (normalizedInstallments[index].date <= normalizedInstallments[index - 1].date) {
        throw new BadRequestException('Ordená las cuotas por fecha y usá una fecha distinta para cada una');
      }
    }

    const totalCents = normalizedInstallments.reduce((sum, installment) => sum + installment.cents, 0);
    const totalAmount = totalCents / 100;
    const currencyCode = dto.currency_code.trim().toUpperCase();
    if (!currencyCode) throw new BadRequestException('Seleccioná la moneda del plan');

    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM tenant.business_parties WHERE id = ${partner.party_id}::uuid FOR UPDATE`;
      const currentPartner = await tx.partners.findFirst({
        where: { id: partnerId, partner_kind: 'INVESTOR', is_active: true, deleted_at: null, party_id: partner.party_id },
        select: { id: true },
      });
      if (!currentPartner) throw new BadRequestException('El inversionista ya no está activo');

      const existingPlan = await tx.hr_partner_investment_plans.findUnique({
        where: { idempotency_key: dto.idempotency_key },
        include: {
          installments: {
            include: { vale: { select: { id: true, number: true, amount: true, date: true, status: true, description: true } } },
            orderBy: { installment_number: 'asc' },
          },
        },
      });
      if (existingPlan) {
        if (existingPlan.partner_id !== partnerId) throw new BadRequestException('La clave de solicitud ya fue utilizada');
        return existingPlan;
      }

      const funds = await this.getPartnerFunds(partner.party_id!, currencyCode, tx);
      if (totalAmount > funds.available) {
        throw new BadRequestException(`El plan supera el saldo disponible para retirar: ${funds.available.toFixed(2)} ${currencyCode}`);
      }

      const lastVale = await tx.hr_vales.findFirst({
        where: { party_id: partner.party_id! },
        orderBy: { number: 'desc' },
        select: { number: true },
      });
      let nextValeNumber = (lastVale?.number ?? 0) + 1;
      const plan = await tx.hr_partner_investment_plans.create({
        data: {
          idempotency_key: dto.idempotency_key,
          partner_id: partnerId,
          currency_code: currencyCode,
          total_amount: totalAmount,
          description: dto.description?.trim() || null,
          created_by: userId,
        },
      });

      for (let index = 0; index < normalizedInstallments.length; index++) {
        const installment = normalizedInstallments[index];
        const installmentNumber = index + 1;
        const description = [
          `Cuota ${installmentNumber}/${normalizedInstallments.length} · Devolución de inversión`,
          dto.description?.trim(),
        ].filter(Boolean).join(' · ').slice(0, 255);
        const vale = await tx.hr_vales.create({
          data: {
            number: nextValeNumber++,
            party_id: partner.party_id!,
            party_type: 'PARTNER',
            type: 'RETIRO',
            amount: installment.cents / 100,
            currency_code: currencyCode,
            date: installment.date,
            description,
            status: 'DRAFT',
            created_by: userId,
          },
        });
        await tx.hr_partner_investment_installments.create({
          data: {
            plan_id: plan.id,
            installment_number: installmentNumber,
            amount: installment.cents / 100,
            due_date: installment.date,
            vale_id: vale.id,
          },
        });
      }

      return tx.hr_partner_investment_plans.findUniqueOrThrow({
        where: { id: plan.id },
        include: {
          installments: {
            include: { vale: { select: { id: true, number: true, amount: true, date: true, status: true, description: true } } },
            orderBy: { installment_number: 'asc' },
          },
        },
      });
    });
  }

  async confirmVale(id: string, userId: string, treasury?: ConfirmHrValeDto) {
    const vale = await this.findOneVale(id);

    if (vale.status !== 'DRAFT') {
      throw new BadRequestException('Solo se pueden confirmar vales en borrador');
    }

    const isDebit = ['RETIRO', 'REEMBOLSO', 'PRESTAMO'].includes(vale.type);
    const requiresTreasury = vale.party_type === 'PARTNER' && !['SUELDO', 'ADELANTO', 'EXTRAS', 'COMISION'].includes(vale.type);
    if (requiresTreasury && (!treasury?.treasury_target_type || !treasury.treasury_target_id)) {
      throw new BadRequestException('Seleccioná una caja o cuenta bancaria para registrar el movimiento del socio');
    }

    return this.prisma.$transaction(async (tx) => {
      // Serialize confirmations and cancellations for the same person.
      await tx.$queryRaw`SELECT id FROM tenant.business_parties WHERE id = ${vale.party_id}::uuid FOR UPDATE`;
      const currentVale = await tx.hr_vales.findUnique({ where: { id } });
      if (!currentVale || currentVale.status !== 'DRAFT' || currentVale.deleted_at) {
        throw new BadRequestException('El vale ya fue confirmado o anulado');
      }
      if (vale.party_type === 'PARTNER' && vale.type === 'RETIRO') {
        const investmentInstallment = await tx.hr_partner_investment_installments?.findUnique?.({
          where: { vale_id: vale.id },
          select: { id: true },
        });
        const funds = await this.getPartnerFunds(vale.party_id, vale.currency_code, tx, investmentInstallment?.id);
        if (Number(vale.amount) > funds.available) {
          throw new BadRequestException(`El retiro supera los aportes disponibles: ${funds.available.toFixed(2)} ${vale.currency_code}. Registrá un aporte o utilizá el concepto Préstamo si corresponde.`);
        }
      }
      let account = await tx.hr_accounts.findUnique({
        where: {
          party_id_currency_code: {
            party_id: vale.party_id,
            currency_code: vale.currency_code,
          },
        },
      });

      if (!account) {
        account = await tx.hr_accounts.create({
          data: {
            party_id: vale.party_id,
            party_type: vale.party_type,
            currency_code: vale.currency_code,
            balance: 0,
            created_by: userId,
          },
        });
      }

      const currentBalance = account.balance.toNumber();
      const amount = vale.amount.toNumber();
      const balanceAfter = isDebit ? currentBalance - amount : currentBalance + amount;

      await tx.hr_account_entries.create({
        data: {
          hr_account_id: account.id,
          type: isDebit ? 'VALE_DEBIT' : 'VALE_CREDIT',
          amount,
          currency_code: vale.currency_code,
          exchange_rate: vale.exchange_rate,
          rate_type: vale.rate_type,
          converted_amount: vale.converted_amount,
          balance_before: currentBalance,
          balance_after: balanceAfter,
          description: `Vale #${vale.number} - ${vale.type}`,
          reference_type: 'hr_vale',
          reference_id: vale.id,
          date: new Date(),
          created_by: userId,
        },
      });

      await tx.hr_accounts.update({
        where: { id: account.id },
        data: { balance: balanceAfter, updated_at: new Date() },
      });

      // Crear documento VALE + current_account_entry
      await this.createValeDocument(vale, userId, tx, requiresTreasury);

      if (requiresTreasury) {
        await this.createPartnerTreasuryMovement(vale, treasury!, isDebit, userId, tx);
      }

      return tx.hr_vales.update({
        where: { id },
        data: {
          status: requiresTreasury ? 'PAID' : 'CONFIRMED',
          paid_at: requiresTreasury ? new Date() : null,
          confirmed_at: new Date(),
          confirmed_by: userId,
          updated_at: new Date(),
        },
        include: {
          party: { select: { id: true, name: true, tax_id: true } },
        },
      });
    });
  }

  private async createPartnerTreasuryMovement(
    vale: any,
    treasury: ConfirmHrValeDto,
    isOutflow: boolean,
    userId: string,
    prisma: any,
  ) {
    const amount = vale.amount.toNumber();
    const concept = { APORTE: 'Aporte de fondos', RETIRO: 'Retiro de aportes', REEMBOLSO: 'Reembolso', PRESTAMO: 'Préstamo' }[vale.type as string] ?? vale.type;
    const description = `${concept} de socio · Vale #${vale.number}${vale.description ? ` · ${vale.description}` : ''}`;
    const commonData = {
      type: isOutflow ? 'PAYMENT' : 'COLLECTION',
      amount: vale.amount,
      currency_code: vale.currency_code,
      exchange_rate: vale.exchange_rate,
      rate_type: vale.rate_type,
      converted_amount: vale.converted_amount,
      description: description.substring(0, 255),
      reference_type: 'hr_vale',
      reference_id: vale.id,
      date: vale.date,
      created_by: userId,
    };

    if (treasury.treasury_target_type === 'CASH_BOX') {
      const cashBox = await prisma.cash_boxes.findFirst({
        where: { id: treasury.treasury_target_id, active: true, deleted_at: null },
      });
      if (!cashBox) throw new BadRequestException('Caja no encontrada o inactiva');
      if (cashBox.currency_code !== vale.currency_code) {
        throw new BadRequestException(
          `La caja opera en ${cashBox.currency_code} y el vale está expresado en ${vale.currency_code}`,
        );
      }
      if (!cashBox.current_session_id) {
        throw new BadRequestException('La caja seleccionada no tiene una sesión abierta');
      }

      const balance = await prisma.cash_box_balances.findUnique({
        where: { cash_box_id_currency_code: { cash_box_id: cashBox.id, currency_code: vale.currency_code } },
      });
      const before = balance?.balance.toNumber() ?? 0;
      const after = isOutflow ? before - amount : before + amount;
      if (isOutflow && after < 0) throw new BadRequestException('Saldo insuficiente en la caja');

      await prisma.cash_box_movements.create({
        data: {
          ...commonData,
          cash_box_id: cashBox.id,
          session_id: cashBox.current_session_id,
          balance_before: before,
          balance_after: after,
        },
      });
      if (balance) {
        await prisma.cash_box_balances.update({ where: { id: balance.id }, data: { balance: after } });
      } else {
        await prisma.cash_box_balances.create({
          data: { cash_box_id: cashBox.id, currency_code: vale.currency_code, balance: after, created_by: userId },
        });
      }
      await prisma.cash_box_sessions.update({
        where: { id: cashBox.current_session_id },
        data: {
          movement_count: { increment: 1 },
          ...(isOutflow ? { total_expenses: { increment: amount } } : { total_income: { increment: amount } }),
        },
      });
      return;
    }

    const bank = await prisma.bank_accounts.findFirst({
      where: { id: treasury.treasury_target_id, active: true, deleted_at: null },
    });
    if (!bank) throw new BadRequestException('Cuenta bancaria no encontrada o inactiva');
    if (bank.currency_code !== vale.currency_code) {
      throw new BadRequestException(
        `La cuenta bancaria opera en ${bank.currency_code} y el vale está expresado en ${vale.currency_code}`,
      );
    }
    const before = bank.balance.toNumber();
    const after = isOutflow ? before - amount : before + amount;
    if (isOutflow && after < 0) throw new BadRequestException('Saldo insuficiente en la cuenta bancaria');
    await this.bankMovements.addMovement(
      {
        bankAccountId: bank.id,
        type: isOutflow ? 'PAYMENT' : 'COLLECTION',
        nature: isOutflow ? 'DEBIT' : 'CREDIT',
        amount: isOutflow ? -amount : amount,
        currencyCode: vale.currency_code,
        exchangeRate: vale.exchange_rate ? Number(vale.exchange_rate) : null,
        rateType: vale.rate_type ?? null,
        convertedAmount: vale.converted_amount ? Number(vale.converted_amount) : null,
        description: description.substring(0, 255),
        referenceType: 'hr_vale',
        referenceId: vale.id,
        date: vale.date,
        userId,
      },
      prisma,
    );
  }

  async reconcileTrashedCancelledValeDocument(documentId: string, userId: string) {
    const document = await this.prisma.documents.findFirst({
      where: {
        id: documentId,
        deleted_at: { not: null },
        source: 'manual',
        document_types: { category: 'VALE' },
      },
      select: { id: true, party_id: true, descrip: true },
    });
    if (!document) throw new NotFoundException('Comprobante VALE no encontrado en la Papelera.');

    const match = /^Vale #(\d+)$/i.exec(document.descrip?.trim() ?? '');
    if (!match || !document.party_id) {
      throw new BadRequestException('No se pudo identificar el vale RRHH asociado a este comprobante.');
    }

    const vale = await this.prisma.hr_vales.findFirst({
      where: { party_id: document.party_id, number: Number(match[1]), status: 'CANCELLED' },
      select: { id: true },
    });
    if (!vale) {
      throw new BadRequestException('El vale RRHH asociado todavía no está anulado. Anulalo desde RRHH antes de regularizar el comprobante.');
    }

    return this.cancelVale(vale.id, userId, document.id);
  }

  async cancelVale(id: string, userId: string, targetDocumentId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const party = await tx.hr_vales.findUnique({ where: { id }, select: { party_id: true } });
      if (!party) throw new NotFoundException('Vale no encontrado');
      await tx.$queryRaw`SELECT id FROM tenant.business_parties WHERE id = ${party.party_id}::uuid FOR UPDATE`;
      const vale = await tx.hr_vales.findUnique({ where: { id } });
      if (!vale) throw new NotFoundException('Vale no encontrado');
      const valeDocument = await tx.documents.findFirst({
        where: {
          ...(targetDocumentId ? { id: targetDocumentId } : {}),
          descrip: `Vale #${vale.number}`,
          party_id: vale.party_id,
          document_types: { category: 'VALE' },
        },
        orderBy: { created_at: 'desc' },
        select: { id: true },
      });

      if (valeDocument) {
        const associatedPayments = await tx.payment_documents.findMany({
          where: {
            document_id: valeDocument.id,
            deleted_at: null,
            payment: { deleted_at: null },
          },
          include: { payment: true },
        });
        const activePayments = associatedPayments.filter(
          ({ payment }) => !['CANCELLED', 'REVERSED'].includes(payment.status),
        );

        if (activePayments.length > 0) {
          const paymentList = activePayments
            .map(({ payment }) => `#${payment.number} (${payment.status})`)
            .join(', ');
          throw new BadRequestException(
            `No se puede anular el vale porque tiene ${activePayments.length} pago${activePayments.length === 1 ? '' : 's'} activo${activePayments.length === 1 ? '' : 's'} asociado${activePayments.length === 1 ? '' : 's'}: ${paymentList}. Primero anulá esos pagos.`,
          );
        }
      }

      // Legacy cancellations could leave the linked document confirmed, paid, or with
      // both the original and reversal ledger rows still active. Reconcile that state,
      // and restore a missing treasury reversal without duplicating an existing one.
      if (vale.status === 'CANCELLED') {
        await this.reverseValeDocument(vale, userId, tx, valeDocument?.id);
        await this.reversePartnerTreasuryMovement(vale, userId, tx);
        return tx.hr_vales.findUnique({
          where: { id },
          include: { party: { select: { id: true, name: true, tax_id: true } } },
        });
      }

      if (vale.party_type === 'PARTNER' && vale.type === 'APORTE' && ['CONFIRMED', 'PAID'].includes(vale.status)) {
        const funds = await this.getPartnerFunds(vale.party_id, vale.currency_code, tx);
        if (funds.balance - Number(vale.amount) < 0) {
          throw new BadRequestException('No se puede anular este aporte porque dejaría retiros sin respaldo. Primero anulá los retiros correspondientes.');
        }
      }

      // Claim the transition before writing reversals. This makes retries and
      // concurrent clicks idempotent; all changes roll back together on error.
      const claimed = await tx.hr_vales.updateMany({
        where: { id, status: vale.status, deleted_at: vale.deleted_at },
        data: { status: 'CANCELLED', updated_at: new Date(), updated_by: userId },
      });
      if (!claimed.count) throw new BadRequestException('El vale ya fue modificado. Actualizá la lista e intentá de nuevo.');

      if (vale.status === 'CONFIRMED' || vale.status === 'PAID') {
        const isDebit = ['RETIRO', 'REEMBOLSO', 'PRESTAMO'].includes(vale.type);
        const account = await tx.hr_accounts.findUnique({
          where: { party_id_currency_code: { party_id: vale.party_id, currency_code: vale.currency_code } },
        });

        if (account) {
          const currentBalance = account.balance.toNumber();
          const amount = vale.amount.toNumber();
          const balanceAfter = isDebit ? currentBalance + amount : currentBalance - amount;
          await tx.hr_account_entries.create({
            data: {
              hr_account_id: account.id,
              type: 'ADJUSTMENT',
              amount,
              currency_code: vale.currency_code,
              balance_before: currentBalance,
              balance_after: balanceAfter,
              description: `Anulación Vale #${vale.number}`,
              reference_type: 'hr_vale',
              reference_id: vale.id,
              date: new Date(),
              created_by: userId,
            },
          });
          await tx.hr_accounts.update({
            where: { id: account.id },
            data: { balance: balanceAfter, updated_at: new Date(), updated_by: userId },
          });
        }

        await this.reverseValeDocument(vale, userId, tx);
        await this.reversePartnerTreasuryMovement(vale, userId, tx);
      }

      return tx.hr_vales.findUnique({
        where: { id },
        include: { party: { select: { id: true, name: true, tax_id: true } } },
      });
    });
  }

  private async reversePartnerTreasuryMovement(vale: any, userId: string, prisma: any = this.prisma) {
    if (vale.party_type !== 'PARTNER') return;
    const [cashMovement, bankMovement] = await Promise.all([
      prisma.cash_box_movements.findFirst({
        where: { reference_type: 'hr_vale', reference_id: vale.id, deleted_at: null },
      }),
      prisma.bank_account_movements.findFirst({
        where: { reference_type: 'hr_vale', reference_id: vale.id, deleted_at: null },
      }),
    ]);
    const original = cashMovement ?? bankMovement;
    if (!original) return; // Vale histórico: nunca impactó Tesorería.

    const existingCancellation = cashMovement
      ? await prisma.cash_box_movements.findFirst({
          where: { reference_type: 'hr_vale_cancellation', reference_id: vale.id, deleted_at: null },
          select: { id: true },
        })
      : await prisma.bank_account_movements.findFirst({
          where: { reference_type: 'hr_vale_cancellation', reference_id: vale.id, deleted_at: null },
          select: { id: true },
        });
    if (existingCancellation) return;

    const originalWasOutflow = original.type === 'PAYMENT';
    const amount = original.amount.toNumber();
    const reversalType = originalWasOutflow ? 'COLLECTION' : 'PAYMENT';
    const description = `Anulación Vale #${vale.number}`;

    if (cashMovement) {
      const balance = await prisma.cash_box_balances.findUnique({
        where: {
          cash_box_id_currency_code: {
            cash_box_id: cashMovement.cash_box_id,
            currency_code: cashMovement.currency_code,
          },
        },
      });
      const before = balance?.balance.toNumber() ?? 0;
      const after = originalWasOutflow ? before + amount : before - amount;
      await prisma.cash_box_movements.create({
        data: {
          cash_box_id: cashMovement.cash_box_id,
          session_id: cashMovement.session_id,
          type: reversalType,
          amount: cashMovement.amount,
          currency_code: cashMovement.currency_code,
          exchange_rate: cashMovement.exchange_rate,
          rate_type: cashMovement.rate_type,
          converted_amount: cashMovement.converted_amount,
          balance_before: before,
          balance_after: after,
          description,
          reference_type: 'hr_vale_cancellation',
          reference_id: vale.id,
          date: new Date(),
          created_by: userId,
        },
      });
      if (balance) await prisma.cash_box_balances.update({ where: { id: balance.id }, data: { balance: after } });
      if (cashMovement.session_id) {
        await prisma.cash_box_sessions.update({
          where: { id: cashMovement.session_id },
          data: {
            movement_count: { increment: 1 },
            ...(originalWasOutflow
              ? { total_income: { increment: amount } }
              : { total_expenses: { increment: amount } }),
          },
        });
      }
      return;
    }

    if (bankMovement) {
      const bank = await prisma.bank_accounts.findUnique({ where: { id: bankMovement.bank_account_id } });
      if (!bank) return;
      const reversalAmount = -Number(bankMovement.amount);
      await this.bankMovements.addMovement({
        bankAccountId: bank.id,
        type: reversalType,
        nature: reversalAmount < 0 ? 'DEBIT' : 'CREDIT',
        amount: reversalAmount,
        currencyCode: bankMovement.currency_code,
        exchangeRate: bankMovement.exchange_rate ? Number(bankMovement.exchange_rate) : null,
        rateType: bankMovement.rate_type ?? null,
        convertedAmount: bankMovement.converted_amount ? Number(bankMovement.converted_amount) : null,
        description,
        referenceType: 'hr_vale_cancellation',
        referenceId: vale.id,
        date: new Date(),
        userId,
      }, prisma);
    }
  }

  // ══════════════════════════════════════════════════════════
  // CREAR DOCUMENTO VALE + CURRENT ACCOUNT ENTRY
  // ══════════════════════════════════════════════════════════

  private async createValeDocument(vale: any, userId: string, tx?: any, settledDirectly = false) {
    const prisma = tx || this.prisma;
    // Buscar document_type con category = 'VALE'
    const valeDocType = await prisma.document_types.findFirst({
      where: { category: 'VALE', active: true },
    });

    if (!valeDocType) {
      this.logger.warn('No se encontró document_type con category VALE');
      return null;
    }

    // Buscar sequence para numeración
    let nextNumber = 1;
    let sequenceId: string | null = null;
    if (valeDocType.document_sequence_id) {
      const sequence = await prisma.document_sequences.findUnique({
        where: { id: valeDocType.document_sequence_id },
      });
      if (sequence) {
        sequenceId = sequence.id;
        nextNumber = (sequence.current_number ?? 0) + 1;
        await prisma.document_sequences.update({
          where: { id: sequence.id },
          data: { current_number: nextNumber },
        });
      }
    } else {
      // Sin secuencia: usar max number + 1
      this.logger.warn(`VALE sin secuencia asociada. Usando numeración automática.`);
      const lastDoc = await prisma.documents.findFirst({
        where: { document_type_id: valeDocType.id },
        orderBy: { number: 'desc' },
        select: { number: true },
      });
      nextNumber = (lastDoc?.number ?? 0) + 1;
    }

    // Crear documento
    const doc = await prisma.documents.create({
      data: {
        document_type_id: valeDocType.id,
        document_sequence_id: sequenceId,
        number: nextNumber,
        party_id: vale.party_id,
        currency_code: vale.currency_code,
        total: vale.amount,
        paid_amount: settledDirectly ? vale.amount : 0,
        status: 2, // CONFIRMED
        date: vale.date,
        descrip: `Vale #${vale.number}`.substring(0, 50),
        ref: vale.type,
        created_by: userId,
      },
    });

    this.logger.log(`Documento VALE #${nextNumber} creado para vale #${vale.number}`);

    // Crear entrada en current_accounts
    if (!settledDirectly) {
      await this.createCurrentAccountEntry(vale, doc.id, userId, prisma);
    }

    return doc;
  }

  // ══════════════════════════════════════════════════════════
  // CREAR CURRENT ACCOUNT ENTRY
  // ══════════════════════════════════════════════════════════

  private async createCurrentAccountEntry(vale: any, documentId: string, userId: string, tx?: any) {
    const prisma = tx || this.prisma;
    // Buscar o crear cuenta corriente (una por party, sin currency_code)
    let account = await prisma.current_accounts.findUnique({
      where: { party_id: vale.party_id },
    });

    if (!account) {
      account = await prisma.current_accounts.create({
        data: {
          party_id: vale.party_id,
          party_type: vale.party_type,
          balance: 0,
          created_by: userId,
        },
      });
    }

    const currentBalance = account.balance.toNumber();
    const amount = vale.amount.toNumber();
    // RETIRO, REEMBOLSO, PRESTAMO = socio le debe a la empresa → balance baja (débito)
    // SUELDO, ADELANTO, EXTRAS, COMISION, APORTE = empresa le debe / socio pone → balance sube (crédito)
    const isDebit = ['RETIRO', 'REEMBOLSO', 'PRESTAMO'].includes(vale.type);
    const balanceAfter = isDebit ? currentBalance - amount : currentBalance + amount;

    await prisma.current_account_entries.create({
      data: {
        current_account_id: account.id,
        type: isDebit ? 'COLLECTION' : 'PAYMENT',
        amount,
        currency_code: vale.currency_code,
        exchange_rate: vale.exchange_rate,
        rate_type: vale.rate_type,
        converted_amount: vale.converted_amount,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: `Vale #${vale.number} - ${vale.description || vale.type}`,
        reference_type: 'document',
        reference_id: documentId,
        date: vale.date,
        created_by: userId,
      },
    });

    await prisma.current_accounts.update({
      where: { id: account.id },
      data: { balance: balanceAfter, updated_at: new Date() },
    });
    await recalculateCurrentAccountLedger(prisma, account.id);

    this.logger.log(`Current account entry creada para vale #${vale.number}`);
  }

  // ══════════════════════════════════════════════════════════
  // REVERTIR DOCUMENTO VALE
  // ══════════════════════════════════════════════════════════

  private async reverseValeDocument(vale: any, userId: string, prisma: any = this.prisma, targetDocumentId?: string) {
    // Buscar el documento VALE asociado al vale
    const doc = targetDocumentId
      ? await prisma.documents.findFirst({
          where: { id: targetDocumentId, party_id: vale.party_id, document_types: { category: 'VALE' } },
        })
      : await prisma.documents.findFirst({
          where: {
            descrip: `Vale #${vale.number}`,
            party_id: vale.party_id,
            document_types: { category: 'VALE' },
          },
          orderBy: { created_at: 'desc' },
        });

    if (!doc) {
      this.logger.warn(`No se encontró documento VALE para revertir vale #${vale.number}`);
      return;
    }

    await removeDocumentAccountEffects(prisma, doc.id, userId);

    const now = new Date();
    await prisma.documents.update({
      where: { id: doc.id },
      data: {
        status: 3,
        paid_amount: 0,
        converted_paid_amount: 0,
        deleted_at: doc.deleted_at ?? now,
        deleted_by: doc.deleted_by ?? userId,
        updated_at: now,
        updated_by: userId,
      },
    });

    this.logger.log(`Documento VALE #${doc.number} revertido para vale #${vale.number}`);
  }

  // ══════════════════════════════════════════════════════════
  // CUENTAS CORRIENTES RRHH
  // ══════════════════════════════════════════════════════════

  async getHrAccounts(params?: { party_type?: string }) {
    const where: any = { deleted_at: null, active: true };

    if (params?.party_type) {
      const partyTypes = params.party_type
        .split(',')
        .map((partyType) => partyType.trim())
        .filter(Boolean);
      if (partyTypes.length === 1) where.party_type = partyTypes[0];
      else if (partyTypes.length > 1) where.party_type = { in: partyTypes };
    }

    return this.prisma.hr_accounts.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
      orderBy: { balance: 'desc' },
    });
  }

  async getHrAccountEntries(hrAccountId: string) {
    const account = await this.prisma.hr_accounts.findUnique({
      where: { id: hrAccountId },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
    });

    if (!account) {
      throw new NotFoundException('Cuenta corriente no encontrada');
    }

    const entries = await this.prisma.hr_account_entries.findMany({
      where: { hr_account_id: hrAccountId, deleted_at: null },
      orderBy: { date: 'desc' },
    });

    const valeIds = [...new Set(
      entries
        .filter((entry) => entry.reference_type === 'hr_vale' && entry.reference_id)
        .map((entry) => entry.reference_id as string),
    )];

    if (valeIds.length === 0) return { account, entries };

    const [vales, cashMovements, bankMovements] = await Promise.all([
      this.prisma.hr_vales.findMany({
        where: { id: { in: valeIds } },
        select: { id: true, status: true, type: true },
      }),
      this.prisma.cash_box_movements.findMany({
        where: { reference_type: 'hr_vale', reference_id: { in: valeIds }, deleted_at: null },
        select: { reference_id: true, cash_box: { select: { name: true } } },
      }),
      this.prisma.bank_account_movements.findMany({
        where: { reference_type: 'hr_vale', reference_id: { in: valeIds }, deleted_at: null },
        select: {
          reference_id: true,
          bank_account: { select: { name: true, bank_name: true } },
        },
      }),
    ]);

    const statusByVale = new Map(vales.map((vale) => [vale.id, vale.status]));
    const typeByVale = new Map(vales.map((vale) => [vale.id, vale.type]));
    const paymentOriginByVale = new Map<string, string>();
    for (const movement of cashMovements) {
      if (movement.reference_id) paymentOriginByVale.set(movement.reference_id, `Caja · ${movement.cash_box.name}`);
    }
    for (const movement of bankMovements) {
      if (movement.reference_id && !paymentOriginByVale.has(movement.reference_id) && movement.bank_account) {
        paymentOriginByVale.set(
          movement.reference_id,
          `Banco · ${[movement.bank_account.bank_name, movement.bank_account.name].filter(Boolean).join(' · ')}`,
        );
      }
    }

    return {
      account,
      entries: entries.map((entry) => {
        if (entry.reference_type !== 'hr_vale' || !entry.reference_id) return entry;
        return {
          ...entry,
          vale_status: statusByVale.get(entry.reference_id) ?? null,
          vale_type: typeByVale.get(entry.reference_id) ?? null,
          payment_origin: paymentOriginByVale.get(entry.reference_id) ?? null,
        };
      }),
    };
  }

  async getHrBalance(partyId: string, currencyCode: string) {
    const account = await this.prisma.hr_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: partyId,
          currency_code: currencyCode,
        },
      },
    });

    return { balance: account?.balance ?? 0 };
  }

  // ══════════════════════════════════════════════════════════
  // REPORTE DE COMISIONES
  // ══════════════════════════════════════════════════════════

  private parseMonth(month: string) {
    if (!/^\d{4}-\d{2}$/.test(month ?? '')) {
      throw new BadRequestException('El período debe tener formato YYYY-MM');
    }
    const [year, monthNumber] = month.split('-').map(Number);
    if (monthNumber < 1 || monthNumber > 12) {
      throw new BadRequestException('El mes indicado no es válido');
    }
    return {
      startDate: new Date(year, monthNumber - 1, 1),
      endDate: new Date(year, monthNumber, 0, 23, 59, 59, 999),
    };
  }

  async getCommissionSellers() {
    const [employees, partners] = await Promise.all([
      this.prisma.employees.findMany({
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
      this.prisma.partners.findMany({
        where: { deleted_at: null, is_active: true, is_salesperson: true, partner_kind: 'PARTNER', party_id: { not: null } },
        select: { id: true, first_name: true, last_name: true, party_id: true, default_commission_rate: true, commission_base: true },
      }),
    ]);
    return [
      ...employees.map((seller) => ({
        ...seller,
        seller_type: 'EMPLOYEE' as const,
        name: `${seller.first_name} ${seller.last_name}`.trim(),
        default_commission_rate: Number(seller.default_commission_rate ?? 0),
      })),
      ...partners.map((seller) => ({
        ...seller,
        seller_type: 'PARTNER' as const,
        name: `${seller.first_name} ${seller.last_name}`.trim(),
        default_commission_rate: Number(seller.default_commission_rate ?? 0),
        commission_base: seller.commission_base ?? 'INVOICED',
      })),
    ].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }

  async getCommissionableDocuments(month: string) {
    const { startDate, endDate } = this.parseMonth(month);
    const orders = await this.prisma.orden_venta_documents.findMany({
      where: {
        document: {
          deleted_at: null,
          date: { lte: endDate },
          OR: [
            { date: { gte: startDate } },
            { sales_commission_assignments: { some: { active: true } } },
          ],
        },
      },
      include: {
        document: {
          include: {
            business_parties: { select: { id: true, name: true } },
            document_types: { select: { code: true, description: true, category: true } },
            sales_commission_assignments: {
              where: { active: true },
              include: {
                seller: { select: { id: true, first_name: true, last_name: true, commission_base: true } },
                partner: { select: { id: true, first_name: true, last_name: true } },
              },
              orderBy: { created_at: 'asc' },
            },
          },
        },
      },
      orderBy: [{ document: { date: 'desc' } }, { document: { created_at: 'desc' } }],
    });

    // Una OV con vales vigentes conserva bloqueadas sus asignaciones, pero eso no
    // significa que la comisión esté completamente liquidada.
    const documentIds = orders.map((order) => order.document.id);
    const settledDetails = documentIds.length
      ? await this.prisma.hr_vale_commission_details.findMany({
          where: {
            document_id: { in: documentIds },
            hr_vale: { deleted_at: null, status: { not: 'CANCELLED' }, date: { lte: endDate } },
          },
          select: { document_id: true },
        })
      : [];
    const settledIds = new Set(settledDetails.map((detail) => detail.document_id));

    const round2 = (value: number) => Math.round(value * 100) / 100;

    const result: any[] = [];
    for (const order of orders) {
      const document = order.document;
      const total = Number(document.total);

      // Comisión devengada/liquidada agregando las asignaciones de la OV.
      let commissionAccrued = 0;
      let commissionSettled = 0;
      let commissionBaseAmount = 0;
      let collectedAmount = Number(document.paid_amount ?? 0);
      let hasCollectionCommission = false;
      const assignments: any[] = [];
      for (const assignment of document.sales_commission_assignments) {
        const sellerType = assignment.seller_type as 'EMPLOYEE' | 'PARTNER';
        const sellerId = sellerType === 'PARTNER' ? assignment.partner_id! : assignment.seller_id!;
        const seller = sellerType === 'PARTNER' ? assignment.partner : assignment.seller;
        const commissionBase = assignment.commission_base ?? assignment.seller?.commission_base ?? 'INVOICED';
        const metrics = await this.getCommissionMetrics(
          document.id,
          Number(document.subtotal),
          total,
          Number(assignment.commission_rate),
          commissionBase,
          endDate,
          sellerId,
          sellerType,
          Number(assignment.participation_rate),
        );
        commissionAccrued += metrics.accruedAmount;
        commissionSettled += metrics.settledAmount;
        commissionBaseAmount += (metrics.baseAmount * Number(assignment.participation_rate)) / 100;
        if (commissionBase === 'PAID') {
          hasCollectionCommission = true;
          const subtotal = Number(document.subtotal);
          if (subtotal > 0) {
            collectedAmount = Math.max(collectedAmount, (metrics.baseAmount / subtotal) * total);
          }
        }
        assignments.push({
          id: assignment.id,
          seller_type: sellerType,
          seller_id: sellerId,
          seller_name: `${seller?.first_name ?? ''} ${seller?.last_name ?? ''}`.trim(),
          participation_rate: Number(assignment.participation_rate),
          commission_rate: Number(assignment.commission_rate),
          commission_base: commissionBase,
          accrued_amount: round2(metrics.accruedAmount),
          settled_amount: round2(metrics.settledAmount),
          pending_amount: round2(metrics.pendingAmount),
          base_amount: round2((metrics.baseAmount * Number(assignment.participation_rate)) / 100),
        });
      }
      commissionAccrued = round2(commissionAccrued);
      commissionSettled = round2(commissionSettled);
      commissionBaseAmount = round2(commissionBaseAmount);
      const commissionPending = round2(Math.max(0, commissionAccrued - commissionSettled));

      const isCurrentMonth = document.date >= startDate;
      const collectedPercentage = total > 0 ? Math.min(100, (collectedAmount / total) * 100) : 0;
      const hasUnpaidCollectionCommission = hasCollectionCommission && total > 0 && collectedAmount < total - 0.005;
      // En el arrastre incluimos deuda comisionable y también cobros pendientes:
      // si la comisión actual ya se liquidó, un cobro posterior puede devengar más.
      if (!isCurrentMonth && commissionPending <= 0.005 && !hasUnpaidCollectionCommission) continue;

      result.push({
        document_id: document.id,
        number: document.number,
        date: document.date,
        customer: document.business_parties?.name ?? 'Sin cliente',
        document_type: document.document_types.code ?? document.document_types.description,
        subtotal: Number(document.subtotal),
        total,
        paid_amount: collectedAmount,
        paid_percentage: collectedPercentage,
        currency_code: document.currency_code,
        assignments,
        assignment_status: assignments.length ? 'ASSIGNED' : 'UNASSIGNED',
        commission_accrued: round2(commissionAccrued),
        commission_settled: round2(commissionSettled),
        commission_pending: round2(commissionPending),
        commission_base_amount: round2(commissionBaseAmount),
        settled: commissionAccrued > 0.005 && commissionPending <= 0.005,
        assignment_locked: settledIds.has(document.id),
        is_carryover: !isCurrentMonth,
        has_unpaid_collection_commission: hasUnpaidCollectionCommission,
      });
    }
    return result;
  }

  async saveCommissionAssignments(
    documentId: string,
    assignments: Array<{
      seller_id: string;
      seller_type?: 'EMPLOYEE' | 'PARTNER';
      participation_rate: number;
      commission_rate: number;
      commission_base: 'INVOICED' | 'PAID';
    }>,
    userId: string,
  ) {
    const normalizedAssignments = assignments.map((item) => ({ ...item, seller_type: item.seller_type ?? 'EMPLOYEE' }));
    const identity = (item: { seller_id: string; seller_type: 'EMPLOYEE' | 'PARTNER' }) => `${item.seller_type}:${item.seller_id}`;
    const duplicated = new Set(normalizedAssignments.map(identity)).size !== normalizedAssignments.length;
    if (duplicated) throw new BadRequestException('No se puede asignar dos veces el mismo vendedor');
    if (normalizedAssignments.some((item) =>
      !Number.isFinite(Number(item.participation_rate))
      || Number(item.participation_rate) < 0.01
      || Number(item.participation_rate) > 100
      || !Number.isFinite(Number(item.commission_rate))
      || Number(item.commission_rate) < 0
      || Number(item.commission_rate) > 100
    )) {
      throw new BadRequestException('La participación debe ser mayor que 0% y hasta 100%; la comisión puede ser de 0% a 100%');
    }

    const employeeIds = normalizedAssignments.filter((item) => item.seller_type === 'EMPLOYEE').map((item) => item.seller_id);
    const partnerIds = normalizedAssignments.filter((item) => item.seller_type === 'PARTNER').map((item) => item.seller_id);

    const [order, employees, partners, settledDetails] = await Promise.all([
      this.prisma.orden_venta_documents.findUnique({
        where: { document_id: documentId },
        select: { document: { select: { deleted_at: true } } },
      }),
      employeeIds.length
        ? this.prisma.employees.findMany({
            where: { id: { in: employeeIds }, deleted_at: null, is_active: true, is_salesperson: true },
            select: { id: true },
          })
        : [],
      partnerIds.length
        ? this.prisma.partners.findMany({
            where: { id: { in: partnerIds }, deleted_at: null, is_active: true, is_salesperson: true, partner_kind: 'PARTNER', party_id: { not: null } },
            select: { id: true },
          })
        : [],
      this.prisma.hr_vale_commission_details.findMany({
        where: {
          document_id: documentId,
          hr_vale: { deleted_at: null, status: { not: 'CANCELLED' } },
        },
        select: { id: true },
        take: 1,
      }),
    ]);
    if (!order || order.document.deleted_at) throw new NotFoundException('Orden de venta no encontrada');
    if (settledDetails.length) {
      throw new BadRequestException(
        'La comisión de esta OV ya fue liquidada en un vale; no se pueden modificar sus asignaciones',
      );
    }
    if (employees.length !== employeeIds.length || partners.length !== partnerIds.length) {
      throw new BadRequestException('Todos los vendedores deben estar activos y habilitados para comisionar');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.sales_commission_assignments.updateMany({
        where: { document_id: documentId, active: true },
        data: { active: false, updated_by: userId },
      });
      for (const assignment of normalizedAssignments) {
        const sellerData = assignment.seller_type === 'PARTNER'
          ? { seller_type: 'PARTNER', seller_id: null, partner_id: assignment.seller_id }
          : { seller_type: 'EMPLOYEE', seller_id: assignment.seller_id, partner_id: null };
        const where = assignment.seller_type === 'PARTNER'
          ? { document_id_partner_id: { document_id: documentId, partner_id: assignment.seller_id } }
          : { document_id_seller_id: { document_id: documentId, seller_id: assignment.seller_id } };
        await tx.sales_commission_assignments.upsert({
          where: where as any,
          create: {
            document_id: documentId,
            ...sellerData,
            participation_rate: assignment.participation_rate,
            commission_rate: assignment.commission_rate,
            commission_base: assignment.commission_base,
            created_by: userId,
          },
          update: {
            ...sellerData,
            participation_rate: assignment.participation_rate,
            commission_rate: assignment.commission_rate,
            commission_base: assignment.commission_base,
            active: true,
            updated_by: userId,
          },
        });
      }
      const saved = await tx.sales_commission_assignments.findMany({
        where: { document_id: documentId, active: true },
        include: {
          seller: { select: { id: true, first_name: true, last_name: true } },
          partner: { select: { id: true, first_name: true, last_name: true } },
        },
      });
      return saved.map((assignment) => {
        const seller = assignment.seller_type === 'PARTNER' ? assignment.partner : assignment.seller;
        return {
          ...assignment,
          seller_id: assignment.partner_id ?? assignment.seller_id,
          seller_name: `${seller?.first_name ?? ''} ${seller?.last_name ?? ''}`.trim(),
        };
      });
    });
  }

  async getCommissionsReport(month: string, sellerId?: string, sellerType: 'EMPLOYEE' | 'PARTNER' = 'EMPLOYEE') {
    const { endDate } = this.parseMonth(month);
    const sellerMap = new Map<string, any>();
    const ensureSeller = (sellerIdValue: string, type: 'EMPLOYEE' | 'PARTNER', seller: any, currencyCode: string) => {
      const key = `${type}:${sellerIdValue}:${currencyCode}`;
      if (!sellerMap.has(key)) {
        sellerMap.set(key, {
          seller_id: sellerIdValue,
          seller_type: type,
          seller_name: `${seller?.first_name ?? ''} ${seller?.last_name ?? ''}`.trim(),
          party_id: seller?.party_id ?? null,
          currency_code: currencyCode,
          total_ventas: 0,
          total_comisiones: 0,
          total_participacion: 0,
          total_pendiente: 0,
          cantidad_ov: 0,
          items: [],
          ov_ids: new Set<string>(),
        });
      }
      return sellerMap.get(key);
    };

    // Recorrer en lotes para no retener todas las asignaciones Prisma a la vez.
    const commissionWhere = {
      active: true,
      ...(sellerId
        ? sellerType === 'PARTNER'
          ? { seller_type: 'PARTNER', partner_id: sellerId }
          : { seller_type: 'EMPLOYEE', seller_id: sellerId }
        : {}),
      document: { deleted_at: null, date: { lte: endDate } },
    };
    let commissionCursor: string | undefined;
    while (true) {
      const batch = await this.prisma.sales_commission_assignments.findMany({
        where: commissionWhere,
        include: {
          seller: { select: { id: true, first_name: true, last_name: true, party_id: true, commission_base: true } },
          partner: { select: { id: true, first_name: true, last_name: true, party_id: true } },
          document: { select: { id: true, number: true, subtotal: true, total: true, date: true, currency_code: true } },
        },
        orderBy: { id: 'asc' },
        take: 100,
        ...(commissionCursor ? { cursor: { id: commissionCursor }, skip: 1 } : {}),
      });
      if (!batch.length) break;

      for (const assignment of batch) {
        const type = assignment.seller_type as 'EMPLOYEE' | 'PARTNER';
        const id = type === 'PARTNER' ? assignment.partner_id! : assignment.seller_id!;
        const seller = type === 'PARTNER' ? assignment.partner : assignment.seller;
        const currencyCode = assignment.document.currency_code ?? 'ARS';
        const entry = ensureSeller(id, type, seller, currencyCode);
        const subtotal = Number(assignment.document.subtotal);
        const rate = Number(assignment.commission_rate);
        const participation = Number(assignment.participation_rate);
        const base = assignment.commission_base ?? assignment.seller?.commission_base ?? 'INVOICED';
        const metrics = await this.getCommissionMetrics(
          assignment.document_id,
          subtotal,
          Number(assignment.document.total),
          rate,
          base,
          endDate,
          id,
          type,
          participation,
        );
        if (metrics.pendingAmount <= 0.005) continue;

        entry.total_ventas += (metrics.baseAmount * participation) / 100;
        entry.total_comisiones += metrics.pendingAmount;
        entry.total_pendiente += metrics.pendingAmount;
        entry.ov_ids.add(assignment.document_id);
        entry.items.push({
          kind: 'COMMISSION',
          document_id: assignment.document_id,
          ov_number: assignment.document.number,
          subtotal: (metrics.baseAmount * participation) / 100,
          commission_rate: rate,
          commission_amount: metrics.pendingAmount,
          commission_base: base,
          sold_subtotal: subtotal,
          settled_amount: metrics.settledAmount,
          participation_rate: participation,
          date: assignment.document.date,
        });
      }
      commissionCursor = batch[batch.length - 1].id;
    }

    if (!sellerId || sellerType === 'PARTNER') {
      const shareWhere = {
        active: true,
        ...(sellerId ? { partner_id: sellerId } : {}),
        document: { deleted_at: null, date: { lte: endDate } },
      };
      let shareCursor: string | undefined;
      while (true) {
        const batch = await this.prisma.sales_partner_share_assignments.findMany({
          where: shareWhere,
          include: {
            partner: { select: { id: true, first_name: true, last_name: true, party_id: true } },
            document: { select: { id: true, number: true, subtotal: true, date: true, currency_code: true, status: true } },
          },
          orderBy: { id: 'asc' },
          take: 100,
          ...(shareCursor ? { cursor: { id: shareCursor }, skip: 1 } : {}),
        });
        if (!batch.length) break;

        const metricsByKey = await this.getPartnerShareMetricsForAssignments(batch, endDate);
        for (const assignment of batch) {
          const metrics = metricsByKey.get(`${assignment.document_id}:${assignment.partner_id}`);
          if (!metrics || metrics.pendingAmount <= 0.005) continue;
          const currencyCode = assignment.document.currency_code ?? 'ARS';
          const entry = ensureSeller(assignment.partner_id, 'PARTNER', assignment.partner, currencyCode);
          entry.total_ventas += metrics.baseAmount;
          entry.total_participacion += metrics.pendingAmount;
          entry.total_pendiente += metrics.pendingAmount;
          entry.ov_ids.add(assignment.document_id);
          entry.items.push({
            kind: 'PARTNER_SHARE',
            document_id: assignment.document_id,
            ov_number: assignment.document.number,
            subtotal: metrics.baseAmount,
            share_percentage: Number(assignment.share_percentage),
            commission_amount: metrics.pendingAmount,
            commission_base: assignment.calculation_basis,
            sold_subtotal: Number(assignment.document.subtotal),
            settled_amount: metrics.settledAmount,
            participation_rate: 100,
            date: assignment.document.date,
          });
        }
        shareCursor = batch[batch.length - 1].id;
      }
    }

    const sellers = Array.from(sellerMap.values())
      .filter((seller) => seller.total_pendiente > 0.005)
      .map(({ ov_ids, ...seller }) => ({
        ...seller,
        total_ventas: Math.round(seller.total_ventas * 100) / 100,
        total_comisiones: Math.round(seller.total_comisiones * 100) / 100,
        total_participacion: Math.round(seller.total_participacion * 100) / 100,
        total_pendiente: Math.round(seller.total_pendiente * 100) / 100,
        cantidad_ov: ov_ids.size,
      }))
      .sort((a, b) => a.seller_name.localeCompare(b.seller_name, 'es') || a.currency_code.localeCompare(b.currency_code));
    const totalsByCurrency = new Map<string, any>();
    for (const seller of sellers) {
      const total = totalsByCurrency.get(seller.currency_code) ?? {
        currency_code: seller.currency_code,
        total_ventas: 0,
        total_comisiones: 0,
        total_participacion: 0,
        total_pendiente: 0,
        document_ids: new Set<string>(),
      };
      total.total_ventas += seller.total_ventas;
      total.total_comisiones += seller.total_comisiones;
      total.total_participacion += seller.total_participacion;
      total.total_pendiente += seller.total_pendiente;
      for (const item of seller.items) total.document_ids.add(item.document_id);
      totalsByCurrency.set(seller.currency_code, total);
    }
    const totalsByCurrencyArray = Array.from(totalsByCurrency.values()).map(({ document_ids, ...total }) => ({
      ...total,
      total_ventas: Math.round(total.total_ventas * 100) / 100,
      total_comisiones: Math.round(total.total_comisiones * 100) / 100,
      total_participacion: Math.round(total.total_participacion * 100) / 100,
      total_pendiente: Math.round(total.total_pendiente * 100) / 100,
      cantidad_ov: document_ids.size,
    }));
    return {
      month,
      sellers,
      totals_by_currency: totalsByCurrencyArray,
      total_ventas: totalsByCurrencyArray.reduce((sum, total) => sum + total.total_ventas, 0),
      total_comisiones: totalsByCurrencyArray.reduce((sum, total) => sum + total.total_comisiones, 0),
      total_participacion: totalsByCurrencyArray.reduce((sum, total) => sum + total.total_participacion, 0),
      total_pendiente: totalsByCurrencyArray.reduce((sum, total) => sum + total.total_pendiente, 0),
      cantidad_ov: sellers.reduce((sum, seller) => sum + seller.cantidad_ov, 0),
    };
  }

  // ══════════════════════════════════════════════════════════
  // GENERAR VALE COMISION POR COMISIONES
  // ══════════════════════════════════════════════════════════

  async generateCommissionVale(
    sellerId: string,
    month: string,
    userId: string,
    sellerType: 'EMPLOYEE' | 'PARTNER' = 'EMPLOYEE',
    requestedCurrency?: string,
  ) {
    const { endDate } = this.parseMonth(month);
    // Serializable evita que dos solicitudes simultáneas liquiden dos veces
    // el mismo incremento de comisión.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const vale = await this.prisma.$transaction(async (tx) => {
          // Se consideran asignaciones de cualquier fecha. Así, una cobranza de
          // este mes puede generar comisión sobre una OV anterior.
          const commissionRows: Array<{
            assignment: any;
            base: string;
            baseAmount: number;
            pendingAmount: number;
          }> = [];
          const commissionWhere = {
            seller_type: sellerType,
            ...(sellerType === 'PARTNER' ? { partner_id: sellerId } : { seller_id: sellerId }),
            active: true,
            document: { deleted_at: null, date: { lte: endDate } },
          };
          let commissionCursor: string | undefined;
          while (true) {
            const assignments = await tx.sales_commission_assignments.findMany({
              where: commissionWhere,
              include: {
                seller: { select: { id: true, first_name: true, last_name: true, party_id: true, commission_base: true } },
                partner: { select: { id: true, first_name: true, last_name: true, party_id: true } },
                document: { select: { id: true, number: true, subtotal: true, total: true, date: true, currency_code: true } },
              },
              orderBy: { id: 'asc' },
              take: 100,
              ...(commissionCursor ? { cursor: { id: commissionCursor }, skip: 1 } : {}),
            });
            if (!assignments.length) break;
            for (const assignment of assignments) {
              const assignmentSellerId = assignment.seller_type === 'PARTNER' ? assignment.partner_id! : assignment.seller_id!;
              const rate = Number(assignment.commission_rate);
              const base = assignment.commission_base ?? assignment.seller?.commission_base ?? 'INVOICED';
              const metrics = await this.getCommissionMetrics(
                assignment.document_id,
                Number(assignment.document.subtotal),
                Number(assignment.document.total),
                rate,
                base,
                endDate,
                assignmentSellerId,
                assignment.seller_type as 'EMPLOYEE' | 'PARTNER',
                Number(assignment.participation_rate),
                tx,
              );
              if (metrics.pendingAmount > 0.005) {
                commissionRows.push({ assignment, base, baseAmount: metrics.baseAmount, pendingAmount: metrics.pendingAmount });
              }
            }
            commissionCursor = assignments[assignments.length - 1].id;
          }

          const shareRows: Array<{ assignment: any; baseAmount: number; pendingAmount: number }> = [];
          if (sellerType === 'PARTNER') {
            let shareCursor: string | undefined;
            while (true) {
              const shareAssignments = await tx.sales_partner_share_assignments.findMany({
                where: {
                  partner_id: sellerId,
                  active: true,
                  document: { deleted_at: null, date: { lte: endDate } },
                },
                include: {
                  partner: { select: { id: true, first_name: true, last_name: true, party_id: true } },
                  document: { select: { id: true, number: true, subtotal: true, date: true, currency_code: true, status: true } },
                },
                orderBy: { id: 'asc' },
                take: 100,
                ...(shareCursor ? { cursor: { id: shareCursor }, skip: 1 } : {}),
              });
              if (!shareAssignments.length) break;
              const shareMetrics = await this.getPartnerShareMetricsForAssignments(shareAssignments, endDate, tx);
              for (const assignment of shareAssignments) {
                const metrics = shareMetrics.get(`${assignment.document_id}:${assignment.partner_id}`);
                if (metrics && metrics.pendingAmount > 0.005) {
                  shareRows.push({ assignment, baseAmount: metrics.baseAmount, pendingAmount: metrics.pendingAmount });
                }
              }
              shareCursor = shareAssignments[shareAssignments.length - 1].id;
            }
          }
          const matchingCurrency = (currency: string | null | undefined) => currency ?? 'ARS';
          const allPendingCurrencies = new Set([
            ...commissionRows.map((row) => matchingCurrency(row.assignment.document.currency_code)),
            ...shareRows.map((row) => matchingCurrency(row.assignment.document.currency_code)),
          ]);
          if (requestedCurrency) {
            for (let index = commissionRows.length - 1; index >= 0; index--) {
              if (matchingCurrency(commissionRows[index].assignment.document.currency_code) !== requestedCurrency) commissionRows.splice(index, 1);
            }
            for (let index = shareRows.length - 1; index >= 0; index--) {
              if (matchingCurrency(shareRows[index].assignment.document.currency_code) !== requestedCurrency) shareRows.splice(index, 1);
            }
          } else if (allPendingCurrencies.size > 1) {
            throw new BadRequestException('Las liquidaciones tienen distintas monedas; generá un vale por moneda');
          }

          if (!commissionRows.length && !shareRows.length) {
            throw new BadRequestException('No hay comisión nueva pendiente para este vendedor al cierre del período');
          }

          const firstCommissionAssignment = commissionRows[0]?.assignment;
          const firstShareAssignment = shareRows[0]?.assignment;
          const seller = firstCommissionAssignment
            ? firstCommissionAssignment.seller_type === 'PARTNER' ? firstCommissionAssignment.partner : firstCommissionAssignment.seller
            : firstShareAssignment?.partner;
          if (!seller) throw new BadRequestException('No se encontró el vendedor asignado');
          const partyId = seller.party_id;
          if (!partyId) throw new BadRequestException('El vendedor no tiene una party asociada');

          const totalCommission = commissionRows.reduce((sum, row) => sum + row.pendingAmount, 0);
          const totalShare = shareRows.reduce((sum, row) => sum + row.pendingAmount, 0);
          const totalPayable = Math.round((totalCommission + totalShare + Number.EPSILON) * 100) / 100;
          const currencyCode = requestedCurrency
            ?? matchingCurrency(firstCommissionAssignment?.document.currency_code ?? firstShareAssignment?.document.currency_code);
          const lastVale = await tx.hr_vales.findFirst({
            where: { party_id: partyId },
            orderBy: { number: 'desc' },
          });
          const valeNumber = (lastVale?.number ?? 0) + 1;
          const [yearStr, monthStr] = month.split('-');
          const valeDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1);

          const vale = await tx.hr_vales.create({
            data: {
              number: valeNumber,
              party_id: partyId,
              party_type: sellerType,
              type: 'COMISION',
              amount: totalPayable,
              currency_code: currencyCode,
              date: valeDate,
              description: `${totalShare > 0 ? 'Comisiones y participación' : 'Comisiones'} ${month} - ${seller.first_name} ${seller.last_name}`,
              status: 'DRAFT',
              created_by: userId,
            },
            include: { party: { select: { id: true, name: true, tax_id: true } } },
          });

          for (const row of commissionRows) {
            const assignment = row.assignment;
            const rate = Number(assignment.commission_rate);
            await tx.hr_vale_commission_details.create({
              data: {
                hr_vale_id: vale.id,
                document_id: assignment.document_id,
                seller_type: sellerType,
                seller_id: sellerType === 'EMPLOYEE' ? sellerId : null,
                partner_id: sellerType === 'PARTNER' ? sellerId : null,
                subtotal: (row.baseAmount * Number(assignment.participation_rate)) / 100,
                commission_rate: rate,
                commission_amount: row.pendingAmount,
                commission_base: row.base,
                date: assignment.document.date,
              },
            });

            // Mantiene el último vale como dato informativo; el acumulado real
            // sale del historial de detalles y permite futuras liquidaciones.
            await tx.orden_venta_documents.update({
              where: { document_id: assignment.document_id },
              data: { commission_settled_at: new Date(), commission_vale_id: vale.id },
            });
          }

          for (const row of shareRows) {
            const assignment = row.assignment;
            await tx.hr_vale_partner_share_details.create({
              data: {
                hr_vale_id: vale.id,
                document_id: assignment.document_id,
                partner_id: sellerId,
                base_amount: row.baseAmount,
                share_percentage: assignment.share_percentage,
                share_amount: row.pendingAmount,
                calculation_basis: assignment.calculation_basis,
                date: assignment.document.date,
              },
            });
          }

          return vale;
        }, { isolationLevel: 'Serializable' });

        this.logger.log(
          `Vale COMISION #${vale.number} generado para vendedor ${sellerType}:${sellerId} - Total: ${vale.amount}`,
        );
        return vale;
      } catch (error: any) {
        if (error?.code === 'P2034' && attempt === 0) continue;
        throw error;
      }
    }

    throw new BadRequestException('No se pudo liquidar la comisión; intentá nuevamente');
  }

  // ══════════════════════════════════════════════════════════
  // REPORTE DE SOCIO
  // ══════════════════════════════════════════════════════════

  async getPartnerReportOptions() {
    const partners = await this.prisma.partners.findMany({
      where: { deleted_at: null, is_active: true, party_id: { not: null } },
      select: {
        id: true,
        party_id: true,
        partner_kind: true,
        first_name: true,
        last_name: true,
        document_type: true,
        document_number: true,
        share_percentage: true,
        party: { select: { name: true } },
      },
      orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }],
    });

    return partners.map((partner) => ({
      id: partner.id,
      party_id: partner.party_id,
      partner_kind: partner.partner_kind,
      name: partner.party?.name ?? `${partner.first_name} ${partner.last_name}`.trim(),
      document_type: partner.document_type,
      document_number: partner.document_number,
      share_percentage: partner.share_percentage?.toNumber() ?? null,
    }));
  }

  async getPartnerReport(partyId: string, userId: string, companyRole?: string) {
    // 1. Validar acceso: socio solo ve su propio reporte
    if (companyRole === 'USER') {
      const userPartners = await this.db.getDefaultClient().partners.findMany({
        where: { user_id: userId, deleted_at: null },
        select: { party_id: true },
      });
      const userPartyIds = userPartners.map((p) => p.party_id).filter(Boolean);
      if (!userPartyIds.includes(partyId)) {
        throw new ForbiddenException('No tenés acceso al reporte de este socio');
      }
    }

    // 2. Datos del socio
    const partner = await this.prisma.partners.findFirst({
      where: { party_id: partyId, deleted_at: null },
      include: {
        party: {
          select: { id: true, name: true, tax_id: true },
        },
      },
    });

    if (!partner) {
      throw new NotFoundException('Socio no encontrado');
    }

    // 3. Vales del socio
    const vales = await this.prisma.hr_vales.findMany({
      where: {
        party_id: partyId,
        party_type: 'PARTNER',
        status: { in: ['CONFIRMED', 'PAID'] },
        deleted_at: null,
      },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
      orderBy: { date: 'desc' },
    });

    // 4. Saldos por moneda
    const accounts = await this.prisma.hr_accounts.findMany({
      where: { party_id: partyId, active: true },
    });

    const balances = accounts.map((a) => ({
      currency_code: a.currency_code,
      balance: a.balance.toNumber(),
      converted_balance: a.converted_balance?.toNumber() ?? null,
    }));

    // 5. Resumen por tipo
    const emptyCurrencySummary = () => ({
      total_aportes: 0,
      total_retiros: 0,
      total_reembolsos: 0,
      total_prestamos: 0,
      saldo_neto: 0,
    });
    const summary = {
      by_currency: {
        ARS: emptyCurrencySummary(),
        USD: emptyCurrencySummary(),
      } as Record<string, ReturnType<typeof emptyCurrencySummary>>,
      saldo_neto_ars: 0,
      saldo_neto_usd: 0,
    };

    for (const vale of vales) {
      if (!['CONFIRMED', 'PAID'].includes(vale.status)) continue;
      const amount = vale.amount.toNumber();
      const rate = vale.exchange_rate?.toNumber() ?? 0;
      const amounts = {
        ARS: vale.currency_code === 'ARS' ? amount : rate > 0 ? amount * rate : 0,
        USD: vale.currency_code === 'USD' ? amount : rate > 0 ? amount / rate : 0,
      };
      for (const currency of ['ARS', 'USD'] as const) {
        const currencySummary = summary.by_currency[currency];
        const convertedAmount = amounts[currency];
        if (vale.type === 'APORTE') currencySummary.total_aportes += convertedAmount;
        if (vale.type === 'RETIRO') currencySummary.total_retiros += convertedAmount;
        if (vale.type === 'REEMBOLSO') currencySummary.total_reembolsos += convertedAmount;
        if (vale.type === 'PRESTAMO') currencySummary.total_prestamos += convertedAmount;
        currencySummary.saldo_neto += vale.type === 'APORTE' ? convertedAmount : -convertedAmount;
      }
    }

    // Saldos por moneda
    for (const b of balances) {
      if (b.currency_code === 'ARS') summary.saldo_neto_ars = b.balance;
      if (b.currency_code === 'USD') summary.saldo_neto_usd = b.balance;
    }

    // 6. Evolución de saldos (agrupada por fecha)
    const evolutionMap = new Map<string, { balance_ars: number; balance_usd: number }>();
    let runningArs = 0;
    let runningUsd = 0;
    const confirmedVales = [...vales]
      .filter((vale) => ['CONFIRMED', 'PAID'].includes(vale.status))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    for (const vale of confirmedVales) {
      const amount = vale.amount.toNumber();
      const rate = vale.exchange_rate?.toNumber() ?? 0;
      const ars = vale.currency_code === 'ARS' ? amount : rate > 0 ? amount * rate : 0;
      const usd = vale.currency_code === 'USD' ? amount : rate > 0 ? amount / rate : 0;
      const direction = vale.type === 'APORTE' ? 1 : -1;
      runningArs += ars * direction;
      runningUsd += usd * direction;
      const dateKey = vale.date.toISOString().split('T')[0];
      evolutionMap.set(dateKey, { balance_ars: runningArs, balance_usd: runningUsd });
    }

    const evolution = Array.from(evolutionMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    return {
      partner: {
        id: partner.id,
        name: partner.party?.name ?? `${partner.first_name} ${partner.last_name}`,
        partner_kind: partner.partner_kind,
        document_type: partner.document_type,
        document_number: partner.document_number,
        share_percentage: partner.share_percentage?.toNumber() ?? null,
        capital_contributed: partner.capital_contributed?.toNumber() ?? null,
        is_active: partner.is_active,
      },
      balances,
      summary,
      vales: vales.map((v) => ({
        ...v,
        amount: v.amount.toNumber(),
        exchange_rate: v.exchange_rate?.toNumber() ?? null,
        converted_amount: v.converted_amount?.toNumber() ?? null,
      })),
      evolution,
    };
  }
}
