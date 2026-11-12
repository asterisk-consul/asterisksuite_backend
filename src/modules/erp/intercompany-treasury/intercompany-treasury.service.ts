import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { requestContext } from '@/common/context/request-context';
import { BankMovementsService } from '../bank-movements/bank-movements.service';

type FundType = 'CASH_BOX' | 'BANK_ACCOUNT';
type UseType = 'PAYMENT' | 'COLLECTION' | 'HR';

@Injectable()
export class IntercompanyTreasuryService {
  constructor(private readonly db: PrismaService, private readonly bankMovements: BankMovementsService) {}

  private get publicDb() { return this.db.getDefaultClient(); }
  private get localDb() { return this.db.getClientForCurrentContext(); }
  private get companyId() { return requestContext.getStore()?.companyId ?? null; }

  async listCompanies() {
    if (!this.companyId) throw new BadRequestException('No se pudo resolver la empresa actual');
    const userId = requestContext.getStore()?.userId;
    if (!userId) throw new ForbiddenException('No se pudo validar el acceso del usuario');
    const user = await this.publicDb.users.findUnique({ where: { id: userId }, select: { role: true } });
    const companyScope = user?.role === 'PLATFORM_OWNER'
      ? undefined
      : { companyUsers: { some: { user_id: userId } } };
    return this.publicDb.companies.findMany({
      where: { id: { not: this.companyId }, deleted_at: null, schema_name: { not: null }, ...companyScope },
      select: { id: true, name: true, subdomain: true },
      orderBy: { name: 'asc' },
    });
  }

  async getSharing(type: FundType, fundId: string) {
    this.assertFundType(type);
    await this.assertLocalFund(type, fundId);
    return this.publicDb.intercompany_treasury_shares.findMany({
      where: { owner_company_id: this.companyId!, fund_type: type, fund_id: fundId },
      include: { consumer_company: { select: { id: true, name: true, subdomain: true } } },
      orderBy: { consumer_company: { name: 'asc' } },
    });
  }

  async updateSharing(type: FundType, fundId: string, dto: {
    shares: Array<{
      company_id: string;
      allow_payments: boolean;
      allow_collections: boolean;
      allow_hr: boolean;
      active?: boolean;
    }>;
  }, userId: string) {
    this.assertFundType(type);
    await this.assertLocalFund(type, fundId);
    const companyId = this.companyId!;
    const ids = [...new Set(dto.shares.map(share => share.company_id))];
    if (ids.includes(companyId)) throw new BadRequestException('No podés compartir el fondo con su misma empresa');
    if (ids.length > 100) throw new BadRequestException('El fondo no puede compartirse con más de 100 empresas');
    const visibleCompanies = await this.listCompanies();
    const visibleIds = new Set(visibleCompanies.map(company => company.id));
    if (ids.some(id => !visibleIds.has(id))) throw new ForbiddenException('Solo podés compartir el fondo con empresas asociadas a tu usuario');
    const companies = ids.length ? await this.publicDb.companies.findMany({
      where: { id: { in: ids }, deleted_at: null, schema_name: { not: null } },
      select: { id: true },
    }) : [];
    if (companies.length !== ids.length) throw new BadRequestException('Una o más empresas no están disponibles');

    for (const share of dto.shares) {
      if (share.active !== false && !share.allow_payments && !share.allow_collections && !share.allow_hr) {
        throw new BadRequestException('Seleccioná al menos un uso permitido para cada empresa');
      }
    }

    return this.publicDb.$transaction(async (tx: any) => {
      await tx.intercompany_treasury_shares.updateMany({
        where: { owner_company_id: companyId, fund_type: type, fund_id: fundId, consumer_company_id: { notIn: ids.length ? ids : ['00000000-0000-0000-0000-000000000000'] } },
        data: { active: false, updated_at: new Date(), updated_by: userId },
      });
      for (const share of dto.shares) {
        await tx.intercompany_treasury_shares.upsert({
          where: { owner_company_id_consumer_company_id_fund_type_fund_id: { owner_company_id: companyId, consumer_company_id: share.company_id, fund_type: type, fund_id: fundId } },
          create: {
            owner_company_id: companyId, consumer_company_id: share.company_id, fund_type: type, fund_id: fundId,
            allow_payments: share.allow_payments, allow_collections: share.allow_collections, allow_hr: share.allow_hr,
            active: share.active ?? true, created_by: userId,
          },
          update: {
            allow_payments: share.allow_payments, allow_collections: share.allow_collections, allow_hr: share.allow_hr,
            active: share.active ?? true, updated_by: userId,
          },
        });
      }
      return tx.intercompany_treasury_shares.findMany({
        where: { owner_company_id: companyId, fund_type: type, fund_id: fundId },
        include: { consumer_company: { select: { id: true, name: true, subdomain: true } } },
      });
    });
  }

