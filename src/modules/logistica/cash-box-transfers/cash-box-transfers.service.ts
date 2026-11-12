import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCashBoxTransferDto } from './dto/create-cash-box-transfer.dto';
import { BankMovementsService } from '@/modules/erp/bank-movements/bank-movements.service';
import { requestContext } from '@/common/context/request-context';
import { CashBoxesService } from '../cash-boxes/cash-boxes.service';

@Injectable()
export class CashBoxTransfersService {
  constructor(
    private db: PrismaService,
    private bankMovements: BankMovementsService,
    private cashBoxes: CashBoxesService,
  ) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private async resolveDestinationCompany(
    companyId: string | undefined,
    userId: string,
    permissionCode = 'cash_box_transfers.create',
  ) {
    const sourceCompanyId = requestContext.getStore()?.companyId;
    if (!companyId || companyId === sourceCompanyId) return null;

    const membership = await this.db.getDefaultClient().company_users.findUnique({
      where: { company_id_user_id: { company_id: companyId, user_id: userId } },
      include: { company: true },
    });
    if (!membership?.company || membership.company.deleted_at) {
      throw new ForbiddenException('No tienes acceso a la empresa destino');
    }

    const tenantDb = membership.company.schema_name || (membership.company.subdomain ? `${membership.company.subdomain}_db` : null);
    if (!tenantDb) throw new BadRequestException('La empresa destino no tiene un tenant configurado');
    const client = this.db.getTenantClient(tenantDb);
    await this.assertTargetPermission(client, userId, membership.role, permissionCode);
    return { company: membership.company, client, role: membership.role };
  }

  private async assertTargetPermission(client: any, userId: string, companyRole: string, permissionCode: string) {
    if (companyRole === 'OWNER') return;
    const override = await client.user_permission_overrides.findFirst({
      where: { user_id: userId, permission: { code: permissionCode, active: true, deleted_at: null } },
      select: { effect: true },
    });
    if (override?.effect === 'DENY') throw new ForbiddenException('No tienes permiso para operar transferencias en la empresa destino');
    if (override?.effect === 'ALLOW') return;
    const rolePermission = await client.business_user_roles.findFirst({
      where: {
        user_id: userId,
        role: {
          active: true,
          deleted_at: null,
          permissions: { some: { permission: { code: permissionCode, active: true, deleted_at: null } } },
        },
      },
      select: { user_id: true },
    });
    if (!rolePermission) throw new ForbiddenException('No tienes permiso para operar transferencias en la empresa destino');
  }

  private async assertTargetFundAccess(client: any, type: string, id: string, userId: string, companyRole: string) {
    if (companyRole !== 'USER') return;
    const role = type === 'cash_box'
      ? await client.cash_box_user_roles.findUnique({ where: { cash_box_id_user_id: { cash_box_id: id, user_id: userId } } })
      : await client.bank_account_user_roles.findUnique({ where: { bank_account_id_user_id: { bank_account_id: id, user_id: userId } } });
    if (!role) throw new ForbiddenException('No tienes acceso al fondo destino');
  }

  private async assertSourceAccess(sourceType: string, sourceId: string, userId: string) {
    const companyId = requestContext.getStore()?.companyId;
    if (!companyId) throw new BadRequestException('No se pudo determinar la empresa de origen');
    const membership = await this.db.getDefaultClient().company_users.findUnique({
      where: { company_id_user_id: { company_id: companyId, user_id: userId } },
    });
    if (!membership) throw new ForbiddenException('No tienes acceso a la empresa de origen');
    if (membership.role !== 'USER') return;
    const role = sourceType === 'cash_box'
      ? await this.prisma.cash_box_user_roles.findUnique({ where: { cash_box_id_user_id: { cash_box_id: sourceId, user_id: userId } } })
      : await this.prisma.bank_account_user_roles.findUnique({ where: { bank_account_id_user_id: { bank_account_id: sourceId, user_id: userId } } });
    if (!role) throw new ForbiddenException('No tienes acceso al fondo de origen');
  }

