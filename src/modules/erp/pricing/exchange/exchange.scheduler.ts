import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { ExchangeService } from './exchange.service';

@Injectable()
export class ExchangeScheduler {
  private readonly logger = new Logger(ExchangeScheduler.name);

  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly db: PrismaService,
  ) {}

  // Por defecto sincroniza dos veces por hora. La expresión puede ajustarse
  // por ambiente sin recompilar (por ejemplo, para limitar horarios).
  @Cron(process.env.EXCHANGE_SYNC_CRON ?? '*/30 * * * *', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleSyncRates() {
    this.logger.log('Sincronizando cotizaciones...');

    // La cotización es la misma para todos los tenants: se consulta una sola vez.
    const snapshot = await this.exchangeService.fetchRateSnapshot();

    const companies = await this.db.getDefaultClient().companies.findMany({
      where: { deleted_at: null },
      select: { schema_name: true, name: true },
    });

    for (const company of companies) {
      if (!company.schema_name) continue;

      try {
        await this.db.withTemporaryTenantClient(
          company.schema_name,
          (client) => this.exchangeService.syncAllRatesForClient(client, snapshot),
        );
        this.logger.log(`[${company.name}] Cotizaciones sincronizadas`);
      } catch (error) {
        this.logger.error(`[${company.name}] Error sincronizando cotizaciones`, error);
      }
    }
  }
}
