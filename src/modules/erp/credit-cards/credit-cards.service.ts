import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { parseLocalDateTime } from '@/common/utils/dates';
import { recalculateBankAccountLedger } from '../bank-accounts/bank-account-ledger';
import { BankMovementsService } from '../bank-movements/bank-movements.service';
import { CreateCreditCardDto, PayCreditCardSummaryDto, SettleCardCollectionDto, SettleCardCollectionsBatchDto, UpdateCreditCardDto } from './dto/credit-card.dto';
import { getCreditCardStatementCycle, splitCreditCardAmount } from './credit-card-statement.utils';

type PrismaLike = any;
const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

function allocateCents(total: number, rows: Array<{ id: string; amount: number }>) {
  const totalCents = Math.round(money(total) * 100);
  const weights = rows.map(row => Math.max(0, Math.round(money(row.amount) * 100)));
  const weightTotal = weights.reduce((sum, value) => sum + value, 0);
  if (!weightTotal) return rows.map(() => 0);
  const exact = weights.map(weight => totalCents * weight / weightTotal);
  const cents = exact.map(value => Math.floor(value));
  let remainder = totalCents - cents.reduce((sum, value) => sum + value, 0);
  const priority = exact.map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((left, right) => right.fraction - left.fraction);
  for (let index = 0; index < remainder; index += 1) cents[priority[index].index] += 1;
  return cents.map(value => value / 100);
}

@Injectable()
export class CreditCardsService {
  constructor(
    private readonly db: PrismaService,
    private readonly bankMovements: BankMovementsService,
  ) {}
  private get prisma() { return this.db.getClientForCurrentContext(); }

  findAll(type?: string) {
    return this.prisma.credit_cards.findMany({
      where: { deleted_at: null, ...(type ? { type: type as any } : {}) },
      include: { _count: { select: { transactions: true } } },
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
    });
  }

  async create(dto: CreateCreditCardDto, userId: string) {
    if (dto.type === 'COMPANY' && (!dto.last_four || !dto.holder_name)) {
      throw new BadRequestException('Las tarjetas corporativas requieren titular y últimos cuatro dígitos');
    }
    if (dto.type === 'COMPANY' && !dto.brand) {
      throw new BadRequestException('Seleccioná la marca de la tarjeta corporativa');
    }
    if (dto.type === 'COMPANY' && (!dto.closing_day || !dto.due_day)) {
      throw new BadRequestException('Las tarjetas corporativas requieren día de cierre y día de vencimiento');
    }
    return this.prisma.credit_cards.create({
      data: {
        ...dto,
        type: dto.type as any,
        brand: (dto.brand ?? 'OTHER') as any,
        last_four: dto.type === 'COMPANY' ? dto.last_four : null,
        holder_name: dto.type === 'COMPANY' ? dto.holder_name : null,
        channel_type: dto.type === 'CUSTOMER' ? (dto.channel_type ?? 'OTHER') : null,
        active: dto.active ?? true,
        created_by: userId,
      },
    });
  }

