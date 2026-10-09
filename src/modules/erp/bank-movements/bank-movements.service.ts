import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { recalculateBankAccountLedger } from '../bank-accounts/bank-account-ledger';

type PrismaLike = any;

export type BankMovementTypeValue =
  | 'OPENING_BALANCE'
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'TRANSFER'
  | 'PAYMENT'
  | 'COLLECTION'
  | 'CHECK_ISSUED'
  | 'CHECK_RECEIVED'
  | 'FEE'
  | 'INTEREST'
  | 'TAX'
  | 'RETENTION'
  | 'ADJUSTMENT';

export type BankMovementNatureValue = 'DEBIT' | 'CREDIT';

export type BankOperationTypeValue =
  | 'MANUAL'
  | 'PAYMENT'
  | 'COLLECTION'
  | 'CARD_SETTLEMENT'
  | 'CHECK'
  | 'CASH_TRANSFER'
  | 'HR_VALE'
  | 'INVESTMENT';

export interface OpenOperationInput {
  bankAccountId: string;
  operationType: BankOperationTypeValue;
  sourceType?: string | null;
  sourceId?: string | null;
  date?: Date;
  currencyCode: string;
  description?: string | null;
  reference?: string | null;
  userId?: string | null;
}

export interface AddMovementInput {
  bankAccountId: string;
  conceptId?: string | null;
  type: BankMovementTypeValue;
  nature?: BankMovementNatureValue | null;
  amount: number;
  baseAmount?: number | null;
  taxAmount?: number | null;
  totalAmount?: number | null;
  currencyCode: string;
  exchangeRate?: number | null;
  rateType?: string | null;
  convertedAmount?: number | null;
  amountAccountCurrency?: number | null;
  description?: string | null;
  reference?: string | null;
  referenceType?: string | null;
  referenceId?: string | null;
  attachmentFileId?: string | null;
  paymentId?: string | null;
  cardSettlementId?: string | null;
  documentDate?: Date | null;
  effectiveDate?: Date | null;
  date?: Date;
  operationId?: string | null;
  userId?: string | null;
  recalculate?: boolean;
}

export interface AddChargeInput {
  bankAccountId: string;
  paymentId?: string | null;
  operationId?: string | null;
  conceptId?: string | null;
  nature?: BankMovementNatureValue;
  baseAmount: number;
  percentage?: number | null;
  taxAmount?: number | null;
  totalAmount?: number | null;
  affectsBalance?: boolean;
  currencyCode: string;
  exchangeRate?: number | null;
  rateType?: string | null;
  convertedAmount?: number | null;
  description?: string | null;
  reference?: string | null;
  date?: Date;
  retention?: {
    jurisdiction?: string | null;
    taxCode?: string | null;
    certificateNumber?: string | null;
    period?: string | null;
  } | null;
  userId?: string | null;
}

const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

@Injectable()
export class BankMovementsService {
  constructor(private db: PrismaService) {}

  private resolve(prisma?: PrismaLike): PrismaLike {
    return prisma ?? this.db.getClientForCurrentContext();
  }

  // ═══════════════════════════════════════════
  // OPERACIONES
  // ═══════════════════════════════════════════

  async openOperation(raw: OpenOperationInput, prisma?: PrismaLike) {
    const client = this.resolve(prisma);
    return client.bank_operations.create({
      data: {
        bank_account_id: raw.bankAccountId,
        operation_type: raw.operationType,
        source_type: raw.sourceType ?? null,
        source_id: raw.sourceId ?? null,
        date: raw.date ?? new Date(),
        currency_code: raw.currencyCode,
        description: raw.description ?? null,
        reference: raw.reference ?? null,
        created_by: raw.userId ?? null,
      },
    });
  }

