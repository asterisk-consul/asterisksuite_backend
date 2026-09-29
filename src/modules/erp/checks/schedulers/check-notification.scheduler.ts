import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CheckNotificationScheduler {
  private readonly logger = new Logger(CheckNotificationScheduler.name);

  constructor(private db: PrismaService) {}

  @Cron('0 9 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async sendCheckNotifications() {
    const companies = await this.db.getDefaultClient().companies.findMany({
      where: { deleted_at: null },
      select: { schema_name: true, name: true },
    });
    for (const company of companies) {
      if (!company.schema_name) continue;
      try {
        await this.notifyTenant(company.schema_name, company.name);
      } catch (error) {
        this.logger.error(`Error revisando vencimientos en ${company.name}`, error);
      }
    }
  }

  private argentinaDate(daysToAdd = 0) {
    const value = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date());
    const date = new Date(`${value}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + daysToAdd);
    return date;
  }

  private async notifyTenant(tenantDb: string, companyName: string) {
    const prisma = this.db.getTenantClient(tenantDb);
    const today = this.argentinaDate();
    const upcomingChecks = await prisma.checks.findMany({
      where: {
        status: { in: ['PENDING', 'CONFIRMED'] },
        due_date: { gt: today, lte: this.argentinaDate(2) },
        notification_sent: false,
        deleted_at: null,
      },
    });
    for (const check of upcomingChecks) {
      this.logger.log(
        `[${companyName}] Aviso preventivo: cheque ${check.is_own ? 'propio' : 'de tercero'} #${check.check_number} vence ${check.due_date.toISOString().slice(0, 10)}`,
      );
      await prisma.checks.update({ where: { id: check.id }, data: { notification_sent: true } });
    }

    const overdueChecks = await prisma.checks.findMany({
      where: {
        status: { in: ['PENDING', 'CONFIRMED'] },
        due_date: { lte: today },
        deleted_at: null,
      },
      include: { bank_account: { select: { balance: true, active: true, currency_code: true } } },
    });
    if (overdueChecks.length) this.logger.log(`[${companyName}] ${overdueChecks.length} cheque(s) vencidos requieren una acción`);
    for (const check of overdueChecks) {
      if (!check.is_own) {
        this.logger.log(
          `[${companyName}] Aviso operativo: cheque de tercero #${check.check_number} vencido; requiere decidir depósito, cobro por caja o entrega a proveedor`,
        );
        continue;
      }
      const account = check.bank_account;
      const hasEnoughFunds = Boolean(
        account?.active &&
        account.currency_code === check.currency_code &&
        Number(account.balance) >= Number(check.amount),
      );
      this.logger.log(
        `[${companyName}] Aviso operativo: cheque propio #${check.check_number} vencido; ` +
        `${hasEnoughFunds ? 'fondos suficientes' : 'requiere revisión de cuenta o fondos'}`,
      );
    }
  }
}