  async listAvailable(use: UseType, currencyCode?: string) {
    const companyId = this.companyId;
    if (!companyId) throw new BadRequestException('No se pudo resolver la empresa actual');
    const where = use === 'PAYMENT'
      ? { allow_payments: true }
      : use === 'COLLECTION' ? { allow_collections: true } : { allow_hr: true };
    const shares = await this.publicDb.intercompany_treasury_shares.findMany({
      where: { ...where, consumer_company_id: companyId, active: true, owner_company: { deleted_at: null } },
      include: { owner_company: { select: { id: true, name: true, schema_name: true } } },
      orderBy: [{ owner_company: { name: 'asc' } }, { fund_type: 'asc' }],
      take: 100,
    });
    const options: any[] = [];
    // Iterar de forma secuencial y solo sobre empresas autorizadas: no abrir un
    // pool para cada tenant del sistema ni cargar recursos fuera del allow-list.
    for (const share of shares) {
      const tenantDb = share.owner_company.schema_name;
      if (!tenantDb) continue;
      const tenant = this.db.getTenantClient(tenantDb);
      if (share.fund_type === 'CASH_BOX') {
        const box = await tenant.cash_boxes.findFirst({
          where: { id: share.fund_id, active: true, deleted_at: null, ...(currencyCode ? { currency_code: currencyCode } : {}) },
          select: { id: true, name: true, currency_code: true, status: true, current_session_id: true, balances: { where: { deleted_at: null }, select: { currency_code: true, balance: true } } },
        });
        if (box) options.push({ ...box, fund_type: 'CASH_BOX', fund_id: box.id, company_id: share.owner_company.id, company_name: share.owner_company.name, is_intercompany: true });
      } else {
        const account = await tenant.bank_accounts.findFirst({
          where: { id: share.fund_id, active: true, deleted_at: null, ...(currencyCode ? { currency_code: currencyCode } : {}) },
          select: { id: true, name: true, bank_name: true, account_number: true, account_type: true, currency_code: true, balance: true },
        });
        if (account) options.push({ ...account, fund_type: 'BANK_ACCOUNT', fund_id: account.id, company_id: share.owner_company.id, company_name: share.owner_company.name, is_intercompany: true });
      }
    }
    return options;
  }

  async validateUse(companyId: string, type: FundType, fundId: string, use: UseType) {
    if (!this.companyId) throw new BadRequestException('No se pudo resolver la empresa actual');
    if (companyId === this.companyId) throw new BadRequestException('Las cajas y cuentas locales no se registran como fondos intercompany');
    const share = await this.publicDb.intercompany_treasury_shares.findFirst({
      where: {
        owner_company_id: companyId, consumer_company_id: this.companyId, fund_type: type, fund_id: fundId, active: true,
        ...(use === 'PAYMENT' ? { allow_payments: true } : use === 'COLLECTION' ? { allow_collections: true } : { allow_hr: true }),
      },
      include: { owner_company: { select: { id: true, name: true, schema_name: true } } },
    });
    if (!share?.owner_company.schema_name) throw new ForbiddenException('Este fondo no está compartido con la empresa actual para esta operación');
    return share;
  }