  async closeOperation(operationId: string, prisma?: PrismaLike) {
    const client = this.resolve(prisma);
    const movements = await client.bank_account_movements.findMany({
      where: { bank_operation_id: operationId, deleted_at: null },
      include: { bank_concept: true },
    });

    let gross = 0;
    let charges = 0;
    let retentions = 0;
    let net = 0;
    for (const movement of movements) {
      const amount = Number(movement.amount);
      net = money(net + amount);
      const isRetention = movement.bank_concept?.concept_type === 'RETENTION' || movement.type === 'RETENTION';
      const isCharge = Boolean(movement.bank_concept_id) || movement.type === 'FEE'
        || movement.type === 'TAX' || movement.type === 'INTEREST' || movement.type === 'ADJUSTMENT'
        || movement.type === 'RETENTION';

      if (isRetention) {
        retentions = money(retentions + Math.abs(amount));
      } else if (isCharge) {
        charges = money(charges + Math.abs(amount));
      } else {
        // Movimiento principal de la operación (cobro, pago, transferencia, etc.)
        gross = money(gross + Math.abs(amount));
      }
    }

    return client.bank_operations.update({
      where: { id: operationId },
      data: {
        gross_amount: gross,
        charges_amount: charges,
        retentions_amount: retentions,
        net_amount: net,
        updated_at: new Date(),
      },
    });
  }

  // ═══════════════════════════════════════════
  // MOVIMIENTOS
  // ═══════════════════════════════════════════

  async addMovement(raw: AddMovementInput, prisma?: PrismaLike) {
    const client = this.resolve(prisma);

    const account = await client.bank_accounts.findFirst({
      where: { id: raw.bankAccountId },
      select: { id: true, balance: true, currency_code: true, active: true },
    });
    if (!account) throw new NotFoundException('Cuenta bancaria no encontrada');
    if (!account.active) throw new BadRequestException('La cuenta bancaria está inactiva');

    const amount = money(Number(raw.amount));
    if (!Number.isFinite(amount) || amount === 0) {
      throw new BadRequestException('El importe del movimiento debe ser distinto de cero');
    }
    if (account.currency_code !== raw.currencyCode) {
      throw new BadRequestException(
        `La cuenta opera en ${account.currency_code} y el movimiento está expresado en ${raw.currencyCode}`,
      );
    }

    const concept = raw.conceptId ? await this.loadConcept(client, raw.conceptId) : null;

    let baseAmount = raw.baseAmount == null ? null : money(Number(raw.baseAmount));
    let taxAmount = raw.taxAmount == null ? null : money(Number(raw.taxAmount));
    if (concept?.calculates_iva && taxAmount == null && baseAmount != null) {
      taxAmount = money((baseAmount * Number(concept.iva_rate ?? 0)) / 100);
    }
    let totalAmount = raw.totalAmount == null ? null : money(Number(raw.totalAmount));
    if (totalAmount == null && baseAmount != null) {
      totalAmount = money(baseAmount + (taxAmount ?? 0));
    }

    const nature: BankMovementNatureValue =
      raw.nature ?? (amount < 0 ? 'DEBIT' : 'CREDIT');

    const balanceBefore = money(Number(account.balance));
    const balanceAfter = money(balanceBefore + amount);

    const movement = await client.bank_account_movements.create({
      data: {
        bank_account_id: raw.bankAccountId,
        bank_operation_id: raw.operationId ?? null,
        type: raw.type,
        nature,
        amount,
        base_amount: baseAmount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        currency_code: raw.currencyCode,
        exchange_rate: raw.exchangeRate ?? null,
        rate_type: raw.rateType ?? null,
        converted_amount: raw.convertedAmount ?? null,
        amount_account_currency: raw.amountAccountCurrency ?? null,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        description: raw.description ?? null,
        reference: raw.reference ?? null,
        reference_type: raw.referenceType ?? null,
        reference_id: raw.referenceId ?? null,
        attachment_file_id: raw.attachmentFileId ?? null,
        bank_concept_id: concept?.id ?? null,
        concept_code_snapshot: concept?.code ?? null,
        concept_name_snapshot: concept?.name ?? null,
        payment_id: raw.paymentId ?? null,
        card_settlement_id: raw.cardSettlementId ?? null,
        document_date: raw.documentDate ?? null,
        effective_date: raw.effectiveDate ?? null,
        date: raw.date ?? new Date(),
        created_by: raw.userId ?? null,
      },
    });

    await client.bank_accounts.update({
      where: { id: raw.bankAccountId },
      data: { balance: balanceAfter, updated_at: new Date() },
    });

    if (raw.recalculate !== false) {
      await recalculateBankAccountLedger(client, raw.bankAccountId);
    }

    return movement;
  }