  async getDestinationOptions(companyId: string, userId: string) {
    if (!companyId) throw new BadRequestException('Debes seleccionar una empresa destino');
    const target = await this.resolveDestinationCompany(companyId, userId);
    if (!target) throw new BadRequestException('La empresa destino debe ser diferente de la empresa actual');
    const restrictByRole = target.role === 'USER';
    const [cashBoxes, bankAccounts] = await Promise.all([
      target.client.cash_boxes.findMany({
        where: {
          active: true,
          deleted_at: null,
          ...(restrictByRole ? { user_roles: { some: { user_id: userId } } } : {}),
        },
        select: { id: true, name: true, currency_code: true, status: true, balances: { where: { deleted_at: null } } },
        orderBy: { name: 'asc' },
      }),
      target.client.bank_accounts.findMany({
        where: {
          active: true,
          deleted_at: null,
          ...(restrictByRole ? { user_roles: { some: { user_id: userId } } } : {}),
        },
        select: { id: true, name: true, bank_name: true, currency_code: true, balance: true },
        orderBy: { name: 'asc' },
      }),
    ]);
    return { company: { id: target.company.id, name: target.company.name }, cash_boxes: cashBoxes, bank_accounts: bankAccounts };
  }

  async create(dto: CreateCashBoxTransferDto, userId: string) {
    await this.assertSourceAccess(dto.source_type, dto.source_id, userId);
    const target = await this.resolveDestinationCompany(dto.dest_company_id, userId);
    const sourceCompanyId = requestContext.getStore()?.companyId;
    const sourceCompany = sourceCompanyId
      ? await this.db.getDefaultClient().companies.findUnique({ where: { id: sourceCompanyId }, select: { id: true, name: true } })
      : null;
    // Validar que origen y destino sean diferentes
    if (!target && dto.source_type === dto.dest_type && dto.source_id === dto.dest_id) {
      throw new BadRequestException('Origen y destino no pueden ser iguales');
    }

    const destinationClient = target?.client ?? this.prisma;
    const destination: any = dto.dest_type === 'cash_box'
      ? await destinationClient.cash_boxes.findFirst({ where: { id: dto.dest_id, active: true, deleted_at: null } })
      : await destinationClient.bank_accounts.findFirst({ where: { id: dto.dest_id, active: true, deleted_at: null } });
    if (!destination) throw new BadRequestException('El destino seleccionado no está disponible');

    // Validar sesión abierta en caja origen
    let sourceName: string;
    if (dto.source_type === 'cash_box') {
      const box = await this.prisma.cash_boxes.findUnique({
        where: { id: dto.source_id },
        select: { name: true, current_session_id: true },
      });
      if (!box?.current_session_id) {
        throw new BadRequestException('La caja origen debe tener una sesión abierta');
      }
      dto.session_id = box.current_session_id;
      sourceName = box.name;

      // Validar saldo en origen
      const balance = await this.prisma.cash_box_balances.findUnique({
        where: {
          cash_box_id_currency_code: {
            cash_box_id: dto.source_id,
            currency_code: dto.currency_code,
          },
        },
      });

      if (!balance || balance.balance.toNumber() < dto.amount) {
        throw new BadRequestException('Saldo insuficiente en la caja origen');
      }
    } else {
      const account = await this.prisma.bank_accounts.findFirst({
        where: { id: dto.source_id, active: true, deleted_at: null },
        select: { name: true, bank_name: true, balance: true, currency_code: true },
      });
      if (!account) throw new BadRequestException('La cuenta bancaria de origen no está disponible');
      if (account.currency_code !== dto.currency_code) throw new BadRequestException('La moneda no coincide con la cuenta bancaria de origen');
      if (account.balance.toNumber() < dto.amount) throw new BadRequestException('Saldo insuficiente en la cuenta bancaria de origen');
      sourceName = `${account.bank_name} - ${account.name}`;
    }

    // Crear transferencia
    const transfer = await this.prisma.cash_box_transfers.create({
      data: {
        session_id: dto.session_id,
        source_type: dto.source_type,
        source_id: dto.source_id,
        source_company_id: sourceCompany?.id,
        source_company_name: sourceCompany?.name,
        source_name: sourceName,
        dest_type: dto.dest_type,
        dest_id: dto.dest_id,
        dest_company_id: target?.company.id,
        dest_company_name: target?.company.name,
        dest_name: dto.dest_type === 'bank_account'
          ? `${destination.bank_name} - ${destination.name}`
          : destination.name,
        amount: dto.amount,
        currency_code: dto.currency_code,
        exchange_rate: dto.exchange_rate,
        rate_type: dto.rate_type,
        converted_amount: dto.converted_amount,
        description: dto.description,
        reference: dto.reference,
        transfer_type: dto.transfer_type,
        status: 'pending',
        record_side: 'source',
        created_by: userId,
      },
    });

    return transfer;
  }