  async applyUsage(input: {
    ownerCompanyId: string; fundType: FundType; fundId: string; sourceType: string; sourceId: string;
    operationType: 'PAYMENT' | 'COLLECTION'; accessUse?: UseType; amount: number; currencyCode: string; date: Date; description: string; userId: string;
  }) {
    if (!Number.isFinite(input.amount) || input.amount <= 0) throw new BadRequestException('El importe intercompany debe ser mayor a cero');
    const share = await this.validateUse(input.ownerCompanyId, input.fundType, input.fundId, input.accessUse ?? input.operationType);
    const currentCompanyId = this.companyId!;
    const operationKey = {
      source_company_id: currentCompanyId,
      source_type: input.sourceType,
      source_id: input.sourceId,
      fund_type: input.fundType,
      fund_id: input.fundId,
    };
    let operation = await this.publicDb.intercompany_treasury_operations.findFirst({
      where: operationKey,
      orderBy: { attempt: 'desc' },
    });

    if (operation?.status === 'COMPLETED') {
      const sameRequest = operation.fund_company_id === input.ownerCompanyId
        && operation.operation_type === input.operationType
        && operation.currency_code === input.currencyCode
        && Number(operation.amount) === Number(input.amount);
      if (sameRequest) return operation;
      // A prior confirmation may have posted to the owner tenant before the
      // source transaction rolled back. Reverse that attempt before retrying
      // with edited payment details; never silently reuse a stale amount.
      await this.validateCanReverseUsage(currentCompanyId, input.sourceType, input.sourceId, operation.id);
      await this.reverseUsage(currentCompanyId, input.sourceType, input.sourceId, input.userId, operation.id);
      operation = await this.publicDb.intercompany_treasury_operations.findFirst({
        where: operationKey,
        orderBy: { attempt: 'desc' },
      });
    }

    if (operation?.status === 'PROCESSING') {
      throw new BadRequestException('El movimiento intercompany ya está siendo procesado');
    }

    if (!operation || operation.status === 'REVERSED') {
      try {
        operation = await this.publicDb.intercompany_treasury_operations.create({
          data: {
            ...operationKey,
            fund_company_id: input.ownerCompanyId,
            attempt: (operation?.attempt ?? 0) + 1,
            operation_type: input.operationType,
            amount: input.amount,
            currency_code: input.currencyCode,
            created_by: input.userId,
          },
        });
      } catch (error: any) {
        if (error?.code !== 'P2002') throw error;
        operation = await this.publicDb.intercompany_treasury_operations.findFirst({
          where: operationKey,
          orderBy: { attempt: 'desc' },
        });
        if (!operation || operation.status === 'PROCESSING') {
          throw new BadRequestException('El movimiento intercompany ya está siendo procesado');
        }
        if (operation.status === 'PENDING' || operation.status === 'FAILED') {
          operation = await this.publicDb.intercompany_treasury_operations.update({
            where: { id: operation.id },
            data: {
              fund_company_id: input.ownerCompanyId,
              operation_type: input.operationType,
              amount: input.amount,
              currency_code: input.currencyCode,
              updated_at: new Date(),
            },
          });
        }
      }
    } else if (operation.status === 'PENDING' || operation.status === 'FAILED') {
      operation = await this.publicDb.intercompany_treasury_operations.update({
        where: { id: operation.id },
        data: {
          fund_company_id: input.ownerCompanyId,
          operation_type: input.operationType,
          amount: input.amount,
          currency_code: input.currencyCode,
          updated_at: new Date(),
        },
      });
    }

    if (operation?.status === 'COMPLETED') return operation;
    if (!operation) throw new BadRequestException('No se pudo preparar el movimiento intercompany');
    const claimed = await this.publicDb.intercompany_treasury_operations.updateMany({
      where: { id: operation.id, status: { in: ['PENDING', 'FAILED'] } },
      data: { status: 'PROCESSING', error: null, updated_at: new Date() },
    });
    if (claimed.count !== 1) throw new BadRequestException('El movimiento intercompany ya está siendo procesado');

    try {
      const tenant = this.db.getTenantClient(share.owner_company.schema_name);
      const sourceCompany = await this.publicDb.companies.findUnique({ where: { id: currentCompanyId }, select: { name: true } });
      const postedDescription = `${sourceCompany?.name ?? 'Otra empresa'} · ${input.description}`.slice(0, 255);
      let movementId: string;
      const referenceType = `intercompany_${input.sourceType.toLowerCase()}`;
      if (input.fundType === 'CASH_BOX') {
        const box = await tenant.cash_boxes.findFirst({ where: { id: input.fundId, active: true, deleted_at: null } });
        if (!box || box.currency_code !== input.currencyCode || !box.current_session_id || box.status !== 'OPEN') {
          throw new BadRequestException('La caja compartida debe estar activa, operar en la moneda seleccionada y tener una sesión abierta');
        }
        const already = await tenant.cash_box_movements.findFirst({ where: { reference_type: referenceType, reference_id: operation.id, deleted_at: null }, select: { id: true } });
        if (already) movementId = already.id;
        else movementId = await tenant.$transaction(async (tx: any) => {
          await tx.$queryRaw`SELECT id FROM tenant.cash_boxes WHERE id = ${input.fundId}::uuid FOR UPDATE`;
          const lockedBox = await tx.cash_boxes.findFirst({ where: { id: input.fundId, active: true, deleted_at: null, status: 'OPEN' } });
        if (!lockedBox || lockedBox.currency_code !== input.currencyCode || !lockedBox.current_session_id) {
          throw new BadRequestException('La caja compartida debe seguir activa, operar en la moneda seleccionada y tener una sesión abierta');
        }
          const current = await tx.cash_box_balances.findUnique({ where: { cash_box_id_currency_code: { cash_box_id: input.fundId, currency_code: input.currencyCode } } });
          const before = Number(current?.balance ?? 0);
          const signed = input.operationType === 'PAYMENT' ? -input.amount : input.amount;
          const after = Number((before + signed).toFixed(2));
          if (after < 0) throw new BadRequestException('Saldo insuficiente en la caja compartida');
          const movement = await tx.cash_box_movements.create({ data: {
            cash_box_id: input.fundId, session_id: lockedBox.current_session_id, type: input.operationType, amount: input.amount,
            currency_code: input.currencyCode, balance_before: before, balance_after: after, description: postedDescription,
            reference_type: referenceType, reference_id: operation.id, date: input.date, created_by: input.userId,
          } });
          await tx.cash_box_balances.upsert({
            where: { cash_box_id_currency_code: { cash_box_id: input.fundId, currency_code: input.currencyCode } },
            create: { cash_box_id: input.fundId, currency_code: input.currencyCode, balance: after, created_by: input.userId },
            update: { balance: after, updated_at: new Date(), updated_by: input.userId },
          });
          await tx.cash_box_sessions.update({ where: { id: lockedBox.current_session_id }, data: {
            movement_count: { increment: 1 }, ...(input.operationType === 'PAYMENT' ? { total_expenses: { increment: input.amount } } : { total_income: { increment: input.amount } }),
          } });
          return movement.id;
        });
      } else {
        const account = await tenant.bank_accounts.findFirst({ where: { id: input.fundId, active: true, deleted_at: null } });
        if (!account || account.currency_code !== input.currencyCode) throw new BadRequestException('La cuenta bancaria compartida no está activa o su moneda no coincide');
        const already = await tenant.bank_account_movements.findFirst({ where: { reference_type: referenceType, reference_id: operation.id, deleted_at: null }, select: { id: true } });
        if (already) movementId = already.id;
        else {
          const bankOperation = await this.bankMovements.openOperation({ bankAccountId: input.fundId, operationType: input.operationType, sourceType: input.sourceType, sourceId: operation.id, date: input.date, currencyCode: input.currencyCode, description: postedDescription, userId: input.userId }, tenant);
          const movement = await this.bankMovements.addMovement({ bankAccountId: input.fundId, type: input.operationType, nature: input.operationType === 'PAYMENT' ? 'DEBIT' : 'CREDIT', amount: input.operationType === 'PAYMENT' ? -Math.abs(input.amount) : Math.abs(input.amount), currencyCode: input.currencyCode, operationId: bankOperation.id, description: postedDescription, referenceType, referenceId: operation.id, date: input.date, userId: input.userId }, tenant);
          movementId = movement.id;
        }
      }
      return await this.publicDb.intercompany_treasury_operations.update({ where: { id: operation.id }, data: { status: 'COMPLETED', owner_movement_id: movementId, error: null, updated_at: new Date() } });
    } catch (error: any) {
      await this.publicDb.intercompany_treasury_operations.update({ where: { id: operation.id }, data: { status: 'FAILED', error: String(error?.message ?? error).slice(0,500), updated_at: new Date() } });
      throw error;
    }
  }

