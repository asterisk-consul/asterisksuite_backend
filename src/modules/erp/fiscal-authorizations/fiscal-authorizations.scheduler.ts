import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { FiscalAuthorizationsService } from './fiscal-authorizations.service';

@Injectable()
export class FiscalAuthorizationsScheduler {
  private readonly logger = new Logger(FiscalAuthorizationsScheduler.name);
  private running = false;

  constructor(
    private readonly db: PrismaService,
    private readonly service: FiscalAuthorizationsService,
  ) {}

  @Cron('0 9 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async refreshAllTenants() {
    if (this.running) {
      this.logger.warn(
        'La actualización anterior de alertas fiscales todavía está en ejecución; se omite esta corrida',
      );
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
          scheduler: 'fiscal_authorizations',
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
            const alerts = await this.db.withTemporaryTenantClient(company.schema_name, (client) =>
              this.service.refreshAlerts(client),
            );
            tenantsProcessed += 1;
            this.logger.log(
              JSON.stringify({
                event: 'scheduler_tenant_complete',
                scheduler: 'fiscal_authorizations',
                tenant: company.name,
                durationMs: Date.now() - tenantStartedAt,
                unreadAlertsReturned: alerts.length,
                runtime: this.db.getRuntimeMemoryDiagnostics(),
              }),
            );
          } catch (error) {
            const code = (error as { code?: string })?.code;
            if (code === 'P2021' || code === 'P2022') {
              tenantsSkipped += 1;
              this.logger.warn(
                `Alertas fiscales omitidas para ${company.schema_name}: la base requiere la migración 20260918_fiscal_authorizations`,
              );
              continue;
            }
            tenantsFailed += 1;
            this.logger.warn(
              JSON.stringify({
                event: 'scheduler_tenant_failed',
                scheduler: 'fiscal_authorizations',
                tenant: company.name,
                durationMs: Date.now() - tenantStartedAt,
                error: String(error),
                runtime: this.db.getRuntimeMemoryDiagnostics(),
              }),
            );
            this.logger.error(`No se pudieron actualizar alertas fiscales de ${company.schema_name}`, error);
          }
        }
        afterId = companies[companies.length - 1].id;
      }
    } catch (error) {
      this.logger.error('Falló la corrida del scheduler de autorizaciones fiscales', error);
      throw error;
    } finally {
      this.running = false;
      this.logger.log(
        JSON.stringify({
          event: 'scheduler_complete',
          scheduler: 'fiscal_authorizations',
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
}
