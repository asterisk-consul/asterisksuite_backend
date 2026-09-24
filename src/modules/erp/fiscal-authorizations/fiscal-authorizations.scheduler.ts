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
    const companies = await this.db.getDefaultClient().companies.findMany({
      where: { deleted_at: null, schema_name: { not: null } }, select: { id: true, schema_name: true },
    });
    for (const company of companies) {
      try {
        const client = this.db.getTenantClient(company.schema_name!);
        await this.service.refreshAlerts(client);
      } catch (error) {
        this.logger.warn(`No se pudieron actualizar alertas fiscales de ${company.schema_name}: ${String(error)}`);
      }
    }
  }
}