  async reverseUsage(sourceCompanyId: string, sourceType: string, sourceId: string, userId: string, operationId?: string) {
    const operations = await this.publicDb.intercompany_treasury_operations.findMany({
      where: { source_company_id: sourceCompanyId, source_type: sourceType, source_id: sourceId, status: 'COMPLETED', ...(operationId ? { id: operationId } : {}) },
      orderBy: { created_at: 'asc' },
    });
    if (!operations.length) return [];
    const reversed: any[] = [];
    for (const operation of operations) {
    const claimed = await this.publicDb.intercompany_treasury_operations.updateMany({
      where: { id: operation.id, status: 'COMPLETED' },
      data: { status: 'PROCESSING', updated_at: new Date() },
    });
    if (claimed.count !== 1) continue;
    try {
    const fundCompany = await this.publicDb.companies.findFirst({ where: { id: operation.fund_company_id, deleted_at: null } });
    if (!fundCompany?.schema_name) throw new BadRequestException('No se encuentra la empresa titular para revertir el movimiento compartido');
    const tenant = this.db.getTenantClient(fundCompany.schema_name);
    const reversalType = `intercompany_${sourceType.toLowerCase()}_reversal`;
    if (operation.fund_type === 'CASH_BOX') {
      const exists = await tenant.cash_box_movements.findFirst({ where: { reference_type: reversalType, reference_id: operation.id, deleted_at: null }, select: { id: true } });
      if (!exists) await tenant.$transaction(async (tx: any) => {
        await tx.$queryRaw`SELECT id FROM tenant.cash_boxes WHERE id = ${operation.fund_id}::uuid FOR UPDATE`;
        const original = await tx.cash_box_movements.findFirst({ where: { id: operation.owner_movement_id, deleted_at: null } });
        if (!original) throw new NotFoundException('No se encontró el movimiento de caja compartida para revertir');
        const box = await tx.cash_boxes.findFirst({ where: { id: operation.fund_id, active: true, deleted_at: null, status: 'OPEN' } });
        if (!box?.current_session_id) throw new BadRequestException('Abrí una sesión en la caja titular para registrar la reversión');
        const current = await tx.cash_box_balances.findUnique({ where: { cash_box_id_currency_code: { cash_box_id: operation.fund_id, currency_code: operation.currency_code } } });
        const before = Number(current?.balance ?? 0);
        const originalDelta = Number(original.balance_after) - Number(original.balance_before);
        const after = Number((before - originalDelta).toFixed(2));
        if (after < 0) throw new BadRequestException('El saldo actual no alcanza para revertir el movimiento de caja compartida');
        const amount = Math.abs(originalDelta);
        const isOutflow = originalDelta < 0;
        await tx.cash_box_movements.create({ data: {
          cash_box_id: operation.fund_id, session_id: box.current_session_id,
          type: isOutflow ? 'COLLECTION' : 'PAYMENT', amount, currency_code: operation.currency_code,
          balance_before: before, balance_after: after, description: `Reversión intercompany · ${sourceType} ${sourceId}`.slice(0,255),
          reference_type: reversalType, reference_id: operation.id, date: new Date(), created_by: userId,
        } });
        await tx.cash_box_balances.upsert({ where: { cash_box_id_currency_code: { cash_box_id: operation.fund_id, currency_code: operation.currency_code } },
          create: { cash_box_id: operation.fund_id, currency_code: operation.currency_code, balance: after, created_by: userId },
          update: { balance: after, updated_at: new Date(), updated_by: userId },
        });
        await tx.cash_box_sessions.update({ where: { id: box.current_session_id }, data: {
          movement_count: { increment: 1 },
          ...(isOutflow ? { total_income: { increment: amount } } : { total_expenses: { increment: amount } }),
        } });
      });
    } else {
      const exists = await tenant.bank_account_movements.findFirst({ where: { reference_type: reversalType, reference_id: operation.id, deleted_at: null }, select: { id: true } });
      if (!exists) {
        const sourceMovement = await tenant.bank_account_movements.findFirst({ where: { id: operation.owner_movement_id, deleted_at: null } });
        if (!sourceMovement) throw new NotFoundException('No se encontró el movimiento bancario compartido para revertir');
        const bankOperation = await this.bankMovements.openOperation({ bankAccountId: operation.fund_id, operationType: operation.operation_type === 'PAYMENT' ? 'PAYMENT' : 'COLLECTION', sourceType: `${sourceType}_reversal`, sourceId: operation.id, currencyCode: operation.currency_code, description: `Reversión intercompany · ${sourceType} ${sourceId}`, userId }, tenant);
        await this.bankMovements.addMovement({ bankAccountId: operation.fund_id, type: 'ADJUSTMENT', nature: Number(sourceMovement.amount) < 0 ? 'CREDIT' : 'DEBIT', amount: -Number(sourceMovement.amount), currencyCode: operation.currency_code, operationId: bankOperation.id, description: `Reversión intercompany · ${sourceType} ${sourceId}`, referenceType: reversalType, referenceId: operation.id, date: new Date(), userId }, tenant);
      }
    }
      reversed.push(await this.publicDb.intercompany_treasury_operations.update({ where: { id: operation.id }, data: { status: 'REVERSED', error: null, updated_at: new Date() } }));
    } catch (error: any) {
      await this.publicDb.intercompany_treasury_operations.update({
        where: { id: operation.id },
        data: { status: 'COMPLETED', error: String(error?.message ?? error).slice(0, 500), updated_at: new Date() },
      });
      throw error;
    }
    }
    return reversed;
  }

