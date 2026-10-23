import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { ExchangeService } from './exchange.service';

@Injectable()
export class ExchangeScheduler {
  private readonly logger = new Logger(ExchangeScheduler.name);
  private readonly synchronizedFingerprintByTenant = new Map<string, string>();
  private running = false;

  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly db: PrismaService,
  ) {}

  // Por defecto sincroniza una vez al día a las 15:00 de Argentina.
  // El horario puede ajustarse por ambiente sin recompilar.
  @Cron(process.env.EXCHANGE_SYNC_CRON ?? '0 15 * * *', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleSyncRates() {
    if (this.running) {
      this.logger.warn('La sincronización anterior todavía está en ejecución; se omite esta corrida');
      return;
    }
    this.running = true;
    try {
      this.logger.log('Sincronizando cotizaciones...');

      // La cotización es la misma para todos los tenants: se consulta una sola vez.
      const snapshot = await this.exchangeService.fetchRateSnapshot();
      const fingerprint = this.snapshotFingerprint(snapshot);

      const allowedTenants = (process.env.SCHEDULER_TENANT_DATABASES ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      const companies = await this.db.getDefaultClient().companies.findMany({
        where: {
          deleted_at: null,
          schema_name: allowedTenants.length ? { in: allowedTenants } : { not: null },
        },
        select: { schema_name: true, name: true },
      });

      for (const company of companies) {
        if (!company.schema_name) continue;

        if (this.synchronizedFingerprintByTenant.get(company.schema_name) === fingerprint) {
          continue;
        }

        const startedAt = Date.now();
        const memoryBefore = this.memorySnapshot();
        try {
          await this.exchangeService.syncAllRatesForClient(this.db.getTenantClient(company.schema_name), snapshot);
          this.synchronizedFingerprintByTenant.set(company.schema_name, fingerprint);
          this.logger.log(JSON.stringify({
            event: 'exchange_tenant_sync_completed',
            company: company.name,
            durationMs: Date.now() - startedAt,
            memoryBefore,
            memoryAfter: this.memorySnapshot(),
          }));
        } catch (error) {
          this.logger.error(JSON.stringify({
            event: 'exchange_tenant_sync_failed',
            company: company.name,
            durationMs: Date.now() - startedAt,
            memoryBefore,
            memoryAfter: this.memorySnapshot(),
          }), error);
        }
      }
    } finally {
      this.running = false;
    }
  }

  private snapshotFingerprint(snapshot: Awaited<ReturnType<ExchangeService['fetchRateSnapshot']>>) {
    const values = [...snapshot.official, ...snapshot.dollars]
      .map((quote) => `${quote.moneda}:${quote.casa}:${quote.venta}`)
      .sort();
    return values.join('|');
  }

  private memorySnapshot() {
    const memory = process.memoryUsage();
    const mb = (bytes: number) => Math.round((bytes / 1024 / 1024) * 10) / 10;
    return {
      rssMb: mb(memory.rss),
      heapUsedMb: mb(memory.heapUsed),
      heapTotalMb: mb(memory.heapTotal),
      externalMb: mb(memory.external),
      tenantClients: this.db.getPoolDiagnostics().tenantClients,
    };
  }
}