  async confirm(id: string, userId: string) {
    const transfer = await this.findOne(id);
    if (transfer.record_side === 'destination') {
      throw new BadRequestException('El registro recibido no se puede ejecutar desde la empresa destino');
    }
    await this.assertSourceAccess(transfer.source_type, transfer.source_id, userId);
    const canRepairCompletedMirror = transfer.status === 'completed' && Boolean(transfer.dest_company_id);
    if (!['pending', 'processing', 'debit_applied', 'failed'].includes(transfer.status) && !canRepairCompletedMirror) {
      throw new BadRequestException('La transferencia no está pendiente de ejecución');
    }

    const target = await this.resolveDestinationCompany(transfer.dest_company_id ?? undefined, userId);
    await this.prisma.cash_box_transfers.update({ where: { id }, data: { status: 'processing', execution_error: null, updated_by: userId } });
    try {
      await this.executeTransfer(transfer, userId, target?.client ?? this.prisma);
      return await this.prisma.cash_box_transfers.update({
        where: { id },
        data: { status: 'completed', execution_error: null, updated_at: new Date(), updated_by: userId },
      });
    } catch (error: any) {
      await this.prisma.cash_box_transfers.update({
        where: { id },
        data: { status: 'failed', execution_error: String(error?.message ?? error).slice(0, 500), updated_by: userId },
      });
      throw error;
    }
  }

