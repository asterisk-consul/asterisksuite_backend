import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { WhatsAppNotificationsService } from './whatsapp-notifications.service';

@Injectable()
export class WhatsAppNotificationsScheduler {
  private readonly logger = new Logger(WhatsAppNotificationsScheduler.name);
  private delivering = false;
  private scanningAccounts = false;

  constructor(
    private readonly db: PrismaService,
    private readonly whatsApp: WhatsAppNotificationsService,
  ) {}

  @Cron('*/10 * * * * *')
  async deliverQueuedNotifications() {
    if (!this.whatsApp.isDeliveryEnabled() || this.delivering) return;
    this.delivering = true;
    try {
      await this.whatsApp.deliverNextBatch();
    } catch (error) {
      this.logger.warn(`No se pudo procesar la cola de WhatsApp: ${this.errorText(error)}`);
    } finally {
      this.delivering = false;
    }
  }

  @Cron('0 9 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async enqueueAgedAccountNotifications() {
    if (!this.whatsApp.isDeliveryEnabled() || this.scanningAccounts) return;
    this.scanningAccounts = true;
    const startedAt = Date.now();
    let companiesProcessed = 0;
    let companiesFailed = 0;
    let accountsReviewed = 0;
    let notificationsQueued = 0;
    try {
      const allowedTenants = (process.env.SCHEDULER_TENANT_DATABASES ?? '')
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);
      const today = this.argentinaDate();
      const publicDb = this.db.getDefaultClient();
      let afterId: string | undefined;
      while (true) {
        const companies = await publicDb.companies.findMany({
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
          try {
            const result = await this.db.withTemporaryTenantClient(company.schema_name, tenant =>
              this.whatsApp.enqueueAgedAccountAlerts(company.id, tenant, today),
            );
            companiesProcessed += 1;
            accountsReviewed += result.reviewed;
            notificationsQueued += result.queued;
          } catch (error) {
            companiesFailed += 1;
            this.logger.warn(`Avisos de saldos sin movimiento omitidos para ${company.name}: ${this.errorText(error)}`);
          }
        }
        afterId = companies[companies.length - 1].id;
      }
      this.logger.log(JSON.stringify({
        event: 'whatsapp_account_reminders_complete',
        companiesProcessed,
        companiesFailed,
        accountsReviewed,
        notificationsQueued,
        durationMs: Date.now() - startedAt,
        runtime: this.db.getRuntimeMemoryDiagnostics(),
      }));
    } catch (error) {
      this.logger.error(`Falló el recorrido de saldos para WhatsApp: ${this.errorText(error)}`);
    } finally {
      this.scanningAccounts = false;
    }
  }

  @Cron('0 3 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async purgeCompletedOutbox() {
    if (!this.whatsApp.isDeliveryEnabled()) return;
    try {
      const deleted = await this.whatsApp.purgeOldOutboxRows();
      if (deleted) this.logger.log(`Se depuraron ${deleted} avisos WhatsApp con más de 90 días.`);
    } catch (error) {
      this.logger.warn(`No se pudo depurar la cola de WhatsApp: ${this.errorText(error)}`);
    }
  }

  private argentinaDate() {
    const value = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
    return new Date(`${value}T00:00:00.000Z`);
  }

  private errorText(error: unknown) {
    return error instanceof Error ? error.message : String(error);
  }
}
