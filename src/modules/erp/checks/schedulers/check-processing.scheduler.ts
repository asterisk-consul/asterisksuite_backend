import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { recalculateBankAccountLedger } from '../../bank-accounts/bank-account-ledger';

@Injectable()
export class CheckProcessingScheduler {
  private readonly logger = new Logger(CheckProcessingScheduler.name);

  constructor(private db: PrismaService) {}

  @Cron('0 10 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async processChecks() {
    this.logger.log('Procesando vencimientos de cheques...');
    const companies = await this.db.getDefaultClient().companies.findMany({
      where: { deleted_at: null },
      select: { schema_name: true, name: true },
    });

    for (const company of companies) {
      if (!company.schema_name) continue;
      try {
        await this.processChecksForTenant(company.schema_name, company.name);
      } catch (error) {
        this.logger.error(`Error procesando cheques en ${company.name}`, error);
      }
    }
  }

  private argentinaDateBoundary() {
    const date = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date());
    return {
      start: new Date(`${date}T00:00:00.000Z`),
      end: new Date(`${date}T23:59:59.999Z`),
    };
  }

  private async processChecksForTenant(tenantDb: string, companyName: string) {
    const prisma = this.db.getTenantClient(tenantDb);
    const boundary = this.argentinaDateBoundary();
    const ownChecks = await prisma.checks.findMany({
      where: { is_own: true, status: 'CONFIRMED', due_date: { lte: boundary.end }, deleted_at: null },
      orderBy: { due_date: 'asc' },
    });
    const thirdPartyChecks = await prisma.checks.findMany({
      where: { is_own: false, status: 'PENDING', due_date: { lte: boundary.end }, bank_account_id: { not: null }, deleted_at: null },
      include: { payment: { select: { type: true } } },
      orderBy: { due_date: 'asc' },
    });

    this.logger.log(`[${companyName}] ${ownChecks.length} cheque(s) propio(s) y ${thirdPartyChecks.length} de tercero(s) vencidos`);
    for (const check of ownChecks) await this.debitOwnCheck(prisma, check, companyName, boundary.start);
    for (const check of thirdPartyChecks) {
      // Un cheque entregado a un proveedor salió de cartera.
      if (check.payment?.type === 'PAYMENT') continue;
      await this.depositThirdPartyCheck(prisma, check, companyName, boundary.start);
    }
  }

  private existingMovement(prisma: any, checkId: string) {
    return prisma.bank_account_movements.findFirst({
      where: { reference_type: 'check', reference_id: checkId, deleted_at: null },
      select: { id: true },
    });
  }

  private async debitOwnCheck(prisma: any, check: any, companyName: string, processDate: Date) {
    const effectiveDate = check.payment_date ?? check.due_date ?? processDate;
    if (await this.existingMovement(prisma, check.id)) {
      await prisma.checks.update({ where: { id: check.id }, data: { status: 'CLEARED', clearing_date: check.clearing_date ?? effectiveDate } });
      return;
    }
    if (!check.bank_account_id) {
      this.logger.warn(`[${companyName}] Cheque propio #${check.check_number}: falta la cuenta a debitar`);
      return;
    }
    const account = await prisma.bank_accounts.findUnique({ where: { id: check.bank_account_id } });
    if (!account?.active) {
      this.logger.warn(`[${companyName}] Cheque propio #${check.check_number}: cuenta inexistente o inactiva`);
      return;
    }
    if (account.currency_code !== check.currency_code) {
      this.logger.warn(`[${companyName}] Cheque propio #${check.check_number}: moneda incompatible con la cuenta`);
      return;
    }
    if (Number(account.balance) < Number(check.amount)) {
      this.logger.warn(`[${companyName}] Cheque propio #${check.check_number}: saldo insuficiente, queda pendiente`);
      await prisma.checks.update({ where: { id: check.id }, data: { notification_sent: false, updated_at: new Date() } });
      return;
    }

    await prisma.$transaction(async (tx: any) => {
      if (await this.existingMovement(tx, check.id)) return;
      const current = await tx.bank_accounts.findUnique({ where: { id: check.bank_account_id } });
      if (!current?.active || current.currency_code !== check.currency_code || Number(current.balance) < Number(check.amount)) return;
      const amount = Number(check.amount);
      const before = Number(current.balance);
      await tx.bank_account_movements.create({ data: {
        bank_account_id: check.bank_account_id, type: 'CHECK_ISSUED', amount: -amount,
        currency_code: check.currency_code, exchange_rate: check.exchange_rate, rate_type: check.rate_type,
        converted_amount: check.converted_amount, balance_before: before, balance_after: before - amount,
        description: `Débito automático cheque propio #${check.check_number}`,
        reference_type: 'check', reference_id: check.id, payment_id: check.payment_id,
        date: effectiveDate, created_by: check.created_by,
      } });
      await tx.bank_accounts.update({ where: { id: check.bank_account_id }, data: { balance: before - amount, updated_at: new Date() } });
      await recalculateBankAccountLedger(tx, check.bank_account_id);
      await tx.checks.update({ where: { id: check.id }, data: { status: 'CLEARED', payment_date: effectiveDate, clearing_date: effectiveDate, updated_at: new Date() } });
    });
  }

  private async depositThirdPartyCheck(prisma: any, check: any, companyName: string, processDate: Date) {
    const effectiveDate = check.deposit_date ?? check.due_date ?? processDate;
    if (await this.existingMovement(prisma, check.id)) {
      await prisma.checks.update({ where: { id: check.id }, data: { status: 'CLEARED', clearing_date: check.clearing_date ?? effectiveDate } });
      return;
    }
    const account = await prisma.bank_accounts.findUnique({ where: { id: check.bank_account_id } });
    if (!account?.active) {
      this.logger.warn(`[${companyName}] Cheque tercero #${check.check_number}: cuenta de depósito inexistente o inactiva`);
      return;
    }
    if (account.currency_code !== check.currency_code) {
      this.logger.warn(`[${companyName}] Cheque tercero #${check.check_number}: moneda incompatible con la cuenta de depósito`);
      return;
    }

    await prisma.$transaction(async (tx: any) => {
      if (await this.existingMovement(tx, check.id)) return;
      const current = await tx.bank_accounts.findUnique({ where: { id: check.bank_account_id } });
      if (!current?.active || current.currency_code !== check.currency_code) return;
      const amount = Number(check.available_amount ?? check.amount);
      const before = Number(current.balance);
      await tx.bank_account_movements.create({ data: {
        bank_account_id: check.bank_account_id, type: 'COLLECTION', amount,
        currency_code: check.currency_code, exchange_rate: check.exchange_rate, rate_type: check.rate_type,
        converted_amount: check.converted_amount, balance_before: before, balance_after: before + amount,
        description: `Depósito automático cheque tercero #${check.check_number}`,
        reference_type: 'check', reference_id: check.id, payment_id: check.payment_id,
        date: effectiveDate, created_by: check.created_by,
      } });
      await tx.bank_accounts.update({ where: { id: check.bank_account_id }, data: { balance: before + amount, updated_at: new Date() } });
      await recalculateBankAccountLedger(tx, check.bank_account_id);
      await tx.checks.update({ where: { id: check.id }, data: { status: 'CLEARED', available_amount: 0, deposit_date: effectiveDate, clearing_date: effectiveDate, updated_at: new Date() } });
    });
  }
}