  // ═══════════════════════════════════════════
  // CARGOS Y RETENCIONES DE PAGO
  // ═══════════════════════════════════════════

  /**
   * Calcula los importes de un cargo/retención a partir de su concepto.
   * Puede usarse en la etapa de borrador (sin crear movimientos) para
   * persistir el detalle y reutilizarlo al confirmar.
   */
  prepareCharge(concept: any, input: {
    baseAmount: number;
    percentage?: number | null;
    taxAmount?: number | null;
    totalAmount?: number | null;
    nature?: BankMovementNatureValue | null;
  }) {
    const baseAmount = money(Number(input.baseAmount ?? 0));
    const percentage = input.percentage == null
      ? (concept?.default_percentage != null ? Number(concept.default_percentage) : null)
      : Number(input.percentage);

    let taxAmount = input.taxAmount == null ? null : money(Number(input.taxAmount));
    if (taxAmount == null && concept?.calculates_iva && baseAmount) {
      taxAmount = money((baseAmount * Number(concept.iva_rate ?? 0)) / 100);
    }
    const totalAmount = input.totalAmount == null
      ? money(baseAmount + (taxAmount ?? 0))
      : money(Number(input.totalAmount));

    const nature: BankMovementNatureValue =
      (input.nature as BankMovementNatureValue) ?? (concept?.nature as BankMovementNatureValue) ?? 'DEBIT';

    return { baseAmount, percentage, taxAmount: taxAmount ?? 0, totalAmount, nature };
  }

  async addCharge(raw: AddChargeInput, prisma?: PrismaLike) {
    const client = this.resolve(prisma);

    const concept = raw.conceptId ? await this.loadConcept(client, raw.conceptId) : null;

    const computed = this.prepareCharge(concept, {
      baseAmount: raw.baseAmount,
      percentage: raw.percentage,
      taxAmount: raw.taxAmount,
      totalAmount: raw.totalAmount,
      nature: raw.nature,
    });

    const nature = computed.nature;
    const signedAmount = nature === 'DEBIT'
      ? -Math.abs(computed.totalAmount)
      : Math.abs(computed.totalAmount);
    const affectsBalance = raw.affectsBalance ?? concept?.affects_balance ?? true;

    const type = this.resolveChargeType(concept?.concept_type ?? null, nature);

    const movement = affectsBalance
      ? await this.addMovement(
          {
            bankAccountId: raw.bankAccountId,
            conceptId: concept?.id ?? null,
            type,
            nature,
            amount: signedAmount,
            baseAmount: computed.baseAmount,
            taxAmount: computed.taxAmount,
            totalAmount: computed.totalAmount,
            currencyCode: raw.currencyCode,
            exchangeRate: raw.exchangeRate,
            rateType: raw.rateType,
            convertedAmount: raw.convertedAmount,
            description: raw.description ?? concept?.name ?? null,
            reference: raw.reference ?? null,
            paymentId: raw.paymentId ?? null,
            date: raw.date,
            operationId: raw.operationId ?? null,
            userId: raw.userId,
          },
          client,
        )
      : null;

    return client.payment_bank_charges.create({
      data: {
        payment_id: raw.paymentId ?? null,
        bank_operation_id: raw.operationId ?? null,
        bank_account_movement_id: movement?.id ?? null,
        bank_concept_id: concept?.id ?? null,
        concept_code_snapshot: concept?.code ?? null,
        concept_name_snapshot: concept?.name ?? null,
        nature,
        base_amount: computed.baseAmount,
        percentage_applied: computed.percentage,
        tax_amount: computed.taxAmount,
        total_amount: computed.totalAmount,
        affects_balance: affectsBalance,
        jurisdiction: raw.retention?.jurisdiction ?? null,
        tax_code: raw.retention?.taxCode ?? null,
        certificate_number: raw.retention?.certificateNumber ?? null,
        period: raw.retention?.period ?? null,
        reference: raw.reference ?? null,
        created_by: raw.userId ?? null,
      },
    });
  }