  private async executeTransfer(transfer: any, userId: string, destinationClient: any) {
    const isSourceCashBox = transfer.source_type === 'cash_box';
    const isDestCashBox = transfer.dest_type === 'cash_box';

    const sourceAmount = transfer.amount.toNumber();
    const destAmount = transfer.converted_amount?.toNumber() ?? sourceAmount;

    // Resolve destination currency code
    let destCurrencyCode = transfer.currency_code;
    if (isDestCashBox) {
      const destBox = await destinationClient.cash_boxes.findUnique({ where: { id: transfer.dest_id }, select: { currency_code: true, current_session_id: true } });
      destCurrencyCode = destBox?.currency_code ?? transfer.currency_code;
    } else {
      const destAccount = await destinationClient.bank_accounts.findUnique({ where: { id: transfer.dest_id }, select: { currency_code: true } });
      destCurrencyCode = destAccount?.currency_code ?? transfer.currency_code;
    }

    // Resolve destination session ID (each cash box has its own session)
    let destSessionId: string | null = null;
    if (isDestCashBox) {
      const destBox = await destinationClient.cash_boxes.findUnique({ where: { id: transfer.dest_id }, select: { current_session_id: true } });
      destSessionId = destBox?.current_session_id ?? null;
    }

    // Read balances BEFORE updating (needed for correct balance_before in movements)
    let sourceBalanceBefore = 0;
    if (isSourceCashBox) {
      const bal = await this.prisma.cash_box_balances.findUnique({
        where: { cash_box_id_currency_code: { cash_box_id: transfer.source_id, currency_code: transfer.currency_code } },
        select: { balance: true },
      });
      sourceBalanceBefore = bal?.balance.toNumber() ?? 0;
    } else {
      const acc = await this.prisma.bank_accounts.findUnique({ where: { id: transfer.source_id }, select: { balance: true } });
      sourceBalanceBefore = acc?.balance.toNumber() ?? 0;
    }

    let destBalanceBefore = 0;
    if (isDestCashBox) {
      const bal = await destinationClient.cash_box_balances.findUnique({
        where: { cash_box_id_currency_code: { cash_box_id: transfer.dest_id, currency_code: destCurrencyCode } },
        select: { balance: true },
      });
      destBalanceBefore = bal?.balance.toNumber() ?? 0;
    } else {
      const acc = await destinationClient.bank_accounts.findUnique({ where: { id: transfer.dest_id }, select: { balance: true } });
      destBalanceBefore = acc?.balance.toNumber() ?? 0;
    }

    // Restar del origen
    if (isSourceCashBox) {
      await this.applyCashMovement(this.prisma, transfer, transfer.source_id, transfer.session_id, -sourceAmount, transfer.currency_code, 'Transferencia saliente interempresa', userId, sourceBalanceBefore, 'source');
    } else {
      await this.applyBankMovement(this.prisma, transfer, transfer.source_id, -sourceAmount, transfer.currency_code, 'Transferencia saliente interempresa', userId, 'source');
    }

    await this.prisma.cash_box_transfers.update({ where: { id: transfer.id }, data: { status: 'debit_applied', updated_by: userId } });

    // Sumar al destino
    if (isDestCashBox) {
      await this.applyCashMovement(destinationClient, transfer, transfer.dest_id, destSessionId, destAmount, destCurrencyCode, 'Transferencia entrante interempresa', userId, destBalanceBefore, 'destination');
    } else {
      await this.applyBankMovement(destinationClient, transfer, transfer.dest_id, destAmount, destCurrencyCode, 'Transferencia entrante interempresa', userId, 'destination');
    }

    if (transfer.dest_company_id) {
      await this.ensureReceivedTransfer(destinationClient, transfer, destSessionId, userId);
    }
  }

  private async ensureReceivedTransfer(
    destinationClient: any,
    transfer: any,
    destSessionId: string | null,
    userId: string,
    status: 'completed' | 'reversing' | 'reversed' = 'completed',
    executionError: string | null = null,
  ) {
    return destinationClient.cash_box_transfers.upsert({
      where: { id: transfer.id },
      update: {
        status,
        record_side: 'destination',
        execution_error: executionError,
        updated_at: new Date(),
        updated_by: userId,
      },
      create: {
        id: transfer.id,
        session_id: destSessionId,
        source_type: transfer.source_type,
        source_id: transfer.source_id,
        source_company_id: transfer.source_company_id,
        source_company_name: transfer.source_company_name,
        source_name: transfer.source_name,
        dest_type: transfer.dest_type,
        dest_id: transfer.dest_id,
        dest_company_id: transfer.dest_company_id,
        dest_company_name: transfer.dest_company_name,
        dest_name: transfer.dest_name,
        amount: transfer.amount,
        currency_code: transfer.currency_code,
        exchange_rate: transfer.exchange_rate,
        rate_type: transfer.rate_type,
        converted_amount: transfer.converted_amount,
        description: transfer.description,
        reference: transfer.reference,
        transfer_type: transfer.transfer_type,
        status,
        execution_error: executionError,
        record_side: 'destination',
        created_at: transfer.created_at,
        created_by: transfer.created_by,
        updated_by: userId,
      },
    });
  }

