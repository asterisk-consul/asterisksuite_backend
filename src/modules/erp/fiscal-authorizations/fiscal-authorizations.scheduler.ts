import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { FiscalAuthorizationsService } from './fiscal-authorizations.service';

@Injectable()
export class FiscalAuthorizationsScheduler {
  private readonly logger = new Logger(FiscalAuthorizationsScheduler.name);

  constructor(private readonly db: PrismaService, private readonly service: FiscalAuthorizationsService) {}

  @Cron('0 9 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async refreshAllTenants() {
    const allowedTenants = (process.env.SCHEDULER_TENANT_DATABASES ?? '')
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    const companies = await this.db.getDefaultClient().companies.findMany({
      where: {
        deleted_at: null,
        schema_name: allowedTenants.length ? { in: allowedTenants } : { not: null },
      },
      select: { id: true, schema_name: true },
    });
    for (const company of companies) {
      try {
        const client = this.db.getTenantClient(company.schema_name!);
        await this.service.refreshAlerts(client);
      } catch (error) {
        const code = (error as { code?: string })?.code;
        if (code === 'P2021' || code === 'P2022') {
          this.logger.warn(
            `Alertas fiscales omitidas para ${company.schema_name}: la base requiere la migración 20260918_fiscal_authorizations`,
          );
          continue;
        }
        this.logger.error(`No se pudieron actualizar alertas fiscales de ${company.schema_name}`, error);
      }
    }
  }
}