  // ═══════════════════════════════════════════
  // ANULACIONES
  // ═══════════════════════════════════════════

  async cancelMovement(movementId: string, userId?: string | null, prisma?: PrismaLike) {
    const client = this.resolve(prisma);
    const movement = await client.bank_account_movements.findFirst({
      where: { id: movementId, deleted_at: null },
    });
    if (!movement) throw new NotFoundException('Movimiento bancario no encontrado');

    await client.bank_account_movements.update({
      where: { id: movementId },
      data: { deleted_at: new Date(), deleted_by: userId ?? null, updated_by: userId ?? null },
    });

    // Revertir el efecto del movimiento en el saldo antes de recalcular.
    await client.bank_accounts.update({
      where: { id: movement.bank_account_id },
      data: { balance: { increment: -Number(movement.amount) }, updated_at: new Date() },
    });

    await recalculateBankAccountLedger(client, movement.bank_account_id);
    return { ok: true };
  }

  async cancelOperation(operationId: string, userId?: string | null, prisma?: PrismaLike) {
    const client = this.resolve(prisma);
    const operation = await client.bank_operations.findFirst({
      where: { id: operationId, deleted_at: null },
    });
    if (!operation) throw new NotFoundException('Operación bancaria no encontrada');

    const now = new Date();
    const movements = await client.bank_account_movements.findMany({
      where: { bank_operation_id: operationId, deleted_at: null },
      select: { amount: true },
    });
    const removedDelta = movements.reduce((sum: number, m: any) => sum + Number(m.amount), 0);

    await client.payment_bank_charges.updateMany({
      where: { bank_operation_id: operationId, deleted_at: null },
      data: { deleted_at: now, deleted_by: userId ?? null, updated_by: userId ?? null },
    });
    await client.bank_account_movements.updateMany({
      where: { bank_operation_id: operationId, deleted_at: null },
      data: { deleted_at: now, deleted_by: userId ?? null, updated_by: userId ?? null },
    });
    await client.bank_operations.update({
      where: { id: operationId },
      data: { deleted_at: now, deleted_by: userId ?? null, updated_by: userId ?? null },
    });

    // Revertir el efecto neto de los movimientos anulados en el saldo.
    if (removedDelta !== 0) {
      await client.bank_accounts.update({
        where: { id: operation.bank_account_id },
        data: { balance: { increment: -removedDelta }, updated_at: new Date() },
      });
    }

    await recalculateBankAccountLedger(client, operation.bank_account_id);
    return { ok: true };
  }

  // ═══════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════

  private async loadConcept(client: PrismaLike, conceptId: string) {
    const concept = await client.bank_concepts.findFirst({
      where: { id: conceptId, deleted_at: null },
    });
    if (!concept) throw new NotFoundException('Concepto bancario no encontrado');
    if (!concept.is_active) throw new BadRequestException('El concepto bancario está inactivo');
    return concept;
  }

  private resolveChargeType(conceptType: string | null, nature: BankMovementNatureValue): BankMovementTypeValue {
    if (conceptType === 'RETENTION') return 'RETENTION';
    if (conceptType === 'TAX') return 'TAX';
    if (conceptType === 'INTEREST') return 'INTEREST';
    if (conceptType === 'COMMISSION') return 'FEE';
    if (conceptType === 'EXPENSE') return 'FEE';
    if (conceptType === 'ADJUSTMENT') return 'ADJUSTMENT';
    return nature === 'DEBIT' ? 'WITHDRAWAL' : 'DEPOSIT';
  }
}
