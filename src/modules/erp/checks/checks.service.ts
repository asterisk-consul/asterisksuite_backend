import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { recalculateBankAccountLedger } from '../bank-accounts/bank-account-ledger';
import { parseLocalDateTime } from '@/common/utils/dates';
import { BankMovementsService } from '../bank-movements/bank-movements.service';

@Injectable()
export class ChecksService {
  constructor(
    private db: PrismaService,
    private bankMovements: BankMovementsService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private argentinaDateStart(value = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(value);
    const part = (type: string) => parts.find((item) => item.type === type)?.value ?? '';
    return new Date(Date.UTC(Number(part('year')), Number(part('month')) - 1, Number(part('day'))));
  }

  private async validateBankAccount(bankAccountId: string | undefined, currencyCode: string) {
    if (!bankAccountId) return;
    const account = await this.prisma.bank_accounts.findFirst({
      where: { id: bankAccountId, deleted_at: null },
      select: { active: true, currency_code: true },
    });
    if (!account) throw new NotFoundException('Cuenta bancaria no encontrada');
    if (!account.active) throw new BadRequestException('La cuenta bancaria seleccionada está inactiva');
    if (account.currency_code !== currencyCode) {
      throw new BadRequestException('La moneda del cheque debe coincidir con la moneda de la cuenta bancaria');
    }
  }

  async create(dto: CreateCheckDto, userId: string) {
    if (dto.is_own && !dto.bank_account_id) {
      throw new BadRequestException('Seleccioná la cuenta bancaria que se debitará para el cheque propio');
    }
    await this.validateBankAccount(dto.bank_account_id, dto.currency_code);
    return this.prisma.checks.create({
      data: {
        payment_id: dto.payment_id,
        bank_account_id: dto.bank_account_id,
        check_number: dto.check_number,
        bank_name: dto.bank_name,
        bank_branch: dto.bank_branch,
        account_number: dto.account_number,
        issuer_name: dto.issuer_name,
        issuer_id: dto.issuer_id,
        amount: dto.amount,
        available_amount: dto.amount,
        currency_code: dto.currency_code,
        issue_date: new Date(dto.issue_date),
        due_date: new Date(dto.due_date),
        is_own: dto.is_own ?? false,
        notes: dto.notes,
        payment_date: dto.payment_date ? new Date(dto.payment_date) : null,
        status: 'PENDING',
        created_by: userId,
      },
    });
  }

  async findAvailable(isOwn?: boolean) {
    const where: Record<string, any> = {
      deleted_at: null,
      status: 'PENDING',
      // Con aplicación parcial: disponible si nunca se usó (null) o le queda saldo
      AND: [
        {
          OR: [
            { available_amount: null },
            { available_amount: { gt: 0 } },
          ],
        },
      ],
    };
    // Sin isOwn → devolver propios y de terceros
    if (isOwn !== undefined) where.is_own = isOwn;

    return this.prisma.checks.findMany({
      where,
      orderBy: { due_date: 'asc' },
      include: {
        bank_account: {
          select: { id: true, name: true, bank_name: true, currency_code: true },
        },
      },
    });
  }

  async findAll(filters?: {
    status?: string;
    is_own?: boolean;
    bank_name?: string;
    due_before?: string;
  }) {
    const where: Record<string, any> = { deleted_at: null };

    if (filters?.status) where.status = filters.status;
    if (filters?.is_own !== undefined) where.is_own = filters.is_own;
    if (filters?.bank_name) where.bank_name = { contains: filters.bank_name, mode: 'insensitive' };
    if (filters?.due_before) {
      where.due_date = { lte: new Date(filters.due_before) };
    }
    return this.prisma.checks.findMany({
      where,
      // La cartera general muestra primero los cheques cargados recientemente.
      // Los listados operativos por vencimiento conservan su orden específico.
      orderBy: { created_at: 'desc' },
      include: {
        payment: {
          select: {
            id: true,
            number: true,
            type: true,
            amount: true,
            party_id: true,
            party_type: true,
            party: { select: { id: true, name: true, type: true } },
          },
        },
        payment_allocations: {
          select: {
            amount_applied: true,
            payment: {
              select: {
                id: true,
                number: true,
                type: true,
                amount: true,
                party_id: true,
                party_type: true,
                party: { select: { id: true, name: true, type: true } },
              },
            },
          },
        },
        bank_account: {
          select: { id: true, name: true, bank_name: true, currency_code: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const check = await this.prisma.checks.findFirst({
      where: { id, deleted_at: null },
      include: {
        payment: {
          select: { id: true, number: true, type: true, amount: true, party_id: true },
        },
        bank_account: {
          select: { id: true, name: true, bank_name: true, currency_code: true },
        },
      },
    });
    if (!check) throw new NotFoundException('Cheque no encontrado');
    return check;
  }

  async update(id: string, dto: UpdateCheckDto, userId: string) {
    const check = await this.findOne(id);

    if (dto.status !== undefined) {
      throw new BadRequestException('El estado del cheque se actualiza mediante sus acciones de pago, depósito, débito o rechazo');
    }

    if (check.is_own && !(dto.bank_account_id ?? check.bank_account_id)) {
      throw new BadRequestException('El cheque propio debe tener una cuenta bancaria a debitar');
    }

    await this.validateBankAccount(
      dto.bank_account_id ?? check.bank_account_id ?? undefined,
      dto.currency_code ?? check.currency_code,
    );

    const data: Record<string, any> = {
      updated_at: new Date(),
      updated_by: userId,
    };

    if (dto.check_number !== undefined) data.check_number = dto.check_number;
    if (dto.issue_date !== undefined) data.issue_date = new Date(dto.issue_date);
    if (dto.currency_code !== undefined) data.currency_code = dto.currency_code;
    if (dto.bank_name !== undefined && dto.bank_name !== '') data.bank_name = dto.bank_name;
    if (dto.bank_account_id !== undefined) data.bank_account_id = dto.bank_account_id;
    if (dto.bank_branch !== undefined) data.bank_branch = dto.bank_branch;
    if (dto.account_number !== undefined) data.account_number = dto.account_number;
    if (dto.issuer_name !== undefined && dto.issuer_name !== '') data.issuer_name = dto.issuer_name;
    if (dto.issuer_id !== undefined) data.issuer_id = dto.issuer_id;
    if (dto.due_date) {
      data.due_date = new Date(dto.due_date);
      data.notification_sent = false;
    }
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.payment_date) data.payment_date = new Date(dto.payment_date);
    if (dto.deposit_date) data.deposit_date = new Date(dto.deposit_date);
    if (dto.clearing_date) data.clearing_date = new Date(dto.clearing_date);

    // Cambio de monto: ajustar el saldo disponible coherentemente
    if (dto.amount !== undefined && Number(dto.amount) !== Number(check.amount)) {
      const appliedTotal = await this.prisma.payment_checks.aggregate({
        where: { check_id: id },
        _sum: { amount_applied: true },
      });
      const applied = appliedTotal._sum.amount_applied?.toNumber() ?? 0;
      const newAmount = Number(dto.amount);
      if (newAmount < applied) {
        throw new BadRequestException(
          `El cheque tiene ${applied.toFixed(2)} aplicado(s) en pagos; el nuevo monto no puede ser menor`,
        );
      }
      data.amount = newAmount;
      if (check.available_amount == null) {
        // Nunca usado: el disponible pasa a ser el nuevo monto
        data.available_amount = newAmount;
      } else {
        // Parcialmente usado: ajustar por la diferencia
        data.available_amount = Number((Number(check.available_amount) + (newAmount - Number(check.amount))).toFixed(2));
      }
    }

    await this.prisma.checks.update({
      where: { id },
      data,
    });

    return this.findOne(id);
  }

  async clear(id: string, userId: string) {
    const check = await this.findOne(id);
    if (check.is_own) {
      throw new BadRequestException('Los cheques propios se debitan manualmente desde la cuenta asociada');
    }
    if (!['PENDING', 'CONFIRMED'].includes(check.status)) {
      throw new BadRequestException('Solo se pueden cobrar cheques pendientes o confirmados');
    }
    if (!check.bank_account_id) {
      throw new BadRequestException('El cheque no tiene cuenta bancaria asociada. Editá el cheque y asignale una cuenta.');
    }

    const bankAccount = await this.prisma.bank_accounts.findUnique({
      where: { id: check.bank_account_id },
    });
    if (!bankAccount) {
      throw new NotFoundException('Cuenta bancaria no encontrada');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.checks.update({
        where: { id },
        data: {
          status: 'CLEARED',
          clearing_date: new Date(),
          updated_at: new Date(),
          updated_by: userId,
        },
      });

      await this.bankMovements.addMovement(
        {
          bankAccountId: check.bank_account_id!,
          type: 'COLLECTION',
          nature: 'CREDIT',
          amount: Number(check.amount),
          currencyCode: check.currency_code,
          exchangeRate: check.exchange_rate ? Number(check.exchange_rate) : null,
          rateType: check.rate_type ?? null,
          convertedAmount: check.converted_amount ? Number(check.converted_amount) : null,
          description: `Cheque #${check.check_number} acreditado`,
          referenceType: 'check',
          referenceId: check.id,
          paymentId: check.payment_id,
          date: new Date(),
          userId,
        },
        tx,
      );
    });

    return this.findOne(id);
  }

  async deposit(id: string, dto: { bank_account_id: string; amount?: number; date?: string }, userId: string) {
    const check = await this.findOne(id);
    if (check.is_own) {
      throw new BadRequestException('Los cheques propios se debitan manualmente desde la cuenta asociada');
    }
    if (!['PENDING', 'CONFIRMED'].includes(check.status)) {
      throw new BadRequestException('Solo se pueden depositar cheques pendientes o confirmados');
    }

    const bankAccount = await this.prisma.bank_accounts.findUnique({
      where: { id: dto.bank_account_id },
    });
    if (!bankAccount) {
      throw new NotFoundException('Cuenta bancaria destino no encontrada');
    }

    const depositAmount = Number(check.available_amount ?? check.amount);
    const effectiveDate = dto.date ? parseLocalDateTime(dto.date) : new Date();

    await this.prisma.$transaction(async (tx) => {
      await tx.checks.update({
        where: { id },
        data: {
          status: 'CLEARED',
          available_amount: 0,
          bank_account_id: dto.bank_account_id,
          deposit_date: effectiveDate,
          clearing_date: effectiveDate,
          updated_at: new Date(),
          updated_by: userId,
        },
      });

      await this.bankMovements.addMovement(
        {
          bankAccountId: dto.bank_account_id,
          type: 'COLLECTION',
          nature: 'CREDIT',
          amount: depositAmount,
          currencyCode: check.currency_code,
          exchangeRate: check.exchange_rate ? Number(check.exchange_rate) : null,
          rateType: check.rate_type ?? null,
          convertedAmount: check.converted_amount ? Number(check.converted_amount) : null,
          description: `Cheque #${check.check_number} depositado`,
          referenceType: 'check',
          referenceId: check.id,
          paymentId: check.payment_id,
          date: effectiveDate,
          userId,
        },
        tx,
      );
    });

    return this.findOne(id);
  }

  async collectInCashBox(id: string, cashBoxId: string, userId: string, date?: string) {
    const check = await this.findOne(id);
    if (check.is_own) {
      throw new BadRequestException('Los cheques propios se debitan desde su cuenta bancaria');
    }
    if (!['PENDING', 'CONFIRMED'].includes(check.status)) {
      throw new BadRequestException('Solo se pueden cobrar cheques pendientes o confirmados');
    }

    const cashBox = await this.prisma.cash_boxes.findFirst({
      where: { id: cashBoxId, active: true, deleted_at: null },
      select: {
        id: true,
        currency_code: true,
        current_session_id: true,
        status: true,
        current_session: { select: { status: true } },
      },
    });
    if (!cashBox) throw new NotFoundException('Caja no encontrada o inactiva');
    if (cashBox.status !== 'OPEN' || !cashBox.current_session_id || cashBox.current_session?.status !== 'OPEN') {
      throw new BadRequestException('La caja debe tener una sesión abierta');
    }
    if (cashBox.currency_code !== check.currency_code) {
      throw new BadRequestException('La moneda del cheque no coincide con la moneda de la caja');
    }

    const amount = Number(check.available_amount ?? check.amount);
    const effectiveDate = date ? parseLocalDateTime(date) : new Date();
    await this.prisma.$transaction(async (tx) => {
      const balance = await tx.cash_box_balances.findUnique({
        where: { cash_box_id_currency_code: { cash_box_id: cashBox.id, currency_code: check.currency_code } },
      });
      const before = Number(balance?.balance ?? 0);
      await tx.cash_box_movements.create({
        data: {
          cash_box_id: cashBox.id,
          session_id: cashBox.current_session_id,
          type: 'COLLECTION',
          amount,
          currency_code: check.currency_code,
          exchange_rate: check.exchange_rate,
          rate_type: check.rate_type,
          converted_amount: check.converted_amount,
          balance_before: before,
          balance_after: before + amount,
          description: `Cobro por caja del cheque #${check.check_number}`,
          reference_type: 'check_cash_collection',
          reference_id: check.id,
          payment_id: check.payment_id,
          date: effectiveDate,
          created_by: userId,
        },
      });
      if (balance) {
        await tx.cash_box_balances.update({
          where: { id: balance.id },
          data: { balance: before + amount, updated_at: new Date() },
        });
      } else {
        await tx.cash_box_balances.create({
          data: { cash_box_id: cashBox.id, currency_code: check.currency_code, balance: amount, created_by: userId },
        });
      }
      await tx.cash_box_sessions.update({
        where: { id: cashBox.current_session_id! },
        data: { total_income: { increment: amount }, movement_count: { increment: 1 } },
      });
      await tx.checks.update({
        where: { id: check.id },
        data: {
          status: 'CLEARED',
          available_amount: 0,
          clearing_date: effectiveDate,
          updated_at: new Date(),
          updated_by: userId,
        },
      });
    }, { isolationLevel: 'Serializable' });

    return this.findOne(id);
  }

  async revert(id: string, userId: string) {
    const check = await this.findOne(id);
    if (check.status !== 'CLEARED') {
      throw new BadRequestException('Solo se pueden revertir cheques cobrados o debitados');
    }

    const cashMovement = await this.prisma.cash_box_movements.findFirst({
      where: {
        reference_id: check.id,
        reference_type: { in: ['check_cash_collection', 'check_cash_payment'] },
        deleted_at: null,
      },
      orderBy: { created_at: 'desc' },
    });
    const bankMovement = await this.prisma.bank_account_movements.findFirst({
      where: {
        reference_type: 'check',
        reference_id: check.id,
        deleted_at: null,
      },
      orderBy: { created_at: 'desc' },
    });
    if (!cashMovement && !bankMovement) {
      throw new BadRequestException('No se encontró el movimiento financiero original del cheque');
    }

    const revertAmount = Math.abs(Number(cashMovement?.amount ?? bankMovement?.amount ?? check.amount));

    await this.prisma.$transaction(async (tx) => {
      if (cashMovement) {
        const priorCashReversal = await tx.cash_box_movements.findFirst({
          where: { reference_type: 'check_cash_reversal', reference_id: cashMovement.id, deleted_at: null },
          select: { id: true },
        });
        if (priorCashReversal) throw new BadRequestException('El movimiento de caja ya fue revertido');

        const box = await tx.cash_boxes.findFirst({
          where: { id: cashMovement.cash_box_id, active: true, deleted_at: null },
          include: { current_session: true },
        });
        if (!box || box.status !== 'OPEN' || !box.current_session_id || box.current_session?.status !== 'OPEN') {
          throw new BadRequestException('La caja de origen debe tener una sesión abierta para revertir el cheque');
        }
        const balance = await tx.cash_box_balances.findUnique({
          where: {
            cash_box_id_currency_code: {
              cash_box_id: cashMovement.cash_box_id,
              currency_code: cashMovement.currency_code,
            },
          },
        });
        const before = Number(balance?.balance ?? 0);
        const originalDelta = Number(cashMovement.balance_after) - Number(cashMovement.balance_before);
        const reversalDelta = -originalDelta;
        const after = Number((before + reversalDelta).toFixed(2));
        if (after < 0) throw new BadRequestException('El saldo actual de la caja no alcanza para revertir el cobro');
        const reversalType = reversalDelta < 0 ? 'DEBIT' : 'CREDIT';

        await tx.cash_box_movements.create({
          data: {
            cash_box_id: cashMovement.cash_box_id,
            session_id: box.current_session_id,
            type: reversalType,
            amount: Math.abs(reversalDelta),
            currency_code: cashMovement.currency_code,
            balance_before: before,
            balance_after: after,
            description: `Reversión del cheque #${check.check_number}`,
            reference_type: 'check_cash_reversal',
            reference_id: cashMovement.id,
            bank_account_id: cashMovement.bank_account_id,
            payment_id: cashMovement.payment_id,
            date: new Date(),
            created_by: userId,
          },
        });
        await tx.cash_box_balances.upsert({
          where: {
            cash_box_id_currency_code: {
              cash_box_id: cashMovement.cash_box_id,
              currency_code: cashMovement.currency_code,
            },
          },
          create: {
            cash_box_id: cashMovement.cash_box_id,
            currency_code: cashMovement.currency_code,
            balance: after,
            created_by: userId,
          },
          update: { balance: after, updated_at: new Date(), updated_by: userId },
        });
        await tx.cash_box_sessions.update({
          where: { id: box.current_session_id },
          data: {
            movement_count: { increment: 1 },
            ...(reversalType === 'DEBIT'
              ? { total_expenses: { increment: Math.abs(reversalDelta) } }
              : { total_income: { increment: Math.abs(reversalDelta) } }),
          },
        });
      }

      if (bankMovement) {
        if (!check.bank_account_id) throw new BadRequestException('El cheque no tiene cuenta bancaria asociada');
        const priorBankReversal = await tx.bank_account_movements.findFirst({
          where: { reference_type: 'check_reversal', reference_id: check.id, deleted_at: null },
          select: { id: true },
        });
        if (priorBankReversal) throw new BadRequestException('El movimiento bancario ya fue revertido');

        const operation = await this.bankMovements.openOperation({
          bankAccountId: check.bank_account_id,
          operationType: 'CHECK',
          sourceType: 'check_reversal',
          sourceId: check.id,
          currencyCode: check.currency_code,
          description: `Reversión cheque #${check.check_number}`,
          userId,
        }, tx);
        await this.bankMovements.addMovement({
          bankAccountId: check.bank_account_id,
          operationId: operation.id,
          type: 'ADJUSTMENT',
          nature: Number(bankMovement.amount) < 0 ? 'CREDIT' : 'DEBIT',
          amount: -Number(bankMovement.amount),
          currencyCode: check.currency_code,
          description: `Reversión cheque #${check.check_number}`,
          referenceType: 'check_reversal',
          referenceId: check.id,
          date: new Date(),
          userId,
          recalculate: false,
        }, tx);

        const fundingMovement = await tx.bank_account_movements.findFirst({
          where: { reference_type: 'check_cash_funding', reference_id: check.id, deleted_at: null },
        });
        if (fundingMovement) {
          await this.bankMovements.addMovement({
            bankAccountId: check.bank_account_id,
            operationId: operation.id,
            type: 'ADJUSTMENT',
            nature: 'DEBIT',
            amount: -Number(fundingMovement.amount),
            currencyCode: check.currency_code,
            description: `Reversión depósito de caja para cheque #${check.check_number}`,
            referenceType: 'check_cash_funding_reversal',
            referenceId: check.id,
            date: new Date(),
            userId,
            recalculate: false,
          }, tx);
        }
        await this.bankMovements.closeOperation(operation.id, tx);
        await recalculateBankAccountLedger(tx, check.bank_account_id);
      }

      await tx.checks.update({
        where: { id },
        data: {
          status: check.is_own ? 'CONFIRMED' : 'PENDING',
          available_amount: revertAmount,
          deposit_date: null,
          clearing_date: null,
          payment_date: null,
          updated_at: new Date(),
          updated_by: userId,
        },
      });
    }, { isolationLevel: 'Serializable' });

    return this.findOne(id);
  }

  async bounce(id: string, userId: string) {
    await this.prisma.checks.update({
      where: { id },
      data: {
        status: 'BOUNCED',
        updated_at: new Date(),
        updated_by: userId,
      },
    });

    return this.findOne(id);
  }

  async confirm(id: string) {
    const check = await this.findOne(id);
    if (!check.is_own) {
      throw new BadRequestException('Los cheques de terceros no se confirman manualmente; se depositan, cobran o aplican a un pago');
    }
    throw new BadRequestException('El cheque propio se confirma automáticamente al confirmar el pago asociado');
  }

  async debitOwnCheck(id: string, debitDate: string, userId: string) {
    const check = await this.findOne(id);
    if (!check.is_own || check.status !== 'CONFIRMED') {
      throw new BadRequestException('Solo se pueden debitar cheques propios confirmados');
    }
    if (!check.bank_account_id) throw new BadRequestException('El cheque no tiene cuenta bancaria asociada');

    const effectiveDate = parseLocalDateTime(debitDate);
    if (effectiveDate < new Date(check.due_date)) {
      throw new BadRequestException('La fecha efectiva del débito no puede ser anterior al vencimiento del cheque');
    }
    if (effectiveDate > new Date()) {
      throw new BadRequestException('No se puede registrar un débito bancario con fecha futura');
    }
    const amount = Number(check.amount);
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.bank_account_movements.findFirst({
        where: { reference_type: 'check', reference_id: check.id, deleted_at: null },
        select: { id: true },
      });
      if (existing) throw new BadRequestException('El cheque ya tiene un débito bancario registrado');

      const account = await tx.bank_accounts.findUnique({ where: { id: check.bank_account_id! } });
      if (!account?.active) throw new BadRequestException('La cuenta bancaria está inactiva o no existe');
      if (account.currency_code !== check.currency_code) {
        throw new BadRequestException('La moneda del cheque no coincide con la cuenta bancaria');
      }
      const before = Number(account.balance);
      if (before < amount) throw new BadRequestException('Saldo insuficiente para registrar el débito');

      await this.bankMovements.addMovement(
        {
          bankAccountId: check.bank_account_id!,
          type: 'CHECK_ISSUED',
          nature: 'DEBIT',
          amount: -amount,
          currencyCode: check.currency_code,
          exchangeRate: check.exchange_rate ? Number(check.exchange_rate) : null,
          rateType: check.rate_type ?? null,
          convertedAmount: check.converted_amount ? Number(check.converted_amount) : null,
          description: `Débito cheque propio #${check.check_number}`,
          referenceType: 'check',
          referenceId: check.id,
          paymentId: check.payment_id,
          date: effectiveDate,
          userId,
        },
        tx,
      );
      await tx.checks.update({
        where: { id },
        data: {
          status: 'CLEARED', payment_date: effectiveDate, clearing_date: effectiveDate,
          updated_at: new Date(), updated_by: userId,
        },
      });
    });
    return this.findOne(id);
  }

  async settleOwnCheckFromCashBox(id: string, cashBoxId: string, date: string, userId: string) {
    const check = await this.findOne(id);
    if (!check.is_own || check.status !== 'CONFIRMED') {
      throw new BadRequestException('Solo se pueden pagar desde caja cheques propios confirmados');
    }
    if (!check.bank_account_id) {
      throw new BadRequestException('El cheque propio no tiene una cuenta bancaria asociada');
    }

    const effectiveDate = parseLocalDateTime(date);
    if (effectiveDate < new Date(check.due_date)) {
      throw new BadRequestException('La fecha efectiva no puede ser anterior al vencimiento del cheque');
    }
    if (effectiveDate > new Date()) {
      throw new BadRequestException('No se puede registrar el pago con una fecha futura');
    }

    const amount = Number(check.amount);
    await this.prisma.$transaction(async (tx) => {
      const existingCashMovement = await tx.cash_box_movements.findFirst({
        where: { reference_type: 'check_cash_payment', reference_id: check.id, deleted_at: null },
        select: { id: true },
      });
      const existingBankMovement = await tx.bank_account_movements.findFirst({
        where: { reference_type: 'check', reference_id: check.id, deleted_at: null },
        select: { id: true },
      });
      if (existingCashMovement || existingBankMovement) {
        throw new BadRequestException('El cheque ya tiene un pago registrado');
      }

      const cashBox = await tx.cash_boxes.findFirst({
        where: { id: cashBoxId, active: true, deleted_at: null },
        include: { current_session: true },
      });
      if (!cashBox) throw new NotFoundException('Caja no encontrada o inactiva');
      if (cashBox.status !== 'OPEN' || !cashBox.current_session_id || cashBox.current_session?.status !== 'OPEN') {
        throw new BadRequestException('La caja debe tener una sesión abierta');
      }
      if (cashBox.currency_code !== check.currency_code) {
        throw new BadRequestException('La moneda del cheque no coincide con la moneda de la caja');
      }

      const balance = await tx.cash_box_balances.findUnique({
        where: { cash_box_id_currency_code: { cash_box_id: cashBoxId, currency_code: check.currency_code } },
      });
      const balanceBefore = Number(balance?.balance ?? 0);
      if (balanceBefore < amount) {
        throw new BadRequestException(`Saldo insuficiente en caja. Disponible: ${balanceBefore.toFixed(2)}`);
      }
      const balanceAfter = Number((balanceBefore - amount).toFixed(2));

      const operation = await this.bankMovements.openOperation({
        bankAccountId: check.bank_account_id!,
        operationType: 'CASH_TRANSFER',
        sourceType: 'check_cash_settlement',
        sourceId: check.id,
        date: effectiveDate,
        currencyCode: check.currency_code,
        description: `Depósito desde caja y pago del cheque #${check.check_number}`,
        userId,
      }, tx);

      await tx.cash_box_movements.create({
        data: {
          cash_box_id: cashBoxId,
          session_id: cashBox.current_session_id,
          type: 'DEBIT',
          amount,
          currency_code: check.currency_code,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          description: `Efectivo depositado para pagar cheque propio #${check.check_number}`,
          reference_type: 'check_cash_payment',
          reference_id: check.id,
          bank_account_id: check.bank_account_id,
          payment_id: check.payment_id,
          date: effectiveDate,
          created_by: userId,
        },
      });
      await tx.cash_box_balances.update({
        where: { id: balance!.id },
        data: { balance: balanceAfter, updated_at: new Date(), updated_by: userId },
      });
      await tx.cash_box_sessions.update({
        where: { id: cashBox.current_session_id },
        data: { total_expenses: { increment: amount }, movement_count: { increment: 1 } },
      });

      await this.bankMovements.addMovement({
        bankAccountId: check.bank_account_id!,
        operationId: operation.id,
        type: 'DEPOSIT',
        nature: 'CREDIT',
        amount,
        currencyCode: check.currency_code,
        description: `Depósito de efectivo desde ${cashBox.name}`,
        referenceType: 'check_cash_funding',
        referenceId: check.id,
        date: effectiveDate,
        userId,
        recalculate: false,
      }, tx);
      await this.bankMovements.addMovement({
        bankAccountId: check.bank_account_id!,
        operationId: operation.id,
        type: 'CHECK_ISSUED',
        nature: 'DEBIT',
        amount: -amount,
        currencyCode: check.currency_code,
        description: `Débito cheque propio #${check.check_number}`,
        referenceType: 'check',
        referenceId: check.id,
        paymentId: check.payment_id,
        date: effectiveDate,
        userId,
        recalculate: false,
      }, tx);
      await this.bankMovements.closeOperation(operation.id, tx);
      await recalculateBankAccountLedger(tx, check.bank_account_id!);

      await tx.checks.update({
        where: { id: check.id },
        data: {
          status: 'CLEARED',
          payment_date: effectiveDate,
          clearing_date: effectiveDate,
          updated_at: new Date(),
          updated_by: userId,
        },
      });
    }, { isolationLevel: 'Serializable' });

    return this.findOne(id);
  }

  async reject(id: string, userId: string) {
    const check = await this.findOne(id);
    if (!check.is_own) {
      throw new BadRequestException('Solo se pueden rechazar cheques propios');
    }

    await this.prisma.checks.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updated_at: new Date(),
        updated_by: userId,
      },
    });