  private async applyBankMovement(client: any, transfer: any, bankAccountId: string, amount: number, currencyCode: string, description: string, userId: string, side: string) {
    const exists = await client.bank_account_movements.findFirst({ where: { reference_type: `intercompany_transfer_${side}`, reference_id: transfer.id, deleted_at: null } });
    if (exists) return exists;
    return client.$transaction((tx: any) => this.bankMovements.addMovement({
      bankAccountId,
      type: 'TRANSFER',
      nature: amount < 0 ? 'DEBIT' : 'CREDIT',
      amount,
      currencyCode,
      description,
      referenceType: `intercompany_transfer_${side}`,
      referenceId: transfer.id,
      reference: transfer.reference,
      userId,
      recalculate: false,
    }, tx));
  }

  private async applyCashMovement(client: any, transfer: any, cashBoxId: string, sessionId: string | null, amount: number, currencyCode: string, description: string, userId: string, balanceBefore: number, side: string) {
    const referenceType = `intercompany_transfer_${side}`;
    const exists = await client.cash_box_movements.findFirst({ where: { reference_type: referenceType, reference_id: transfer.id, deleted_at: null } });
    if (exists) return exists;
    return client.$transaction(async (tx: any) => {
      await this.updateCashBoxBalance(cashBoxId, currencyCode, amount, tx);
      return this.createMovement(cashBoxId, sessionId, 'TRANSFER', amount, currencyCode, description, userId, balanceBefore, tx, referenceType, transfer.id);
    });
  }

  private async removeOriginalTransferMovement(
    client: any,
    transferId: string,
    fundType: 'cash_box' | 'bank_account',
    fundId: string,
    side: 'source' | 'destination',
    userId: string,
  ) {
    const referenceType = `intercompany_transfer_${side}`;
    const movementModel = fundType === 'cash_box' ? client.cash_box_movements : client.bank_account_movements;
    const movement = await movementModel.findFirst({
      where: { reference_type: referenceType, reference_id: transferId, deleted_at: null },
    });
    if (!movement) {
      const alreadyRemoved = await movementModel.findFirst({
        where: { reference_type: referenceType, reference_id: transferId, deleted_at: { not: null } },
        select: { id: true },
      });
      if (alreadyRemoved) return;
      throw new NotFoundException(`No se encontró el movimiento original de ${side === 'source' ? 'origen' : 'destino'}`);
    }

    if (fundType === 'bank_account') {
      await client.$transaction(async (tx: any) => {
        await tx.$queryRaw`SELECT id FROM tenant.bank_accounts WHERE id = ${fundId}::uuid FOR UPDATE`;
        const current = await tx.bank_account_movements.findFirst({ where: { id: movement.id, deleted_at: null } });
        if (!current) return;
        const account = await tx.bank_accounts.findUnique({ where: { id: fundId }, select: { balance: true } });
        if (!account) throw new NotFoundException('Cuenta bancaria de la transferencia no encontrada');
        const delta = Number((Number(current.balance_after) - Number(current.balance_before)).toFixed(2));
        if (delta > 0 && Number(account.balance) - delta < -0.01) {
          throw new BadRequestException('El fondo destino ya no tiene saldo suficiente. Reponé el importe y volvé a intentar.');
        }
        await this.bankMovements.cancelMovement(current.id, userId, tx);
      });
      return;
    }

    await client.$transaction(async (tx: any) => {
      await tx.$queryRaw`SELECT id FROM tenant.cash_boxes WHERE id = ${fundId}::uuid FOR UPDATE`;
      await tx.$queryRaw`SELECT id FROM tenant.cash_box_balances WHERE cash_box_id = ${fundId}::uuid AND currency_code = ${movement.currency_code} FOR UPDATE`;
      const current = await tx.cash_box_movements.findFirst({ where: { id: movement.id, deleted_at: null } });
      if (!current) return;
      const delta = Number((Number(current.balance_after) - Number(current.balance_before)).toFixed(2));
      const balance = await tx.cash_box_balances.findUnique({
        where: { cash_box_id_currency_code: { cash_box_id: fundId, currency_code: current.currency_code } },
      });
      const balanceAfterRemoval = Number((Number(balance?.balance ?? 0) - delta).toFixed(2));
      if (delta > 0 && balanceAfterRemoval < -0.01) {
        throw new BadRequestException('El fondo destino ya no tiene saldo suficiente. Reponé el importe y volvé a intentar.');
      }

      await tx.cash_box_movements.update({
        where: { id: current.id },
        data: { deleted_at: new Date(), deleted_by: userId, updated_at: new Date(), updated_by: userId },
      });
      if (balance) {
        await tx.cash_box_balances.update({
          where: { id: balance.id },
          data: { balance: balanceAfterRemoval, updated_at: new Date(), updated_by: userId },
        });
      } else if (balanceAfterRemoval > 0) {
        await tx.cash_box_balances.create({
          data: { cash_box_id: fundId, currency_code: current.currency_code, balance: balanceAfterRemoval, created_by: userId },
        });
      }

      await this.cashBoxes.recalculate(fundId, tx);
      if (current.session_id) {
        const sessionMovements = await tx.cash_box_movements.findMany({
          where: { session_id: current.session_id, deleted_at: null },
          select: { balance_before: true, balance_after: true },
        });
        const sessionTotals = sessionMovements.reduce((totals: { income: number; expenses: number }, row: any) => {
          const movementDelta = Number((Number(row.balance_after) - Number(row.balance_before)).toFixed(2));
          if (movementDelta >= 0) totals.income += movementDelta;
          else totals.expenses += Math.abs(movementDelta);
          return totals;
        }, { income: 0, expenses: 0 });
        await tx.cash_box_sessions.update({
          where: { id: current.session_id },
          data: {
            total_income: sessionTotals.income,
            total_expenses: sessionTotals.expenses,
            movement_count: sessionMovements.length,
            updated_at: new Date(),
            updated_by: userId,
          },
        });
      }
    });
  }