  async update(id: string, dto: UpdateCreditCardDto, userId: string) {
    const current = await this.findCard(id);
    const nextType = dto.type ?? current.type;
    if (nextType === 'COMPANY' && (!(dto.last_four ?? current.last_four) || !(dto.holder_name ?? current.holder_name))) {
      throw new BadRequestException('Las tarjetas corporativas requieren titular y últimos cuatro dígitos');
    }
    if (nextType === 'COMPANY' && (!(dto.closing_day ?? current.closing_day) || !(dto.due_day ?? current.due_day))) {
      throw new BadRequestException('Las tarjetas corporativas requieren día de cierre y día de vencimiento');
    }
    return this.prisma.credit_cards.update({
      where: { id },
      data: {
        ...dto,
        type: dto.type as any,
        brand: dto.brand ?? current.brand,
        last_four: nextType === 'COMPANY' ? (dto.last_four ?? current.last_four) : null,
        holder_name: nextType === 'COMPANY' ? (dto.holder_name ?? current.holder_name) : null,
        channel_type: nextType === 'CUSTOMER' ? (dto.channel_type ?? current.channel_type ?? 'OTHER') : null,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findCard(id);
    const pending = await this.prisma.credit_card_transactions.count({
      where: { credit_card_id: id, deleted_at: null, clearing_status: 'PENDING' },
    });
    if (pending) throw new BadRequestException('La tarjeta o canal tiene operaciones pendientes y no puede eliminarse');
    return this.prisma.credit_cards.update({
      where: { id }, data: { active: false, deleted_at: new Date(), deleted_by: userId },
    });
  }

  async transactions(filters: { type?: string; status?: string; cardId?: string }) {
    return this.prisma.credit_card_transactions.findMany({
      where: {
        deleted_at: null,
        ...(filters.type ? { type: filters.type as any } : {}),
        ...(filters.status ? { clearing_status: filters.status as any } : {}),
        ...(filters.cardId ? { credit_card_id: filters.cardId } : {}),
      },
      include: {
        credit_card: true,
        payment: { include: { party: { select: { id: true, name: true } }, documents: { include: { document: { select: { id: true, number: true } } } } } },
        installments: { where: { deleted_at: null }, orderBy: { installment_number: 'asc' } },
        settlement: { include: { bank_account: true } },
      },
      orderBy: [{ expected_clearing_date: 'asc' }, { date: 'desc' }],
    });
  }

  async settle(id: string, dto: SettleCardCollectionDto, userId: string) {
    await this.settleBatch({ ...dto, transaction_ids: [id] }, userId);
    return this.prisma.credit_card_transactions.findUnique({
      where: { id },
      include: { credit_card: true, payment: true, settlement: { include: { bank_account: true } } },
    });
  }

  async settleBatch(dto: SettleCardCollectionsBatchDto, userId: string) {
    const ids = [...new Set(dto.transaction_ids)];
    if (!ids.length || ids.length !== dto.transaction_ids.length) {
      throw new BadRequestException('Seleccioná cobros distintos para la liquidación');
    }
    if (ids.length > 500) throw new BadRequestException('Una liquidación no puede incluir más de 500 cobros');

    const transactions = await this.prisma.credit_card_transactions.findMany({
      where: { id: { in: ids }, deleted_at: null, type: 'COLLECTION' },
      include: { credit_card: true },
      orderBy: [{ date: 'asc' }, { created_at: 'asc' }, { id: 'asc' }],
    });
    if (transactions.length !== ids.length) throw new NotFoundException('Uno o más cobros seleccionados no existen');
    if (transactions.some((row: any) => row.clearing_status !== 'PENDING' || row.settlement_id)) {
      throw new BadRequestException('Uno o más cobros ya fueron acreditados o están en otra liquidación');
    }
    const cardId = transactions[0].credit_card_id;
    const currencyCode = transactions[0].currency_code;
    if (transactions.some((row: any) => row.credit_card_id !== cardId || row.currency_code !== currencyCode)) {
      throw new BadRequestException('Agrupá únicamente cobros del mismo canal y moneda');
    }

    const bank = await this.prisma.bank_accounts.findFirst({
      where: { id: dto.bank_account_id, active: true, deleted_at: null },
    });
    if (!bank) throw new BadRequestException('La cuenta o billetera seleccionada no está disponible');
    if (bank.currency_code !== currencyCode) throw new BadRequestException('La moneda del destino debe coincidir con los cobros');

    const totals = {
      gross: money(transactions.reduce((sum: number, row: any) => sum + Number(row.amount), 0)),
      commission: money(Number(dto.commission_amount || 0)),
      tax: money(Number(dto.tax_amount || 0)),
      withholding: money(Number(dto.withholding_amount || 0)),
      other: money(Number(dto.other_deductions || 0)),
      net: money(Number(dto.net_amount || 0)),
    };
    const calculatedNet = money(totals.gross - totals.commission - totals.tax - totals.withholding - totals.other);
    if (calculatedNet < 0) throw new BadRequestException('Los descuentos no pueden superar el importe bruto');
    if (Math.abs(calculatedNet - totals.net) > 0.009) {
      throw new BadRequestException('El neto debe coincidir con el bruto menos los descuentos; cargá cualquier diferencia en “Otros descuentos”');
    }

    const effectiveDate = parseLocalDateTime(dto.date);
    const allocationRows = transactions.map((row: any) => ({ id: row.id, amount: Number(row.amount) }));
    const allocations = {
      commission: allocateCents(totals.commission, allocationRows),
      tax: allocateCents(totals.tax, allocationRows),
      withholding: allocateCents(totals.withholding, allocationRows),
      other: allocateCents(totals.other, allocationRows),
    };
    const settlement = await this.prisma.$transaction(async (tx: PrismaLike) => {
      const batch = await tx.credit_card_settlements.create({
        data: {
          credit_card_id: cardId,
          bank_account_id: bank.id,
          date: effectiveDate,
          currency_code: currencyCode,
          transaction_count: transactions.length,
          gross_amount: totals.gross,
          commission_amount: totals.commission,
          tax_amount: totals.tax,
          withholding_amount: totals.withholding,
          other_deductions: totals.other,
          net_amount: totals.net,
          reference: dto.reference ?? null,
          notes: dto.notes ?? null,
          created_by: userId,
        },
      });

      const claimed = await tx.credit_card_transactions.updateMany({
        where: { id: { in: ids }, deleted_at: null, type: 'COLLECTION', clearing_status: 'PENDING', settlement_id: null },
        data: {
          settlement_id: batch.id,
          actual_clearing_date: effectiveDate,
          clearing_status: 'CLEARED',
          settlement_reference: dto.reference ?? null,
          settlement_notes: dto.notes ?? null,
          settlement_bank_id: bank.id,
          updated_at: new Date(),
          updated_by: userId,
        },
      });
      if (claimed.count !== ids.length) throw new BadRequestException('La selección cambió mientras se confirmaba; actualizá la pantalla e intentá de nuevo');

      const operation = await this.bankMovements.openOperation({
        bankAccountId: bank.id,
        operationType: 'CARD_SETTLEMENT',
        sourceType: 'credit_card_settlement',
        sourceId: batch.id,
        currencyCode,
        date: effectiveDate,
        description: `Liquidación ${transactions[0].credit_card.name}${dto.reference ? ` · ${dto.reference}` : ''}`,
        reference: dto.reference ?? null,
        userId,
      }, tx);

      await this.bankMovements.addMovement({
        bankAccountId: bank.id,
        type: 'COLLECTION',
        nature: 'CREDIT',
        amount: totals.gross,
        currencyCode,
        description: `Acreditación bruta ${transactions[0].credit_card.name}${dto.reference ? ` · ${dto.reference}` : ''}`,
        referenceType: 'credit_card_settlement',
        referenceId: batch.id,
        cardSettlementId: batch.id,
        date: effectiveDate,
        operationId: operation.id,
        userId,
        recalculate: false,
      }, tx);

      const chargeLines: { type: any; amount: number; label: string }[] = [
        { type: 'FEE', amount: totals.commission, label: 'Comisión' },
        { type: 'TAX', amount: totals.tax, label: 'Impuestos sobre comisión' },
        { type: 'RETENTION', amount: totals.withholding, label: 'Retenciones' },
        { type: 'ADJUSTMENT', amount: totals.other, label: 'Otros descuentos' },
      ];
      for (const line of chargeLines) {
        if (!line.amount) continue;
        await this.bankMovements.addMovement({
          bankAccountId: bank.id,
          type: line.type,
          nature: 'DEBIT',
          amount: -line.amount,
          currencyCode,
          description: `${line.label} · ${transactions[0].credit_card.name}`,
          referenceType: 'credit_card_settlement',
          referenceId: batch.id,
          cardSettlementId: batch.id,
          date: effectiveDate,
          operationId: operation.id,
          userId,
          recalculate: false,
        }, tx);
      }
      await this.bankMovements.closeOperation(operation.id, tx);

      for (let index = 0; index < transactions.length; index += 1) {
        const row: any = transactions[index];
        const commission = allocations.commission[index];
        const tax = allocations.tax[index];
        const withholding = allocations.withholding[index];
        const other = allocations.other[index];
        await tx.credit_card_transactions.update({
          where: { id: row.id },
          data: {
            commission_amount: commission,
            tax_amount: tax,
            withholding_amount: withholding,
            other_deductions: other,
            net_amount: money(Number(row.amount) - commission - tax - withholding - other),
            updated_at: new Date(),
            updated_by: userId,
          },
        });
      }

      await recalculateBankAccountLedger(tx, bank.id);
      return tx.credit_card_settlements.findUnique({
        where: { id: batch.id },
        include: { credit_card: true, bank_account: true, transactions: { include: { payment: true } } },
      });
    }, { timeout: 15000 });

    return settlement;
  }

  async settlements(page = 1) {
    const pageSize = 100;
    const safePage = Math.max(1, Math.floor(page || 1));
    const where = { deleted_at: null };
    const [total, items] = await Promise.all([
      this.prisma.credit_card_settlements.count({ where }),
      this.prisma.credit_card_settlements.findMany({
        where,
        include: {
          credit_card: true,
          bank_account: true,
          transactions: { where: { deleted_at: null }, include: { payment: true } },
        },
        orderBy: [{ date: 'desc' }, { created_at: 'desc' }],
        skip: (safePage - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return { items, total, page: safePage, page_size: pageSize };
  }

  async pendingCollections(page = 1) {
    const pageSize = 100;
    const safePage = Math.max(1, Math.floor(page || 1));
    const where = { deleted_at: null, type: 'COLLECTION' as any, clearing_status: 'PENDING' as any };
    const [total, items] = await Promise.all([
      this.prisma.credit_card_transactions.count({ where }),
      this.prisma.credit_card_transactions.findMany({
        where,
        include: {
          credit_card: true,
          payment: { include: { party: { select: { id: true, name: true } } } },
        },
        orderBy: [{ expected_clearing_date: 'asc' }, { date: 'desc' }, { created_at: 'asc' }],
        skip: (safePage - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return { items, total, page: safePage, page_size: pageSize };
  }

  async summaries(filters: { status?: string; cardId?: string; page?: number }) {
    const pageSize = 100;
    const page = Math.max(1, Math.floor(filters.page ?? 1));
    const where = {
      deleted_at: null,
      ...(filters.status ? { status: filters.status.toLowerCase() } : {}),
      ...(filters.cardId ? { credit_card_id: filters.cardId } : {}),
    };
    const [total, rows] = await Promise.all([
      this.prisma.credit_card_summaries.count({ where }),
      this.prisma.credit_card_summaries.findMany({
      where,
      include: {
        credit_card: true,
        items: {
          where: { deleted_at: null },
          orderBy: [{ installment_number: 'asc' }],
          include: {
            transaction: {
              select: {
                id: true,
                description: true,
                authorization: true,
                payment: { select: { id: true, number: true, description: true } },
              },
            },
          },
        },
      },
      orderBy: [{ closing_date: 'desc' }, { created_at: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      }),
    ]);

    if (!rows.length) return { items: [], total, page, page_size: pageSize };
    const operations = await this.prisma.bank_operations.findMany({
      where: {
        source_type: 'credit_card_summary',
        source_id: { in: rows.map((row: any) => row.id) },
        deleted_at: null,
      },
      include: {
        bank_account: { select: { id: true, name: true, bank_name: true, currency_code: true } },
      },
      orderBy: [{ created_at: 'desc' }],
    });
    const operationBySummaryId = new Map<string, any>();
    for (const operation of operations) {
      if (operation.source_id && !operationBySummaryId.has(operation.source_id)) {
        operationBySummaryId.set(operation.source_id, operation);
      }
    }
    return {
      items: rows.map((row: any) => ({ ...row, payment_operation: operationBySummaryId.get(row.id) ?? null })),
      total,
      page,
      page_size: pageSize,
    };
  }

  /**
   * Creates missing monthly summaries for older confirmed card purchases. The
   * batch is bounded so a tenant with years of history cannot create an
   * unbounded request or retain a large result set in the Nest process.
   */
  async generatePendingSummaries(userId: string) {
    const batchSize = 100;
    const transactions = await this.prisma.credit_card_transactions.findMany({
      where: {
        type: 'PURCHASE',
        deleted_at: null,
        credit_card: { type: 'COMPANY', deleted_at: null, closing_day: { not: null }, due_day: { not: null } },
        payment: { status: { in: ['CONFIRMED', 'PAID'] }, deleted_at: null },
        installments: { some: { status: 'PENDING', deleted_at: null } },
        summary_items: { none: { deleted_at: null } },
      },
      select: { id: true },
      orderBy: [{ date: 'asc' }, { created_at: 'asc' }],
      take: batchSize,
    });

    let summaryItemsCreated = 0;
    for (const transaction of transactions) {
      const created = await this.prisma.$transaction(
        (tx: PrismaLike) => this.syncPurchaseStatements(transaction.id, userId, tx, false),
        { timeout: 15_000 },
      );
      summaryItemsCreated += created;
    }

    const [next, unconfigured] = await Promise.all([
      this.prisma.credit_card_transactions.findFirst({
        where: {
          type: 'PURCHASE',
          deleted_at: null,
          credit_card: { type: 'COMPANY', deleted_at: null, closing_day: { not: null }, due_day: { not: null } },
          payment: { status: { in: ['CONFIRMED', 'PAID'] }, deleted_at: null },
          installments: { some: { status: 'PENDING', deleted_at: null } },
          summary_items: { none: { deleted_at: null } },
        },
        select: { id: true },
      }),
      this.prisma.credit_card_transactions.count({
        where: {
          type: 'PURCHASE',
          deleted_at: null,
          credit_card: { type: 'COMPANY', deleted_at: null, OR: [{ closing_day: null }, { due_day: null }] },
          payment: { status: { in: ['CONFIRMED', 'PAID'] }, deleted_at: null },
          installments: { some: { status: 'PENDING', deleted_at: null } },
          summary_items: { none: { deleted_at: null } },
        },
      }),
    ]);

    return {
      processed: transactions.length,
      summary_items_created: summaryItemsCreated,
      has_more: Boolean(next),
      unconfigured_transactions: unconfigured,
    };
  }

  async registerConfirmedPurchaseStatements(paymentId: string, userId: string, tx: PrismaLike) {
    const transactions = await tx.credit_card_transactions.findMany({
      where: { payment_id: paymentId, type: 'PURCHASE', deleted_at: null },
      select: { id: true },
    });
    for (const transaction of transactions) {
      await this.syncPurchaseStatements(transaction.id, userId, tx, true);
    }
  }

  async assertPurchaseCanBeReversed(transactionId: string, client: PrismaLike = this.prisma) {
    const paidSummaryItem = await client.credit_card_summary_items.findFirst({
      where: {
        transaction_id: transactionId,
        deleted_at: null,
        summary: { status: 'paid', deleted_at: null },
      },
      include: { summary: { select: { month: true, year: true, credit_card: { select: { name: true } } } } },
    });
    if (paidSummaryItem) {
      const period = `${String(paidSummaryItem.summary.month).padStart(2, '0')}/${paidSummaryItem.summary.year}`;
      throw new BadRequestException(`El consumo ya pertenece al resumen pagado ${period} de ${paidSummaryItem.summary.credit_card.name}. Revertí primero ese movimiento bancario.`);
    }
  }

  async removePurchaseFromStatements(transactionId: string, userId: string, client: PrismaLike = this.prisma) {
    const now = new Date();
    const items = await client.credit_card_summary_items.findMany({
      where: { transaction_id: transactionId, deleted_at: null },
      select: { summary_id: true },
    });
    if (!items.length) return;
    const summaryIds = [...new Set(items.map((item: any) => item.summary_id))];
    await client.credit_card_summary_items.updateMany({
      where: { transaction_id: transactionId, deleted_at: null },
      data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
    });

    for (const summaryId of summaryIds) {
      const summary = await client.credit_card_summaries.findFirst({
        where: { id: summaryId, deleted_at: null },
      });
      if (!summary || summary.status.toLowerCase() !== 'pending') continue;
      const remainingItems = await client.credit_card_summary_items.findMany({
        where: { summary_id: summaryId, deleted_at: null },
        include: { transaction: { select: { amount: true } } },
      });
      const totalInstallments = remainingItems.reduce((total: number, item: any) => total + Number(item.amount), 0);
      const totalPurchases = remainingItems
        .filter((item: any) => item.installment_number === 1)
        .reduce((total: number, item: any) => total + Number(item.transaction.amount), 0);
      const totalPayments = Number(summary.total_payments ?? 0);
      await client.credit_card_summaries.update({
        where: { id: summaryId },
        data: {
          status: remainingItems.length ? 'pending' : 'cancelled',
          total_purchases: totalPurchases,
          total_installments: totalInstallments,
          balance: Math.max(0, Number((totalInstallments - totalPayments).toFixed(2))),
          updated_at: now,
          updated_by: userId,
        },
      });
    }
  }

  async paySummary(id: string, dto: PayCreditCardSummaryDto, userId: string) {
    const summary = await this.prisma.credit_card_summaries.findFirst({
      where: { id, deleted_at: null },
      include: { credit_card: true, items: { where: { deleted_at: null } } },
    });
    if (!summary) throw new NotFoundException('Resumen de tarjeta no encontrado');
    if (summary.status.toLowerCase() !== 'pending') throw new BadRequestException('El resumen ya no está pendiente de pago');

    const amount = Number(summary.balance);
    if (!Number.isFinite(amount) || amount <= 0) throw new BadRequestException('El resumen no tiene saldo pendiente');
    if (!summary.items.length) throw new BadRequestException('El resumen no tiene consumos asociados');
    const itemsTotal = summary.items.reduce((total: number, item: any) => total + Number(item.amount), 0);
    if (Math.abs(itemsTotal - amount) > 0.01) {
      throw new BadRequestException('El saldo del resumen no coincide con sus cuotas pendientes. Actualizá los resúmenes antes de pagar.');
    }

    const bank = await this.prisma.bank_accounts.findFirst({
      where: { id: dto.bank_account_id, active: true, deleted_at: null },
      select: { id: true, name: true, bank_name: true, balance: true, currency_code: true },
    });
    if (!bank) throw new BadRequestException('La cuenta bancaria seleccionada no está disponible');
    if (bank.currency_code !== summary.currency_code) throw new BadRequestException('La moneda del banco debe coincidir con el resumen');
    if (Number(bank.balance) < amount) throw new BadRequestException('La cuenta bancaria no tiene saldo suficiente');

    const effectiveDate = parseLocalDateTime(dto.date);
    await this.prisma.$transaction(async (tx: PrismaLike) => {
      const claim = await tx.credit_card_summaries.updateMany({
        where: { id, status: summary.status, balance: { gt: 0 }, deleted_at: null },
        data: { status: 'processing', updated_at: new Date(), updated_by: userId },
      });
      if (claim.count !== 1) throw new BadRequestException('El resumen ya fue tomado por otro pago o dejó de estar pendiente');

      const current = await tx.credit_card_summaries.findUnique({
        where: { id },
        include: { credit_card: true, items: { where: { deleted_at: null } } },
      });
      if (!current || !current.items.length) throw new BadRequestException('El resumen no tiene cuotas pendientes');
      const currentAmount = Number(current.balance);
      const currentItemsTotal = current.items.reduce((total: number, item: any) => total + Number(item.amount), 0);
      if (Math.abs(currentAmount - amount) > 0.01 || Math.abs(currentItemsTotal - currentAmount) > 0.01) {
        throw new BadRequestException('El resumen cambió mientras se registraba el pago. Volvé a cargarlo.');
      }

      const baseDescription = `Pago resumen ${current.credit_card.name} · ${String(current.month).padStart(2, '0')}/${current.year}`;
      const description = dto.notes?.trim() ? `${baseDescription} · ${dto.notes.trim()}`.slice(0, 255) : baseDescription;
      const operation = await this.bankMovements.openOperation(
        {
          bankAccountId: bank.id,
          operationType: 'PAYMENT',
          sourceType: 'credit_card_summary',
          sourceId: id,
          currencyCode: current.currency_code,
          date: effectiveDate,
          description,
          reference: dto.reference ?? null,
          userId,
        },
        tx,
      );

      await this.bankMovements.addMovement(
        {
          bankAccountId: bank.id,
          type: 'PAYMENT',
          nature: 'DEBIT',
          amount: -amount,
          currencyCode: current.currency_code,
          description,
          reference: dto.reference ?? null,
          referenceType: 'credit_card_summary',
          referenceId: id,
          date: effectiveDate,
          operationId: operation.id,
          userId,
          recalculate: false,
        },
        tx,
      );

      for (const item of current.items) {
        const paid = await tx.credit_card_installments.updateMany({
          where: {
            transaction_id: item.transaction_id,
            installment_number: item.installment_number,
            status: 'PENDING',
            deleted_at: null,
          },
          data: {
            status: 'PAID',
            paid_date: effectiveDate,
            paid_amount: item.amount,
            paid_currency_code: item.currency_code,
            updated_at: new Date(),
            updated_by: userId,
          },
        });
        if (paid.count !== 1) throw new BadRequestException('Una cuota del resumen ya fue pagada o está duplicada. No se generó el débito bancario.');
      }

      const transactionIds = [...new Set(current.items.map((item: any) => item.transaction_id))];
      for (const transactionId of transactionIds) {
        const remaining = await tx.credit_card_installments.count({
          where: { transaction_id: transactionId, status: 'PENDING', deleted_at: null },
        });
        if (!remaining) {
          await tx.credit_card_transactions.update({
            where: { id: transactionId },
            data: { clearing_status: 'CLEARED', actual_clearing_date: effectiveDate, updated_at: new Date(), updated_by: userId },
          });
        }
      }

      await tx.credit_card_summaries.update({
        where: { id },
        data: {
          status: 'paid',
          total_payments: { increment: amount },
          balance: 0,
          updated_at: new Date(),
          updated_by: userId,
        },
      });
      await this.bankMovements.closeOperation(operation.id, tx);
    }, { timeout: 15_000 });

    await recalculateBankAccountLedger(this.prisma, bank.id);
    const [paidSummary, operation] = await Promise.all([
      this.prisma.credit_card_summaries.findUnique({ where: { id }, include: { credit_card: true } }),
      this.prisma.bank_operations.findFirst({
        where: { source_type: 'credit_card_summary', source_id: id, deleted_at: null },
        include: { bank_account: { select: { id: true, name: true, bank_name: true, currency_code: true } } },
        orderBy: [{ created_at: 'desc' }],
      }),
    ]);
    return { ...paidSummary, payment_operation: operation };
  }

  async reverseSummaryPayment(id: string, userId: string) {
    const summary = await this.prisma.credit_card_summaries.findFirst({
      where: { id, deleted_at: null },
      include: { items: { where: { deleted_at: null } } },
    });
    if (!summary) throw new NotFoundException('Resumen de tarjeta no encontrado');
    if (summary.status.toLowerCase() !== 'paid') throw new BadRequestException('Solo se puede revertir un resumen pagado');

    await this.prisma.$transaction(async (tx: PrismaLike) => {
      const claim = await tx.credit_card_summaries.updateMany({
        where: { id, status: 'paid', deleted_at: null },
        data: { status: 'reversing', updated_at: new Date(), updated_by: userId },
      });
      if (claim.count !== 1) throw new BadRequestException('El resumen ya está siendo modificado');

      const current = await tx.credit_card_summaries.findUnique({
        where: { id },
        include: { items: { where: { deleted_at: null } } },
      });
      if (!current?.items.length) throw new BadRequestException('El resumen pagado no tiene cuotas asociadas');

      const operation = await tx.bank_operations.findFirst({
        where: { source_type: 'credit_card_summary', source_id: id, deleted_at: null },
        orderBy: [{ created_at: 'desc' }],
      });
      if (!operation) throw new BadRequestException('No se encontró el débito bancario asociado; no se revirtió el resumen');

      for (const item of current.items) {
        const restored = await tx.credit_card_installments.updateMany({
          where: {
            transaction_id: item.transaction_id,
            installment_number: item.installment_number,
            status: 'PAID',
            deleted_at: null,
          },
          data: {
            status: 'PENDING',
            paid_date: null,
            paid_amount: null,
            paid_currency_code: null,
            updated_at: new Date(),
            updated_by: userId,
          },
        });
        if (restored.count !== 1) throw new BadRequestException('No se pudo restablecer una cuota pagada; no se revirtió el débito');
      }

      const transactionIds = [...new Set(current.items.map((item: any) => item.transaction_id))];
      await tx.credit_card_transactions.updateMany({
        where: { id: { in: transactionIds }, deleted_at: null },
        data: { clearing_status: 'PENDING', actual_clearing_date: null, updated_at: new Date(), updated_by: userId },
      });

      await this.bankMovements.cancelOperation(operation.id, userId, tx);
      await tx.credit_card_summaries.update({
        where: { id },
        data: {
          status: 'pending',
          total_payments: 0,
          balance: current.total_installments,
          updated_at: new Date(),
          updated_by: userId,
        },
      });
    }, { timeout: 15_000 });

    return this.prisma.credit_card_summaries.findUnique({
      where: { id },
      include: { credit_card: true, items: { where: { deleted_at: null } } },
    });
  }

  async installments(status?: string, cardId?: string) {
    return this.prisma.credit_card_installments.findMany({
      where: {
        deleted_at: null,
        ...(status ? { status: status as any } : {}),
        transaction: {
          type: 'PURCHASE',
          credit_card: { type: 'COMPANY' },
          payment: { status: { in: ['CONFIRMED', 'PAID'] }, deleted_at: null },
          ...(cardId ? { credit_card_id: cardId } : {}),
        },
      },
      include: { transaction: { include: { credit_card: true, payment: { include: { party: true } } } } },
      orderBy: [{ due_date: 'asc' }, { installment_number: 'asc' }],
    });
  }

  async dashboard(days = 7) {
    const now = new Date();
    const horizon = new Date(now); horizon.setDate(horizon.getDate() + days);
    const [pending, overdue, corporate, collections] = await Promise.all([
      this.prisma.credit_card_transactions.count({ where: { type: 'COLLECTION', clearing_status: 'PENDING', deleted_at: null } }),
      this.prisma.credit_card_transactions.count({ where: { type: 'COLLECTION', clearing_status: 'PENDING', expected_clearing_date: { lt: now }, deleted_at: null } }),
      this.prisma.credit_card_installments.aggregate({ _sum: { amount: true }, where: { status: 'PENDING', due_date: { lte: horizon }, deleted_at: null } }),
      this.prisma.credit_card_transactions.aggregate({ _sum: { net_amount: true }, where: { type: 'COLLECTION', clearing_status: 'PENDING', expected_clearing_date: { lte: horizon }, deleted_at: null } }),
    ]);
    return { pending_collections: pending, overdue_collections: overdue, upcoming_installments: Number(corporate._sum.amount ?? 0), expected_settlements: Number(collections._sum.net_amount ?? 0), days };
  }

  async report(from?: string, to?: string) {
    const rows = await this.transactions({});
    const filtered = rows.filter(row => (!from || row.date >= parseLocalDateTime(from)) && (!to || row.date <= parseLocalDateTime(to)));
    return {
      totals: filtered.reduce((acc, row) => {
        const key = row.type === 'COLLECTION' ? 'collections' : 'purchases';
        acc[key] += Number(row.amount); acc.commissions += Number(row.commission_amount ?? 0); acc.net += Number(row.net_amount ?? 0); return acc;
      }, { collections: 0, purchases: 0, commissions: 0, net: 0 }),
      by_card: Object.values(filtered.reduce((acc: Record<string, any>, row) => {
        const item = acc[row.credit_card_id] ??= { id: row.credit_card_id, name: row.credit_card.name, type: row.credit_card.type, amount: 0, commissions: 0, operations: 0 };
        item.amount += Number(row.amount); item.commissions += Number(row.commission_amount ?? 0); item.operations += 1; return acc;
      }, {})),
    };
  }

  private async syncPurchaseStatements(transactionId: string, userId: string, client: PrismaLike, rebuildInstallments: boolean) {
    const transaction = await client.credit_card_transactions.findFirst({
      where: { id: transactionId, deleted_at: null, type: 'PURCHASE' },
      include: {
        credit_card: true,
        installments: { where: { deleted_at: null }, orderBy: { installment_number: 'asc' } },
      },
    });
    if (!transaction || transaction.credit_card.type !== 'COMPANY') return 0;

    const card = transaction.credit_card;
    if (!card.closing_day || !card.due_day) {
      throw new BadRequestException(`Configurá los días de cierre y vencimiento de la tarjeta ${card.name} antes de confirmar el pago`);
    }
    if (card.currency_code !== transaction.currency_code) {
      throw new BadRequestException(`La moneda del consumo debe coincidir con la tarjeta ${card.name}`);
    }

    const count = Math.max(1, Math.floor(Number(transaction.installments_total ?? 1)));
    if (count > 48) throw new BadRequestException(`La tarjeta ${card.name} supera el máximo de 48 cuotas soportado`);
    let installments = transaction.installments as any[];
    if (rebuildInstallments) {
      if (installments.some((item: any) => item.status === 'PAID')) {
        throw new BadRequestException('No se pueden regenerar las cuotas: el consumo ya tiene cuotas pagadas');
      }
      const now = new Date();
      await client.credit_card_installments.updateMany({
        where: { transaction_id: transaction.id, deleted_at: null, status: 'PENDING' },
        data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
      });
      const amounts = splitCreditCardAmount(Number(transaction.amount), count);
      const rows = amounts.map((amount, index) => {
        const installmentNumber = index + 1;
        const cycle = getCreditCardStatementCycle(transaction.date, installmentNumber, card.closing_day, card.due_day);
        return {
          transaction_id: transaction.id,
          installment_number: installmentNumber,
          total_installments: count,
          amount,
          currency_code: transaction.currency_code,
          exchange_rate: transaction.exchange_rate,
          due_date: cycle.dueDate,
          created_by: userId,
        };
      });
      if (rows.length) await client.credit_card_installments.createMany({ data: rows });
      installments = await client.credit_card_installments.findMany({
        where: { transaction_id: transaction.id, deleted_at: null },
        orderBy: { installment_number: 'asc' },
      });
    } else {
      const pending = installments.filter((item: any) => item.status === 'PENDING');
      if (!pending.length) return 0;
      const alreadyPaid = installments
        .filter((item: any) => item.status === 'PAID')
        .reduce((total: number, item: any) => total + Number(item.paid_amount ?? item.amount), 0);
      const remaining = Math.max(0, Number(transaction.amount) - alreadyPaid);
      const amounts = splitCreditCardAmount(remaining, pending.length);
      for (let index = 0; index < pending.length; index += 1) {
        const item = pending[index];
        const cycle = getCreditCardStatementCycle(transaction.date, item.installment_number, card.closing_day, card.due_day);
        const updated = await client.credit_card_installments.update({
          where: { id: item.id },
          data: {
            due_date: cycle.dueDate,
            amount: amounts[index],
            total_installments: count,
            currency_code: transaction.currency_code,
            exchange_rate: transaction.exchange_rate,
            updated_at: new Date(),
            updated_by: userId,
          },
        });
        installments[installments.findIndex((candidate: any) => candidate.id === item.id)] = updated;
      }
    }

    const pendingLines = installments
      .filter((item: any) => item.status === 'PENDING')
      .map((item: any) => ({
        installment: item,
        cycle: getCreditCardStatementCycle(transaction.date, item.installment_number, card.closing_day, card.due_day),
        amount: Number(item.amount),
      }));
    const byPeriod = new Map<string, typeof pendingLines>();
    for (const line of pendingLines) {
      const key = `${line.cycle.year}-${line.cycle.month}`;
      const group = byPeriod.get(key) ?? [];
      group.push(line);
      byPeriod.set(key, group);
    }

    let createdItems = 0;
    for (const group of byPeriod.values()) {
      const first = group[0];
      const summary = await client.credit_card_summaries.upsert({
        where: { credit_card_id_month_year: { credit_card_id: card.id, month: first.cycle.month, year: first.cycle.year } },
        create: {
          credit_card_id: card.id,
          month: first.cycle.month,
          year: first.cycle.year,
          closing_date: first.cycle.closingDate,
          due_date: first.cycle.dueDate,
          currency_code: transaction.currency_code,
          status: 'pending',
          created_by: userId,
        },
        update: { closing_date: first.cycle.closingDate, due_date: first.cycle.dueDate, updated_at: new Date(), updated_by: userId },
      });
      if (summary.status.toLowerCase() !== 'pending') {
        throw new BadRequestException(`El resumen ${String(summary.month).padStart(2, '0')}/${summary.year} de ${card.name} ya no admite consumos nuevos`);
      }

      for (const line of group) {
        const key = { summary_id_transaction_id: { summary_id: summary.id, transaction_id: transaction.id } };
        const prior = await client.credit_card_summary_items.findUnique({ where: key });
        await client.credit_card_summary_items.upsert({
          where: key,
          create: {
            summary_id: summary.id,
            transaction_id: transaction.id,
            installment_number: line.installment.installment_number,
            amount: line.amount,
            currency_code: transaction.currency_code,
            created_by: userId,
          },
          update: {
            installment_number: line.installment.installment_number,
            amount: line.amount,
            currency_code: transaction.currency_code,
            deleted_at: null,
            deleted_by: null,
            updated_at: new Date(),
            updated_by: userId,
          },
        });
        if (!prior || prior.deleted_at) createdItems += 1;
      }

      const summaryItems = await client.credit_card_summary_items.findMany({
        where: { summary_id: summary.id, deleted_at: null },
        include: { transaction: { select: { amount: true } } },
      });
      const totalInstallments = summaryItems.reduce((total: number, item: any) => total + Number(item.amount), 0);
      const totalPurchases = summaryItems
        .filter((item: any) => item.installment_number === 1)
        .reduce((total: number, item: any) => total + Number(item.transaction.amount), 0);
      const totalPayments = Number(summary.total_payments ?? 0);
      await client.credit_card_summaries.update({
        where: { id: summary.id },
        data: {
          total_purchases: totalPurchases,
          total_installments: totalInstallments,
          balance: Math.max(0, Number((totalInstallments - totalPayments).toFixed(2))),
          updated_at: new Date(),
          updated_by: userId,
        },
      });
    }

    return createdItems;
  }

  private async findCard(id: string) {
    const card = await this.prisma.credit_cards.findFirst({ where: { id, deleted_at: null } });
    if (!card) throw new NotFoundException('Tarjeta o canal de cobro no encontrado');
    return card;
  }
}
