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

  @Cron('0 13 * * 1-5', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleSyncRates() {
    this.logger.log('Sincronizando cotizaciones...');

    const companies = await this.db.getDefaultClient().companies.findMany({
      where: { deleted_at: null },
      select: { db_name: true, name: true },
    });

    for (const company of companies) {
      if (!company.db_name) continue;

      try {
        const prisma = this.db.getTenantClient(company.db_name);
        await this.exchangeService.syncAllRatesForClient(prisma);
        this.logger.log(`[${company.name}] Cotizaciones sincronizadas`);
      } catch (error) {
        this.logger.error(`[${company.name}] Error sincronizando cotizaciones`, error);
      }
    }
  }
}