    return this.findOne(id);
  }

  async findUpcoming(days: number = 7) {
    const today = this.argentinaDateStart();
    const futureDate = new Date(today);
    futureDate.setUTCDate(futureDate.getUTCDate() + days);

    return this.prisma.checks.findMany({
      where: {
        deleted_at: null,
        status: { in: ['PENDING', 'CONFIRMED'] },
        due_date: { gte: today, lte: futureDate },
      },
      orderBy: { due_date: 'asc' },
    });
  }

  async findPendingNotification() {
    const today = this.argentinaDateStart();

    return this.prisma.checks.findMany({
      where: {
        deleted_at: null,
        status: { in: ['PENDING', 'CONFIRMED'] },
        due_date: { lte: today },
      },
    });
  }

  async findNotificationAlerts(userId: string, upcomingDays = 30) {
    const today = this.argentinaDateStart();
    const upcomingLimit = new Date(today);
    upcomingLimit.setUTCDate(upcomingLimit.getUTCDate() + Math.max(1, Math.min(365, upcomingDays)));
    const existingCheckNotifications = await this.prisma.user_notifications.findMany({
      where: {
        recipient_user_id: userId,
        dismissed_until: null,
        type: { in: ['CHECK_DUE', 'CHECK_OVERDUE'] },
        target_id: { not: null },
      },
      select: { type: true, target_id: true },
      take: 500,
    });
    const upcomingNotifiedIds = existingCheckNotifications
      .filter(notification => notification.type === 'CHECK_DUE' && notification.target_id)
      .map(notification => notification.target_id as string);
    const overdueNotifiedIds = existingCheckNotifications
      .filter(notification => notification.type === 'CHECK_OVERDUE' && notification.target_id)
      .map(notification => notification.target_id as string);
    const thirdPartyWhere: Record<string, any> = {
      deleted_at: null,
      is_own: false,
      status: { in: ['PENDING', 'CONFIRMED'] },
      due_date: { lte: today },
      ...(overdueNotifiedIds.length ? { id: { notIn: overdueNotifiedIds } } : {}),
    };
    const ownWhere: Record<string, any> = {
      deleted_at: null,
      is_own: true,
      status: 'CONFIRMED' as const,
      due_date: { lte: today },
      ...(overdueNotifiedIds.length ? { id: { notIn: overdueNotifiedIds } } : {}),
    };
    const upcomingWhere: Record<string, any> = {
      deleted_at: null,
      status: { in: ['PENDING', 'CONFIRMED'] },
      due_date: { gt: today, lte: upcomingLimit },
      ...(upcomingNotifiedIds.length ? { id: { notIn: upcomingNotifiedIds } } : {}),
    };

    const preview = (where: Record<string, any>) => this.prisma.checks.findMany({
      where,
      select: { id: true, check_number: true, bank_name: true, due_date: true, is_own: true },
      orderBy: { due_date: 'asc' },
      take: 5,
    });

    const [thirdPartyCount, thirdPartyChecks, ownCount, ownChecks, upcomingCount, upcomingChecks] =
      await Promise.all([
        this.prisma.checks.count({ where: thirdPartyWhere }),
        preview(thirdPartyWhere),
        this.prisma.checks.count({ where: ownWhere }),
        preview(ownWhere),
        this.prisma.checks.count({ where: upcomingWhere }),
        preview(upcomingWhere),
      ]);

    return {
      third_party: { count: thirdPartyCount, checks: thirdPartyChecks },
      own: { count: ownCount, checks: ownChecks },
      upcoming: { count: upcomingCount, checks: upcomingChecks, days: upcomingDays },
    };
  }

  async markNotificationSent(id: string) {
    return this.prisma.checks.update({
      where: { id },
      data: { notification_sent: true },
    });
  }

  async remove(id: string, userId: string) {
    const check = await this.findOne(id);
    if (check.status === 'CLEARED') {
      throw new BadRequestException('No se puede eliminar un cheque ya cobrado');
    }

    return this.prisma.checks.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }
}