  private async createBankMovement(bankAccountId: string, amount: number, currencyCode: string, description: string, userId: string) {
    await this.bankMovements.addMovement({
      bankAccountId,
      type: 'TRANSFER',
      nature: amount < 0 ? 'DEBIT' : 'CREDIT',
      amount,
      currencyCode,
      description,
      userId,
    });
  }

  private async updateCashBoxBalance(cashBoxId: string, currencyCode: string, delta: number, client: any = this.prisma) {
    const balance = await client.cash_box_balances.findUnique({
      where: {
        cash_box_id_currency_code: { cash_box_id: cashBoxId, currency_code: currencyCode },
      },
    });

    if (balance) {
      const newBalance = balance.balance.toNumber() + delta;
      if (newBalance < 0) throw new BadRequestException('Saldo insuficiente');
      await client.cash_box_balances.update({
        where: { id: balance.id },
        data: { balance: newBalance, updated_at: new Date() },
      });
    } else if (delta > 0) {
      await client.cash_box_balances.create({
        data: {
          cash_box_id: cashBoxId,
          currency_code: currencyCode,
          balance: delta,
          created_by: undefined,
        },
      });
    }
  }

  private async createMovement(cashBoxId: string, sessionId: string | null, type: string, amount: number, currencyCode: string, description: string, userId: string, balanceBefore: number, client: any = this.prisma, referenceType?: string, referenceId?: string) {
    const movement = await client.cash_box_movements.create({
      data: {
        cash_box_id: cashBoxId,
        session_id: sessionId,
        type: type as any,
        amount,
        currency_code: currencyCode,
        balance_before: balanceBefore,
        balance_after: balanceBefore + amount,
        description,
        reference_type: referenceType,
        reference_id: referenceId,
        created_by: userId,
      },
    });

    // Actualizar totales de la sesión
    if (sessionId) {
      const sessionUpdate: Record<string, any> = { movement_count: { increment: 1 } };
      if (amount > 0) {
        sessionUpdate.total_income = { increment: amount };
      } else {
        sessionUpdate.total_expenses = { increment: Math.abs(amount) };
      }
      await client.cash_box_sessions.update({
        where: { id: sessionId },
        data: sessionUpdate,
      });
    }

    return movement;
  }