  async validateCanReverseUsage(sourceCompanyId: string, sourceType: string, sourceId: string, operationId?: string) {
    const operations = await this.publicDb.intercompany_treasury_operations.findMany({
      where: { source_company_id: sourceCompanyId, source_type: sourceType, source_id: sourceId, status: 'COMPLETED', ...(operationId ? { id: operationId } : {}) },
      orderBy: { created_at: 'asc' },
    });
    for (const operation of operations) {
      const company = await this.publicDb.companies.findFirst({ where: { id: operation.fund_company_id, deleted_at: null } });
      if (!company?.schema_name) throw new BadRequestException('No se encuentra la empresa titular para revertir el movimiento compartido');
      const tenant = this.db.getTenantClient(company.schema_name);
      const reversalType = `intercompany_${sourceType.toLowerCase()}_reversal`;
      if (operation.fund_type === 'CASH_BOX') {
        const existingReversal = await tenant.cash_box_movements.findFirst({ where: { reference_type: reversalType, reference_id: operation.id, deleted_at: null }, select: { id: true } });
        if (existingReversal) continue;
        const original = await tenant.cash_box_movements.findFirst({ where: { id: operation.owner_movement_id, deleted_at: null } });
        if (!original) throw new NotFoundException('No se encontró el movimiento de caja compartida para revertir');
        const box = await tenant.cash_boxes.findFirst({ where: { id: operation.fund_id, active: true, deleted_at: null, status: 'OPEN' } });
        if (!box?.current_session_id) throw new BadRequestException('Abrí una sesión en la caja titular antes de anular esta operación');
        const balance = await tenant.cash_box_balances.findUnique({ where: { cash_box_id_currency_code: { cash_box_id: operation.fund_id, currency_code: operation.currency_code } } });
        const delta = Number(original.balance_after) - Number(original.balance_before);
        if (delta > 0 && Number(balance?.balance ?? 0) < delta) {
          throw new BadRequestException('El saldo actual de la caja titular no alcanza para revertir el cobro compartido');
        }
      } else {
        const existingReversal = await tenant.bank_account_movements.findFirst({ where: { reference_type: reversalType, reference_id: operation.id, deleted_at: null }, select: { id: true } });
        if (existingReversal) continue;
        const original = await tenant.bank_account_movements.findFirst({ where: { id: operation.owner_movement_id, deleted_at: null }, select: { id: true } });
        if (!original) throw new NotFoundException('No se encontró el movimiento bancario compartido para revertir');
      }
    }
  }

  private async assertLocalFund(type: FundType, id: string) {
    const fund = type === 'CASH_BOX'
      ? await this.localDb.cash_boxes.findFirst({ where: { id, deleted_at: null }, select: { id: true } })
      : await this.localDb.bank_accounts.findFirst({ where: { id, deleted_at: null }, select: { id: true } });
    if (!fund) throw new NotFoundException('No se encontró el fondo en la empresa titular');
  }

  private assertFundType(type: string): asserts type is FundType {
    if (type !== 'CASH_BOX' && type !== 'BANK_ACCOUNT') throw new BadRequestException('Tipo de fondo no válido');
  }
}
