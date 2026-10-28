import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { DeleteBankAccountDto } from './dto/delete-bank-account.dto';
import { CreateBankMovementDto } from './dto/create-bank-movement.dto';
import { BankMovementsService } from '../bank-movements/bank-movements.service';
import { parseLocalDateTime } from '@/common/utils/dates';
import { CreateBankChargeRuleDto, SuggestedBankChargesQueryDto, UpdateBankChargeRuleDto } from './dto/bank-charge-rule.dto';
import { BankAccountTransferDto } from './dto/bank-account-transfer.dto';
import { recalculateBankAccountLedger } from './bank-account-ledger';

@Injectable()
export class BankAccountsService {
  constructor(
    private db: PrismaService,
    private bankMovements: BankMovementsService,
  ) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateBankAccountDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const initialBalance = Number(dto.balance ?? 0);
      const account = await tx.bank_accounts.create({
        data: {
        name: dto.name,
        bank_name: dto.bank_name,
        account_type: dto.account_type,
        cbu: dto.cbu,
        alias: dto.alias,
        account_number: dto.account_number,
        currency_code: dto.currency_code,
        balance: 0,
        active: dto.active ?? true,
        created_by: userId,
        },
      });
      if (initialBalance > 0) {
        await this.bankMovements.addMovement(
          {
            bankAccountId: account.id,
            type: 'OPENING_BALANCE',
            nature: 'CREDIT',
            amount: initialBalance,
            currencyCode: account.currency_code,
            description: 'Saldo inicial de la cuenta bancaria',
            referenceType: 'bank_account_initial_balance',
            referenceId: account.id,
            date: new Date(),
            userId,
          },
          tx,
        );
      }
      return { ...account, balance: initialBalance, can_set_initial_balance: initialBalance === 0 };
    });
  }

  async findAll(userId?: string) {
    const where: Record<string, any> = { deleted_at: null };

    if (userId) {
      const userRoleIds = await this.prisma.bank_account_user_roles.findMany({
        where: { user_id: userId },
        select: { bank_account_id: true },
      });
      const allowedIds = userRoleIds.map(r => r.bank_account_id);
      where.id = { in: allowedIds };
    }

    const accounts = await this.prisma.bank_accounts.findMany({
      where,
      orderBy: { name: 'asc' },
      include: { _count: { select: { movements: true } } },
    });

    const pendingChecks = accounts.length
      ? await this.prisma.checks.groupBy({
          by: ['bank_account_id'],
          where: {
            bank_account_id: { in: accounts.map((account) => account.id) },
            status: { in: ['PENDING', 'CONFIRMED'] },
            deleted_at: null,
          },
          _count: { _all: true },
        })
      : [];
    const pendingChecksMap = new Map(
      pendingChecks.map((row) => [row.bank_account_id, row._count._all]),
    );

    return accounts.map(account => ({
      ...account,
      can_set_initial_balance: account._count.movements === 0 && Number(account.balance) === 0,
      pending_checks_count: pendingChecksMap.get(account.id) ?? 0,
    }));
  }

  async findOne(id: string) {
    const account = await this.prisma.bank_accounts.findFirst({
      where: { id, deleted_at: null },
      include: {
        movements: { orderBy: { date: 'desc' }, take: 20 },
        _count: { select: { movements: true } },
      },
    });
    if (!account) throw new NotFoundException('Cuenta bancaria no encontrada');
    const pendingChecks = await this.prisma.checks.count({
      where: { bank_account_id: id, status: { in: ['PENDING', 'CONFIRMED'] }, deleted_at: null },
    });
    return {
      ...account,
      can_set_initial_balance: account._count.movements === 0 && Number(account.balance) === 0,
      pending_checks_count: pendingChecks,
    };
  }

  async update(id: string, dto: UpdateBankAccountDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.bank_accounts.findFirst({
        where: { id, deleted_at: null },
        include: { _count: { select: { movements: true } } },
      });
      if (!account) throw new NotFoundException('Cuenta bancaria no encontrada');

      const requestedBalance = dto.balance == null ? Number(account.balance) : Number(dto.balance);
      const balanceChanged = requestedBalance !== Number(account.balance);
      const canSetInitialBalance = account._count.movements === 0 && Number(account.balance) === 0;
      if (balanceChanged && !canSetInitialBalance) {
        throw new BadRequestException('El saldo inicial no puede modificarse porque la cuenta bancaria ya comenzó a operar');
      }

      const { balance: _balance, ...editableData } = dto;
      const updated = await tx.bank_accounts.update({
        where: { id },
        data: {
          ...editableData,
          updated_at: new Date(),
          updated_by: userId,
        },
      });

      if (balanceChanged && requestedBalance > 0) {
        await this.bankMovements.addMovement(
          {
            bankAccountId: id,
            type: 'OPENING_BALANCE',
            nature: 'CREDIT',
            amount: requestedBalance,
            currencyCode: updated.currency_code,
            description: 'Saldo inicial de la cuenta bancaria',
            referenceType: 'bank_account_initial_balance',
            referenceId: id,
            date: new Date(),
            userId,
          },
          tx,
        );
      }

      return {
        ...updated,
        balance: balanceChanged ? requestedBalance : Number(updated.balance),
        can_set_initial_balance: !balanceChanged && canSetInitialBalance,
      };
    });
  }

  async remove(id: string, dto: DeleteBankAccountDto, userId: string) {
    if (dto.confirmation !== 'ELIMINAR') throw new BadRequestException('Escribí ELIMINAR para confirmar');
    const mode = dto.mode ?? 'TRANSFER';
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.bank_accounts.findFirst({ where: { id, deleted_at: null } });
      if (!account) throw new NotFoundException('Cuenta bancaria no encontrada');
      const balance = Number(account.balance);
      const pendingChecks = await tx.checks.count({
        where: { bank_account_id: id, status: { in: ['PENDING', 'CONFIRMED'] }, deleted_at: null },
      });

      const needsTarget = pendingChecks > 0 || (mode === 'TRANSFER' && balance !== 0);
      if (needsTarget && !dto.target_bank_account_id) {
        throw new BadRequestException(pendingChecks > 0
          ? 'Seleccioná una cuenta destino para reasignar los cheques pendientes'
          : 'Seleccioná una cuenta bancaria destino para transferir el saldo');
      }
      if (dto.target_bank_account_id === id) throw new BadRequestException('La cuenta destino debe ser diferente');
      const target = dto.target_bank_account_id
        ? await tx.bank_accounts.findFirst({ where: { id: dto.target_bank_account_id, active: true, deleted_at: null } })
        : null;
      if (dto.target_bank_account_id && !target) throw new BadRequestException('La cuenta bancaria destino no existe o está inactiva');
      if (target && target.currency_code !== account.currency_code) throw new BadRequestException('La cuenta destino debe usar la misma moneda');

      const now = new Date();

      if (mode === 'TRANSFER' && balance !== 0) {
        if (!target) throw new BadRequestException('Seleccioná una cuenta bancaria destino para transferir el saldo');
        await this.bankMovements.addMovement(
          {
            bankAccountId: id,
            type: 'TRANSFER',
            nature: 'DEBIT',
            amount: -balance,
            currencyCode: account.currency_code,
            description: `Transferencia por baja de ${account.name}`,
            referenceType: 'bank_account_closure',
            referenceId: id,
            date: now,
            userId,
          },
          tx,
        );
        await this.bankMovements.addMovement(
          {
            bankAccountId: target.id,
            type: 'TRANSFER',
            nature: 'CREDIT',
            amount: balance,
            currencyCode: account.currency_code,
            description: `Saldo recibido por baja de ${account.name}`,
            referenceType: 'bank_account_closure',
            referenceId: id,
            date: now,
            userId,
          },
          tx,
        );
      }

      if (mode === 'DISCARD') {
        if (balance !== 0) {
          await tx.bank_accounts.update({ where: { id }, data: { balance: 0 } });
        }
        if (dto.delete_movements) {
          await tx.bank_account_movements.updateMany({
            where: { bank_account_id: id, deleted_at: null },
            data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
          });
        }
      }

      if (target) {
        if (pendingChecks > 0) {
          await tx.checks.updateMany({
            where: { bank_account_id: id, status: { in: ['PENDING', 'CONFIRMED'] }, deleted_at: null },
            data: { bank_account_id: target.id, updated_at: now, updated_by: userId },
          });
        }
        await tx.payments.updateMany({
          where: { bank_account_id: id, deleted_at: null },
          data: { bank_account_id: target.id, updated_at: now, updated_by: userId },
        });
        await tx.cash_box_movements.updateMany({
          where: { bank_account_id: id, deleted_at: null },
          data: { bank_account_id: target.id, updated_at: now, updated_by: userId },
        });
      }

      return tx.bank_accounts.update({
        where: { id },
        data: { deleted_at: now, deleted_by: userId, active: false },
      });
    });
  }

  async getMovements(id: string) {
    await this.findOne(id);
    return this.prisma.bank_account_movements.findMany({
      where: { bank_account_id: id, deleted_at: null },
      include: {
        bank_concept: { select: { id: true, code: true, name: true, nature: true, concept_type: true } },
        operation: true,
      },
      orderBy: [{ date: 'desc' }, { created_at: 'desc' }],
    });
  }

  async getMovementDetails(accountId: string, movementId: string) {
    const movement = await this.prisma.bank_account_movements.findFirst({
      where: { id: movementId, bank_account_id: accountId, deleted_at: null },
      include: {
        bank_concept: { select: { id: true, code: true, name: true, nature: true, concept_type: true } },
        operation: true,
        charge: {
          select: {
            id: true,
            concept_name_snapshot: true,
            nature: true,
            base_amount: true,
            tax_amount: true,
            total_amount: true,
            jurisdiction: true,
            tax_code: true,
            certificate_number: true,
            period: true,
            reference: true,
          },
        },
        payment: {
          select: {
            id: true,
            number: true,
            type: true,
            payment_method: true,
            amount: true,
            currency_code: true,
            exchange_rate: true,
            status: true,
            date: true,
            payment_date: true,
            description: true,
            reference: true,
            party: { select: { id: true, name: true, tax_id: true } },
            documents: {
              where: { deleted_at: null },
              select: {
                id: true,
                amount_applied: true,
                document: {
                  select: {
                    id: true,
                    number: true,
                    date: true,
                    total: true,
                    currency_code: true,
                    document_types: { select: { code: true, description: true } },
                  },
                },
              },
            },
            checks: {
              where: { deleted_at: null },
              select: {
                id: true,
                check_number: true,
                bank_name: true,
                issuer_name: true,
                issuer_id: true,
                amount: true,
                available_amount: true,
                currency_code: true,
                issue_date: true,
                due_date: true,
                status: true,
                is_own: true,
                deposit_date: true,
                clearing_date: true,
              },
            },
            payment_allocations: {
              select: {
                amount_applied: true,
                check: {
                  select: {
                    id: true,
                    check_number: true,
                    bank_name: true,
                    issuer_name: true,
                    issuer_id: true,
                    amount: true,
                    available_amount: true,
                    currency_code: true,
                    issue_date: true,
                    due_date: true,
                    status: true,
                    is_own: true,
                    deposit_date: true,
                    clearing_date: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!movement) throw new NotFoundException('Movimiento bancario no encontrado');
    const linkedCheck = movement.reference_type === 'check' && movement.reference_id
      ? await this.prisma.checks.findFirst({
          where: { id: movement.reference_id, deleted_at: null },
          select: {
            id: true,
            check_number: true,
            bank_name: true,
            issuer_name: true,
            issuer_id: true,
            amount: true,
            available_amount: true,
            currency_code: true,
            issue_date: true,
            due_date: true,
            status: true,
            is_own: true,
            deposit_date: true,
            clearing_date: true,
          },
        })
      : null;
    return { ...movement, linked_check: linkedCheck };
  }

  // ═══════════════════════════════════════════
  // MOVIMIENTO MANUAL
  // ═══════════════════════════════════════════

  async createMovement(accountId: string, dto: CreateBankMovementDto, userId: string) {
    const account = await this.prisma.bank_accounts.findFirst({
      where: { id: accountId, deleted_at: null, active: true },
    });
    if (!account) throw new NotFoundException('Cuenta bancaria no encontrada o inactiva');

    const concept = await this.prisma.bank_concepts.findFirst({
      where: { id: dto.bank_concept_id, deleted_at: null },
    });
    if (!concept) throw new NotFoundException('Concepto bancario no encontrado');
    if (!concept.is_active) throw new BadRequestException('El concepto bancario está inactivo');
    if (!concept.available_manual) {
      throw new BadRequestException('El concepto no está disponible para carga manual');
    }
    if (concept.requires_receipt && !dto.attachment_file_id) {
      throw new BadRequestException('El concepto requiere comprobante adjunto');
    }

    const currencyCode = dto.currency_code ?? account.currency_code;
    const signedAmount = dto.nature === 'DEBIT' ? -Math.abs(dto.amount) : Math.abs(dto.amount);

    return this.prisma.$transaction(async (tx) => {
      const operation = await this.bankMovements.openOperation(
        {
          bankAccountId: accountId,
          operationType: 'MANUAL',
          sourceType: 'manual',
          currencyCode,
          date: dto.date ? parseLocalDateTime(dto.date) : new Date(),
          description: dto.description ?? concept.name,
          reference: dto.reference ?? null,
          userId,
        },
        tx,
      );

      const movement = await this.bankMovements.addMovement(
        {
          bankAccountId: accountId,
          conceptId: concept.id,
          type: this.mapConceptToMovementType(concept.concept_type, dto.nature),
          nature: dto.nature,
          amount: signedAmount,
          baseAmount: dto.base_amount ?? null,
          taxAmount: dto.tax_amount ?? null,
          totalAmount: dto.total_amount ?? null,
          currencyCode,
          exchangeRate: dto.exchange_rate ?? null,
          rateType: dto.rate_type ?? null,
          description: dto.description ?? concept.name,
          reference: dto.reference ?? null,
          referenceType: 'bank_manual_movement',
          attachmentFileId: dto.attachment_file_id ?? null,
          documentDate: dto.document_date ? parseLocalDateTime(dto.document_date) : null,
          effectiveDate: dto.effective_date ? parseLocalDateTime(dto.effective_date) : null,
          date: dto.date ? parseLocalDateTime(dto.date) : new Date(),
          operationId: operation.id,
          userId,
        },
        tx,
      );

      const closed = await this.bankMovements.closeOperation(operation.id, tx);
      return { ...movement, operation: closed };
    });
  }

  async transfer(sourceId: string, dto: BankAccountTransferDto, userId: string, companyRole?: string) {
    const amount = Math.round((Number(dto.amount) + Number.EPSILON) * 100) / 100;
    if (!Number.isFinite(amount) || amount <= 0) throw new BadRequestException('El importe debe ser mayor que cero');
    if (sourceId === dto.destination_bank_account_id) throw new BadRequestException('Elegí una cuenta de destino distinta');

    const accountIds = [sourceId, dto.destination_bank_account_id];
    const accounts = await this.prisma.bank_accounts.findMany({
      where: { id: { in: accountIds }, deleted_at: null, active: true },
    });
    if (accounts.length !== 2) throw new NotFoundException('La cuenta de origen o destino no está disponible');
    const source = accounts.find((account: any) => account.id === sourceId);
    const destination = accounts.find((account: any) => account.id === dto.destination_bank_account_id);
    if (!source || !destination) throw new NotFoundException('La cuenta de origen o destino no está disponible');
    if (source.currency_code !== destination.currency_code) throw new BadRequestException('Las transferencias internas requieren cuentas en la misma moneda');
    if (companyRole !== 'OWNER' && companyRole !== 'ADMIN') {
      const roles = await this.prisma.bank_account_user_roles.findMany({
        where: { bank_account_id: { in: accountIds }, user_id: userId, deleted_at: null },
      });
      const writableIds = new Set(roles.filter((role: any) => role.role !== 'VIEWER').map((role: any) => role.bank_account_id));
      if (accountIds.some(id => !writableIds.has(id))) {
        throw new BadRequestException('Necesitás permisos de operación sobre las cuentas de origen y destino');
      }
    }

    const date = parseLocalDateTime(dto.date);
    const transfer = await this.prisma.$transaction(async (tx: any) => {
      // Bloquea ambas cuentas en orden estable para evitar sobregiros por transferencias concurrentes.
      for (const id of [...accountIds].sort()) {
        await tx.$queryRaw`SELECT id FROM tenant.bank_accounts WHERE id = ${id}::uuid FOR UPDATE`;
      }
      const lockedAccounts = await tx.bank_accounts.findMany({
        where: { id: { in: accountIds }, deleted_at: null, active: true },
      });
      const lockedSource = lockedAccounts.find((account: any) => account.id === sourceId);
      const lockedDestination = lockedAccounts.find((account: any) => account.id === dto.destination_bank_account_id);
      if (!lockedSource || !lockedDestination) throw new NotFoundException('La cuenta de origen o destino ya no está disponible');
      if (Number(lockedSource.balance) < amount) throw new BadRequestException('El saldo disponible no alcanza para transferir ese importe');

      const record = await tx.bank_account_transfers.create({
        data: {
          source_bank_account_id: sourceId,
          destination_bank_account_id: dto.destination_bank_account_id,
          date,
          amount,
          currency_code: source.currency_code,
          reference: dto.reference?.trim() || null,
          notes: dto.notes?.trim() || null,
          created_by: userId,
        },
      });
      const label = `Transferencia interna ${source.name} → ${destination.name}`;
      const operationSource = await this.bankMovements.openOperation({
        bankAccountId: sourceId,
        operationType: 'ACCOUNT_TRANSFER',
        sourceType: 'bank_account_transfer',
        sourceId: record.id,
        currencyCode: source.currency_code,
        date,
        description: label,
        reference: dto.reference ?? null,
        userId,
      }, tx);
      const operationDestination = await this.bankMovements.openOperation({
        bankAccountId: dto.destination_bank_account_id,
        operationType: 'ACCOUNT_TRANSFER',
        sourceType: 'bank_account_transfer',
        sourceId: record.id,
        currencyCode: source.currency_code,
        date,
        description: label,
        reference: dto.reference ?? null,
        userId,
      }, tx);

      await this.bankMovements.addMovement({
        bankAccountId: sourceId,
        type: 'TRANSFER',
        nature: 'DEBIT',
        amount: -amount,
        currencyCode: source.currency_code,
        description: `Transferencia a ${destination.name}`,
        reference: dto.reference ?? null,
        referenceType: 'bank_account_transfer',
        referenceId: record.id,
        date,
        operationId: operationSource.id,
        userId,
        recalculate: false,
      }, tx);
      await this.bankMovements.addMovement({
        bankAccountId: dto.destination_bank_account_id,
        type: 'TRANSFER',
        nature: 'CREDIT',
        amount,
        currencyCode: source.currency_code,
        description: `Transferencia desde ${source.name}`,
        reference: dto.reference ?? null,
        referenceType: 'bank_account_transfer',
        referenceId: record.id,
        date,
        operationId: operationDestination.id,
        userId,
        recalculate: false,
      }, tx);
      await this.bankMovements.closeOperation(operationSource.id, tx);
      await this.bankMovements.closeOperation(operationDestination.id, tx);
      await recalculateBankAccountLedger(tx, sourceId);
      await recalculateBankAccountLedger(tx, dto.destination_bank_account_id);
      return tx.bank_account_transfers.findUnique({
        where: { id: record.id },
        include: { source_account: true, destination_account: true },
      });
    }, { timeout: 15000 });
    return transfer;
  }

  async cancelMovement(accountId: string, movementId: string, userId: string) {
    const movement = await this.prisma.bank_account_movements.findFirst({
      where: { id: movementId, bank_account_id: accountId, deleted_at: null },
    });
    if (!movement) throw new NotFoundException('Movimiento bancario no encontrado');
    if (movement.reference_type === 'bank_account_transfer') {
      throw new BadRequestException('Este movimiento pertenece a una transferencia interna; no se puede anular por separado');
    }
    return this.bankMovements.cancelMovement(movementId, userId, this.prisma);
  }

  private mapConceptToMovementType(
    conceptType: string,
    nature: 'DEBIT' | 'CREDIT',
  ): 'FEE' | 'INTEREST' | 'TAX' | 'RETENTION' | 'ADJUSTMENT' | 'DEPOSIT' | 'WITHDRAWAL' {
    if (conceptType === 'RETENTION') return 'RETENTION';
    if (conceptType === 'TAX') return 'TAX';
    if (conceptType === 'INTEREST') return 'INTEREST';
    if (conceptType === 'COMMISSION' || conceptType === 'EXPENSE') return 'FEE';
    if (conceptType === 'ADJUSTMENT') return 'ADJUSTMENT';
    return nature === 'DEBIT' ? 'WITHDRAWAL' : 'DEPOSIT';
  }

  async getChargeRules(bankAccountId: string) {
    await this.findOne(bankAccountId);
    return this.prisma.bank_charge_rules.findMany({
      where: { bank_account_id: bankAccountId, deleted_at: null },
      include: { bank_concept: true },
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
    });
  }

  async createChargeRule(bankAccountId: string, dto: CreateBankChargeRuleDto, userId: string) {
    await this.validateChargeRule(bankAccountId, dto);
    return this.prisma.bank_charge_rules.create({
      data: {
        ...this.mapChargeRuleData(dto), bank_account_id: bankAccountId, created_by: userId,
      },
      include: { bank_concept: true },
    });
  }

  async updateChargeRule(bankAccountId: string, ruleId: string, dto: UpdateBankChargeRuleDto, userId: string) {
    const rule = await this.prisma.bank_charge_rules.findFirst({ where: { id: ruleId, bank_account_id: bankAccountId, deleted_at: null } });
    if (!rule) throw new NotFoundException('Regla de comisión bancaria no encontrada');
    await this.validateChargeRule(bankAccountId, dto);
    return this.prisma.bank_charge_rules.update({
      where: { id: ruleId },
      data: { ...this.mapChargeRuleData(dto), updated_by: userId },
      include: { bank_concept: true },
    });
  }

  async removeChargeRule(bankAccountId: string, ruleId: string, userId: string) {
    const rule = await this.prisma.bank_charge_rules.findFirst({ where: { id: ruleId, bank_account_id: bankAccountId, deleted_at: null } });
    if (!rule) throw new NotFoundException('Regla de comisión bancaria no encontrada');
    return this.prisma.bank_charge_rules.update({
      where: { id: ruleId }, data: { active: false, deleted_at: new Date(), deleted_by: userId },
    });
  }

  async getSuggestedCharges(bankAccountId: string, query: SuggestedBankChargesQueryDto) {
    const account = await this.findOne(bankAccountId);
    const date = query.date ? parseLocalDateTime(query.date) : new Date();
    const amount = Number(query.amount || 0);
    const currency = query.currency_code || account.currency_code;
    const rules = await this.prisma.bank_charge_rules.findMany({
      where: {
        bank_account_id: bankAccountId, trigger: query.trigger as any, active: true, deleted_at: null,
        OR: [{ currency_code: null }, { currency_code: currency }],
        AND: [
          { OR: [{ valid_from: null }, { valid_from: { lte: date } }] },
          { OR: [{ valid_until: null }, { valid_until: { gte: date } }] },
        ],
      },
      include: { bank_concept: true },
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
    });
    return rules.map((rule) => {
      const fixed = Number(rule.fixed_amount || 0);
      const percentage = Number(rule.percentage || 0);
      let baseCharge = rule.calculation_type === 'FIXED' ? fixed : amount * percentage / 100;
      if (rule.calculation_type === 'FIXED_PLUS_PERCENTAGE') baseCharge += fixed;
      if (rule.minimum_amount != null) baseCharge = Math.max(baseCharge, Number(rule.minimum_amount));
      if (rule.maximum_amount != null) baseCharge = Math.min(baseCharge, Number(rule.maximum_amount));
      baseCharge = Math.round(baseCharge * 100) / 100;
      const taxAmount = rule.bank_concept.calculates_iva
        ? Math.round(baseCharge * Number(rule.bank_concept.iva_rate || 0) / 100 * 100) / 100
        : 0;
      return {
        rule_id: rule.id, rule_name: rule.name, editable: rule.editable,
        bank_concept_id: rule.bank_concept_id,
        concept_code: rule.bank_concept.code, concept_name: rule.bank_concept.name,
        nature: rule.bank_concept.nature, base_amount: baseCharge,
        percentage: rule.calculation_type === 'FIXED' ? null : percentage,
        charge_amount: baseCharge, tax_amount: taxAmount,
        total_amount: Math.round((baseCharge + taxAmount) * 100) / 100,
      };
    });
  }

  private async validateChargeRule(bankAccountId: string, dto: CreateBankChargeRuleDto) {
    await this.findOne(bankAccountId);
    const concept = await this.prisma.bank_concepts.findFirst({ where: { id: dto.bank_concept_id, deleted_at: null, is_active: true } });
    if (!concept) throw new BadRequestException('El concepto bancario no existe o está inactivo');
    if (dto.calculation_type !== 'FIXED' && dto.percentage == null) throw new BadRequestException('Ingresá el porcentaje de la regla');
    if (dto.valid_from && dto.valid_until && new Date(dto.valid_until) < new Date(dto.valid_from)) throw new BadRequestException('La vigencia hasta debe ser posterior a la vigencia desde');
    if (dto.minimum_amount != null && dto.maximum_amount != null && dto.maximum_amount < dto.minimum_amount) throw new BadRequestException('El máximo no puede ser menor que el mínimo');
  }

  private mapChargeRuleData(dto: CreateBankChargeRuleDto) {
    return {
      bank_concept_id: dto.bank_concept_id, name: dto.name, trigger: dto.trigger as any,
      calculation_type: dto.calculation_type as any, fixed_amount: dto.fixed_amount ?? 0,
      percentage: dto.percentage ?? null, minimum_amount: dto.minimum_amount ?? null,
      maximum_amount: dto.maximum_amount ?? null, currency_code: dto.currency_code || null,
      valid_from: dto.valid_from ? parseLocalDateTime(dto.valid_from) : null,
      valid_until: dto.valid_until ? parseLocalDateTime(dto.valid_until) : null,
      priority: dto.priority ?? 0, editable: dto.editable ?? true, active: dto.active ?? true,
    };
  }

  // ═══════════════════════════════════════════
  // USER ROLES
  // ═══════════════════════════════════════════

  async getUserRoles(bankAccountId: string) {
    await this.findOne(bankAccountId);
    return this.prisma.bank_account_user_roles.findMany({
      where: { bank_account_id: bankAccountId, deleted_at: null },
      orderBy: { created_at: 'asc' },
    });
  }

  async addUserRole(bankAccountId: string, userId: string, role: string) {
    await this.findOne(bankAccountId);
    const existing = await this.prisma.bank_account_user_roles.findUnique({
      where: { bank_account_id_user_id: { bank_account_id: bankAccountId, user_id: userId } },
    });
    if (existing) {
      return this.prisma.bank_account_user_roles.update({
        where: { id: existing.id },
        data: { role: role as any, updated_at: new Date() },
      });
    }
    return this.prisma.bank_account_user_roles.create({
      data: { bank_account_id: bankAccountId, user_id: userId, role: role as any },
    });
  }

  async removeUserRole(bankAccountId: string, userId: string) {
    const existing = await this.prisma.bank_account_user_roles.findUnique({
      where: { bank_account_id_user_id: { bank_account_id: bankAccountId, user_id: userId } },
    });
    if (!existing) throw new NotFoundException('Rol de usuario no encontrado');
    return this.prisma.bank_account_user_roles.delete({
      where: { id: existing.id },
    });
  }
}