  async findAll(filters?: { source_type?: string; source_id?: string; dest_type?: string; dest_id?: string; status?: string; user_id?: string }) {
    const where: Record<string, any> = { deleted_at: null };
    if (filters?.source_type) where.source_type = filters.source_type;
    if (filters?.source_id) where.source_id = filters.source_id;
    if (filters?.dest_type) where.dest_type = filters.dest_type;
    if (filters?.dest_id) where.dest_id = filters.dest_id;
    if (filters?.status) where.status = filters.status;
    if (filters?.user_id) where.created_by = filters.user_id;

    const transfers = await this.prisma.cash_box_transfers.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    // Resolver creadores desde public.users
    const creatorIds = [...new Set(transfers.map(t => t.created_by).filter(Boolean))] as string[];
    let creatorsMap = new Map<string, { id: string; name: string | null; email: string | null }>();

    if (creatorIds.length > 0) {
      const publicPrisma = this.db.getDefaultClient();
      const creators = await publicPrisma.users.findMany({
        where: { id: { in: creatorIds } },
        select: { id: true, name: true, email: true },
      });
      creatorsMap = new Map(creators.map(c => [c.id, c]));
    }

    return transfers.map(t => ({
      ...t,
      creator: t.created_by ? creatorsMap.get(t.created_by) ?? null : null,
    }));
  }

  async findOne(id: string) {
    const transfer = await this.prisma.cash_box_transfers.findFirst({
      where: { id, deleted_at: null },
    });
    if (!transfer) throw new NotFoundException('Transferencia no encontrada');

    // Resolver creador desde public.users
    let creator = null;
    if (transfer.created_by) {
      const publicPrisma = this.db.getDefaultClient();
      creator = await publicPrisma.users.findUnique({
        where: { id: transfer.created_by },
        select: { id: true, name: true, email: true },
      });
    }

    return { ...transfer, creator };
  }

