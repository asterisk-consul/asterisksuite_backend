import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { parseLocalDateTime } from '@/common/utils/dates';
import { recalculateBankAccountLedger } from '../bank-accounts/bank-account-ledger';
import { BankMovementsService } from '../bank-movements/bank-movements.service';
import { CreateCreditCardDto, PayCardInstallmentDto, SettleCardCollectionDto, UpdateCreditCardDto } from './dto/credit-card.dto';

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
    return this.prisma.credit_cards.create({
      data: { ...dto, type: dto.type as any, brand: dto.brand as any, active: dto.active ?? true, created_by: userId },
    });
  }

  async update(id: string, dto: UpdateCreditCardDto, userId: string) {
    await this.findCard(id);
    return this.prisma.credit_cards.update({
      where: { id },
      data: { ...dto, type: dto.type as any, brand: dto.brand as any, updated_at: new Date(), updated_by: userId },
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
      },
      orderBy: [{ expected_clearing_date: 'asc' }, { date: 'desc' }],
    });
  }

  async settle(id: string, dto: SettleCardCollectionDto, userId: string) {
    const transaction = await this.prisma.credit_card_transactions.findFirst({
      where: { id, deleted_at: null, type: 'COLLECTION' }, include: { credit_card: true },
    });
    if (!transaction) throw new NotFoundException('Cobro con tarjeta no encontrado');
    if (transaction.clearing_status === 'CLEARED') throw new BadRequestException('La liquidación ya fue acreditada');
    const bank = await this.prisma.bank_accounts.findFirst({ where: { id: dto.bank_account_id, active: true, deleted_at: null } });
    if (!bank) throw new BadRequestException('La cuenta bancaria seleccionada no está disponible');
    if (bank.currency_code !== transaction.currency_code) throw new BadRequestException('La moneda del banco debe coincidir con la liquidación');
    const deductions = Number(dto.commission_amount || 0) + Number(dto.tax_amount || 0)
      + Number(dto.withholding_amount || 0) + Number(dto.other_deductions || 0);
    const calculatedNet = Number(transaction.amount) - deductions;
    if (Math.abs(calculatedNet - dto.net_amount) > 0.01 && !dto.notes?.trim()) {
      throw new BadRequestException('Explicá la diferencia entre el neto calculado y el acreditado');
    }
    const effectiveDate = parseLocalDateTime(dto.date);
    await this.prisma.$transaction(async tx => {
      const operation = await this.bankMovements.openOperation(
        {
          bankAccountId: bank.id,
          operationType: 'CARD_SETTLEMENT',
          sourceType: 'credit_card_settlement',
          sourceId: transaction.id,
          currencyCode: transaction.currency_code,
          date: effectiveDate,
          description: `Liquidación ${transaction.credit_card.name}${dto.reference ? ` · ${dto.reference}` : ''}`,
          reference: dto.reference ?? null,
          userId,
        },
        tx,
      );

      await this.bankMovements.addMovement(
        {
          bankAccountId: bank.id,
          type: 'COLLECTION',
          nature: 'CREDIT',
          amount: Number(transaction.amount),
          currencyCode: transaction.currency_code,
          description: `Acreditación ${transaction.credit_card.name}${dto.reference ? ` · ${dto.reference}` : ''}`,
          referenceType: 'credit_card_settlement',
          referenceId: transaction.id,
          paymentId: transaction.payment_id,
          cardSettlementId: transaction.id,
          date: effectiveDate,
          operationId: operation.id,
          userId,
          recalculate: false,
        },
        tx,
      );

      const chargeLines: { type: any; amount: number; label: string }[] = [
        { type: 'FEE', amount: Number(dto.commission_amount || 0), label: 'Comisión' },
        { type: 'TAX', amount: Number(dto.tax_amount || 0), label: 'Impuestos' },
        { type: 'RETENTION', amount: Number(dto.withholding_amount || 0), label: 'Retenciones' },
        { type: 'ADJUSTMENT', amount: Number(dto.other_deductions || 0), label: 'Otras deducciones' },
      ];
      for (const line of chargeLines) {
        if (!line.amount) continue;
        await this.bankMovements.addMovement(
          {
            bankAccountId: bank.id,
            type: line.type,
            nature: 'DEBIT',
            amount: -Math.abs(line.amount),
            currencyCode: transaction.currency_code,
            description: `${line.label} liquidación ${transaction.credit_card.name}`,
            referenceType: 'credit_card_settlement',
            referenceId: transaction.id,
            paymentId: transaction.payment_id,
            cardSettlementId: transaction.id,
            date: effectiveDate,
            operationId: operation.id,
            userId,
            recalculate: false,
          },
          tx,
        );
      }

      await this.bankMovements.closeOperation(operation.id, tx);

      await tx.credit_card_transactions.update({
        where: { id },
        data: {
          commission_amount: dto.commission_amount,
          tax_amount: dto.tax_amount ?? 0,
          withholding_amount: dto.withholding_amount ?? 0,
          other_deductions: dto.other_deductions ?? 0,
          net_amount: dto.net_amount,
          actual_clearing_date: effectiveDate,
          clearing_status: 'CLEARED',
          settlement_reference: dto.reference,
          settlement_notes: dto.notes,
          settlement_bank_id: bank.id,
          updated_at: new Date(), updated_by: userId,
        },
      });
    });
    await recalculateBankAccountLedger(this.prisma, bank.id);
    return this.prisma.credit_card_transactions.findUnique({ where: { id }, include: { credit_card: true, payment: true } });
  }

  async installments(status?: string, cardId?: string) {
    return this.prisma.credit_card_installments.findMany({
      where: { deleted_at: null, ...(status ? { status: status as any } : {}), ...(cardId ? { transaction: { credit_card_id: cardId } } : {}) },
      include: { transaction: { include: { credit_card: true, payment: { include: { party: true } } } } },
      orderBy: [{ due_date: 'asc' }, { installment_number: 'asc' }],
    });
  }

  async payInstallment(id: string, dto: PayCardInstallmentDto, userId: string) {
    const installment = await this.prisma.credit_card_installments.findFirst({
      where: { id, deleted_at: null }, include: { transaction: { include: { credit_card: true } } },
    });
    if (!installment || installment.transaction.type !== 'PURCHASE') throw new NotFoundException('Cuota de tarjeta no encontrada');
    if (installment.status === 'PAID') throw new BadRequestException('La cuota ya fue pagada');
    const bank = await this.prisma.bank_accounts.findFirst({ where: { id: dto.bank_account_id, active: true, deleted_at: null } });
    if (!bank) throw new BadRequestException('La cuenta bancaria seleccionada no está disponible');
    if (bank.currency_code !== installment.currency_code) throw new BadRequestException('La moneda del banco debe coincidir con la cuota');
    if (dto.amount <= 0) throw new BadRequestException('El importe pagado debe ser mayor a cero');
    if (Number(bank.balance) < dto.amount) throw new BadRequestException('La cuenta bancaria no tiene saldo suficiente');
    const effectiveDate = parseLocalDateTime(dto.date);
    await this.prisma.$transaction(async tx => {
      await this.bankMovements.addMovement(
        {
          bankAccountId: bank.id,
          type: 'PAYMENT',
          nature: 'DEBIT',
          amount: -Math.abs(dto.amount),
          currencyCode: installment.currency_code,
          description: `Pago ${installment.transaction.credit_card.name} · cuota ${installment.installment_number}/${installment.total_installments}${dto.reference ? ` · ${dto.reference}` : ''}`,
          referenceType: 'credit_card_installment',
          referenceId: installment.id,
          paymentId: installment.transaction.payment_id,
          date: effectiveDate,
          userId,
        },
        tx,
      );
      await tx.credit_card_installments.update({ where: { id }, data: {
        status: 'PAID', paid_date: effectiveDate, paid_amount: dto.amount,
        paid_currency_code: installment.currency_code, updated_at: new Date(), updated_by: userId,
      } });
      const remaining = await tx.credit_card_installments.count({ where: { transaction_id: installment.transaction_id, status: { not: 'PAID' }, deleted_at: null, id: { not: id } } });
      if (!remaining) await tx.credit_card_transactions.update({ where: { id: installment.transaction_id }, data: { clearing_status: 'CLEARED', actual_clearing_date: effectiveDate, updated_by: userId } });
    });
    await recalculateBankAccountLedger(this.prisma, bank.id);
    return this.prisma.credit_card_installments.findUnique({ where: { id }, include: { transaction: { include: { credit_card: true } } } });
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

  private async findCard(id: string) {
    const card = await this.prisma.credit_cards.findFirst({ where: { id, deleted_at: null } });
    if (!card) throw new NotFoundException('Tarjeta o canal de cobro no encontrado');
    return card;
  }
}
