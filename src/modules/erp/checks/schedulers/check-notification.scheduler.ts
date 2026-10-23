import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CheckNotificationScheduler {
  private readonly logger = new Logger(CheckNotificationScheduler.name);
  private running = false;

  constructor(private db: PrismaService) {}

  @Cron('0 9 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async sendCheckNotifications() {
    if (this.running) {
      this.logger.warn('La revisión anterior de cheques todavía está en ejecución; se omite esta corrida');
      return;
    }
    this.running = true;
    const startedAt = Date.now();
    let tenantsProcessed = 0;
    let tenantsFailed = 0;
    let tenantsSkipped = 0;
    try {
      const allowedTenants = (process.env.SCHEDULER_TENANT_DATABASES ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      const publicClient = this.db.getDefaultClient();
      this.logger.log(
        JSON.stringify({
          event: 'scheduler_start',
          scheduler: 'check_notifications',
          at: new Date().toISOString(),
          tenantFilterCount: allowedTenants.length || 'all',
          runtime: this.db.getRuntimeMemoryDiagnostics(),
        }),
      );
      let afterId: string | undefined;
      while (true) {
        const companies = await publicClient.companies.findMany({
          where: {
            deleted_at: null,
            schema_name: allowedTenants.length ? { in: allowedTenants } : { not: null },
            ...(afterId ? { id: { gt: afterId } } : {}),
          },
          select: { id: true, schema_name: true, name: true },
          orderBy: { id: 'asc' },
          take: 100,
        });
        if (!companies.length) break;

        for (const company of companies) {
          if (!company.schema_name) continue;
          const tenantStartedAt = Date.now();
          try {
            const result = await this.db.withTemporaryTenantClient(company.schema_name, (client) =>
              this.notifyTenant(client, company.name),
            );
            tenantsProcessed += 1;
            this.logger.log(
              JSON.stringify({
                event: 'scheduler_tenant_complete',
                scheduler: 'check_notifications',
                tenant: company.name,
                durationMs: Date.now() - tenantStartedAt,
                ...result,
                runtime: this.db.getRuntimeMemoryDiagnostics(),
              }),
            );
          } catch (error) {
            const code = (error as { code?: string })?.code;
            if (code === 'P2021' || code === 'P2022') {
              tenantsSkipped += 1;
              this.logger.warn(
                `Avisos de cheques omitidos para ${company.name}: la base requiere la migración 20260901_checks_partial_application`,
              );
              continue;
            }
            tenantsFailed += 1;
            this.logger.warn(
              JSON.stringify({
                event: 'scheduler_tenant_failed',
                scheduler: 'check_notifications',
                tenant: company.name,
                durationMs: Date.now() - tenantStartedAt,
                error: String(error),
                runtime: this.db.getRuntimeMemoryDiagnostics(),
              }),
            );
            this.logger.error(`Error revisando vencimientos en ${company.name}`, error);
          }
        }
        afterId = companies[companies.length - 1].id;
      }
    } catch (error) {
      this.logger.error('Falló la corrida del scheduler de avisos de cheques', error);
      throw error;
    } finally {
      this.running = false;
      this.logger.log(
        JSON.stringify({
          event: 'scheduler_complete',
          scheduler: 'check_notifications',
          at: new Date().toISOString(),
          durationMs: Date.now() - startedAt,
          tenantsProcessed,
          tenantsFailed,
          tenantsSkipped,
          runtime: this.db.getRuntimeMemoryDiagnostics(),
        }),
      );
    }
  }

  private argentinaDate(daysToAdd = 0) {
    const value = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
    const date = new Date(`${value}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + daysToAdd);
    return date;
  }

  private async notifyTenant(prisma: any, companyName: string) {
    const today = this.argentinaDate();
    const upcomingLimit = this.argentinaDate(2);
    const batchSize = 100;
    let upcomingNotified = 0;
    let overdueReviewed = 0;
    while (true) {
      const upcomingChecks = await prisma.checks.findMany({
        where: {
          status: { in: ['PENDING', 'CONFIRMED'] },
          due_date: { gt: today, lte: upcomingLimit },
          notification_sent: false,
          deleted_at: null,
        },
        select: { id: true, is_own: true, check_number: true, due_date: true },
        orderBy: { id: 'asc' },
        take: batchSize,
      });
      if (!upcomingChecks.length) break;

      for (const check of upcomingChecks) {
        this.logger.log(
          `[${companyName}] Aviso preventivo: cheque ${check.is_own ? 'propio' : 'de tercero'} #${check.check_number} vence ${check.due_date.toISOString().slice(0, 10)}`,
        );
        await prisma.checks.update({ where: { id: check.id }, data: { notification_sent: true } });
        upcomingNotified += 1;
      }
    }

    let afterId: string | undefined;
    while (true) {
      const overdueChecks = await prisma.checks.findMany({
        where: {
          status: { in: ['PENDING', 'CONFIRMED'] },
          due_date: { lte: today },
          deleted_at: null,
          ...(afterId ? { id: { gt: afterId } } : {}),
        },
        select: {
          id: true,
          is_own: true,
          check_number: true,
          due_date: true,
          currency_code: true,
          amount: true,
          bank_account: { select: { balance: true, active: true, currency_code: true } },
        },
        orderBy: { id: 'asc' },
        take: batchSize,
      });
      if (!overdueChecks.length) break;

      this.logger.log(`[${companyName}] ${overdueChecks.length} cheque(s) vencidos requieren una acción`);
      overdueReviewed += overdueChecks.length;
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
      afterId = overdueChecks[overdueChecks.length - 1].id;
    }

    return { upcomingNotified, overdueReviewed };
  }
}