  async cancel(id: string, userId: string) {
    const transfer = await this.findOne(id);
    if (transfer.status !== 'pending') {
      throw new BadRequestException('Solo se pueden cancelar transferencias pendientes');
    }

    return this.prisma.cash_box_transfers.update({
      where: { id },
      data: {
        status: 'cancelled',
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async reverse(id: string, userId: string) {
    const transfer = await this.findOne(id);
    if (transfer.record_side === 'destination') {
      throw new BadRequestException('La anulación debe iniciarse desde la empresa de origen');
    }
    await this.assertSourceAccess(transfer.source_type, transfer.source_id, userId);
    if (transfer.status === 'reversed') return transfer;
    if (transfer.status !== 'completed' && !(transfer.status === 'reversing' && transfer.execution_error)) {
      throw new BadRequestException('Solo se pueden anular transferencias completadas');
    }

    const target = await this.resolveDestinationCompany(
      transfer.dest_company_id ?? undefined,
      userId,
      'cash_box_transfers.cancel',
    );
    const destinationClient = target?.client ?? this.prisma;
    if (target) {
      await this.assertTargetFundAccess(destinationClient, transfer.dest_type, transfer.dest_id, userId, target.role);
    } else {
      await this.assertSourceAccess(transfer.dest_type, transfer.dest_id, userId);
    }

    const destinationFund: any = transfer.dest_type === 'cash_box'
      ? await destinationClient.cash_boxes.findFirst({
          where: { id: transfer.dest_id, deleted_at: null },
          select: { currency_code: true, current_session_id: true },
        })
      : await destinationClient.bank_accounts.findFirst({
          where: { id: transfer.dest_id, deleted_at: null },
          select: { currency_code: true },
        });
    if (!destinationFund) throw new NotFoundException('No se encontró el fondo que recibió la transferencia');
    const destinationSessionId = transfer.dest_type === 'cash_box' ? destinationFund.current_session_id ?? null : null;

    // Tomar la transferencia para evitar dos reversas simultáneas. Si falló una ejecución
    // anterior, solo se permite reintentar desde ese estado; los movimientos son idempotentes.
    const claimWhere = transfer.status === 'completed'
      ? { id, status: 'completed' }
      : { id, status: 'reversing', execution_error: transfer.execution_error };
    const claim = await this.prisma.cash_box_transfers.updateMany({
      where: claimWhere,
      data: { status: 'reversing', execution_error: null, updated_at: new Date(), updated_by: userId },
    });
    if (claim.count !== 1) throw new BadRequestException('La transferencia ya está siendo procesada o cambió de estado');

    let destinationRemoved = false;
    try {
      // El destino debe poder devolver los fondos antes de tocar el origen.
      await this.removeOriginalTransferMovement(
        destinationClient,
        transfer.id,
        transfer.dest_type,
        transfer.dest_id,
        'destination',
        userId,
      );
      destinationRemoved = true;

      if (target) {
        await this.ensureReceivedTransfer(
          destinationClient,
          transfer,
          destinationSessionId,
          userId,
          'reversing',
        );
      }

      await this.removeOriginalTransferMovement(
        this.prisma,
        transfer.id,
        transfer.source_type,
        transfer.source_id,
        'source',
        userId,
      );

      if (target) {
        await this.ensureReceivedTransfer(
          destinationClient,
          transfer,
          destinationSessionId,
          userId,
          'reversed',
        );
      }

      return await this.prisma.cash_box_transfers.update({
        where: { id },
        data: { status: 'reversed', execution_error: null, updated_at: new Date(), updated_by: userId },
      });
    } catch (error: any) {
      const message = String(error?.message ?? error).slice(0, 500);
      // Si el destino rechazó la anulación y conserva su movimiento, ninguno de los
      // fondos cambió. Volver a Completada permite intentar anular cuando haya saldo.
      let destinationStillActive = false;
      if (!destinationRemoved && transfer.status === 'completed') {
        const movements = transfer.dest_type === 'cash_box'
          ? destinationClient.cash_box_movements
          : destinationClient.bank_account_movements;
        try {
          destinationStillActive = Boolean(await movements.findFirst({
            where: { reference_type: 'intercompany_transfer_destination', reference_id: id, deleted_at: null },
            select: { id: true },
          }));
        } catch {
          // Sin poder verificar el destino, conservar el estado de reintento es más seguro.
        }
      }
      const restoreCompleted = transfer.status === 'completed' && !destinationRemoved && destinationStillActive;
      await this.prisma.cash_box_transfers.update({
        where: { id },
        data: {
          status: restoreCompleted ? 'completed' : 'reversing',
          execution_error: restoreCompleted ? null : message,
          updated_at: new Date(),
          updated_by: userId,
        },
      });
      if (target && !restoreCompleted) {
        try {
          await this.ensureReceivedTransfer(
            destinationClient,
            transfer,
            destinationSessionId,
            userId,
            'reversing',
            message,
          );
        } catch {
          // Keep the source-side failure visible; a retry will synchronize both tenant records.
        }
      }
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    const transfer = await this.findOne(id);
    if (['completed', 'reversing'].includes(transfer.status)) {
      throw new BadRequestException('No se puede eliminar una transferencia completada o con anulación en curso');
    }

    if (transfer.status === 'reversed' && transfer.record_side === 'destination') {
      throw new BadRequestException('El registro anulado debe eliminarse desde la empresa de origen');
    }

    const target = transfer.status === 'reversed'
      ? await this.resolveDestinationCompany(
          transfer.dest_company_id ?? undefined,
          userId,
          'cash_box_transfers.delete',
        )
      : null;
    const now = new Date();
    if (target) {
      await target.client.cash_box_transfers.updateMany({
        where: { id, record_side: 'destination', status: 'reversed', deleted_at: null },
        data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
      });
    }

    return this.prisma.cash_box_transfers.update({
      where: { id },
      data: {
        deleted_at: now,
        deleted_by: userId,
      },
    });
  }
}
