import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { StockReservationsService } from './stock-reservations.service';

@Injectable()
export class StockReservationsScheduler {
  private readonly logger = new Logger(StockReservationsScheduler.name);
  private running = false;

  constructor(
    private readonly db: PrismaService,
    private readonly reservations: StockReservationsService,
  ) {}

  // Respaldo para tenants sin actividad. La limpieza habitual ocurre al consultar o usar stock.
  @Cron(process.env.STOCK_RESERVATIONS_RECONCILE_CRON ?? '0 3 * * *', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async releaseExpiredReservations() {
    if (this.running) {
      this.logger.warn('La reconciliación anterior todavía está en ejecución; se omite esta corrida');
      return;
    }
    this.running = true;
    const startedAt = Date.now();
    let tenantsProcessed = 0;
    let tenantsFailed = 0;
    try {
      const allowedTenants = (process.env.SCHEDULER_TENANT_DATABASES ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      const publicClient = this.db.getDefaultClient();
      this.logger.log(
        JSON.stringify({
          event: 'scheduler_start',
          scheduler: 'stock_reservations',
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
          select: { id: true, name: true, schema_name: true },
          orderBy: { id: 'asc' },
          take: 100,
        });
        if (!companies.length) break;

        for (const company of companies) {
          if (!company.schema_name) continue;
          const tenantStartedAt = Date.now();
          try {
            const released = await this.db.withTemporaryTenantClient(company.schema_name, (client) =>
              this.reservations.releaseExpiredForClient(client),
            );
            tenantsProcessed += 1;
            this.logger.log(
              JSON.stringify({
                event: 'scheduler_tenant_complete',
                scheduler: 'stock_reservations',
                tenant: company.name,
                durationMs: Date.now() - tenantStartedAt,
                reservationsReleased: released,
                runtime: this.db.getRuntimeMemoryDiagnostics(),
              }),
            );
            if (released) this.logger.log(`[${company.name}] ${released} reserva(s) vencida(s) liberada(s)`);
          } catch (error) {
            tenantsFailed += 1;
            this.logger.warn(
              JSON.stringify({
                event: 'scheduler_tenant_failed',
                scheduler: 'stock_reservations',
                tenant: company.name,
                durationMs: Date.now() - tenantStartedAt,
                error: String(error),
                runtime: this.db.getRuntimeMemoryDiagnostics(),
              }),
            );
            this.logger.warn(`No se pudieron liberar reservas vencidas de ${company.name}: ${String(error)}`);
          }
        }
        afterId = companies[companies.length - 1].id;
      }
    } catch (error) {
      this.logger.error('Falló la corrida del scheduler de reservas de stock', error);
      throw error;
    } finally {
      this.running = false;
      this.logger.log(
        JSON.stringify({
          event: 'scheduler_complete',
          scheduler: 'stock_reservations',
          at: new Date().toISOString(),
          durationMs: Date.now() - startedAt,
          tenantsProcessed,
          tenantsFailed,
          runtime: this.db.getRuntimeMemoryDiagnostics(),
        }),
      );
    }
  }
}
