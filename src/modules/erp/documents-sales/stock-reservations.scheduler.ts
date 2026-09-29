import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { StockReservationsService } from './stock-reservations.service';

@Injectable()
export class StockReservationsScheduler {
  private readonly logger = new Logger(StockReservationsScheduler.name);

  constructor(
    private readonly db: PrismaService,
    private readonly reservations: StockReservationsService,
  ) {}

  @Cron('15 * * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async releaseExpiredReservations() {
    const companies = await this.db.getDefaultClient().companies.findMany({
      where: { deleted_at: null, schema_name: { not: null } },
      select: { name: true, schema_name: true },
    });

    for (const company of companies) {
      try {
        const released = await this.reservations.releaseExpiredForClient(
          this.db.getTenantClient(company.schema_name!),
        );
        if (released) this.logger.log(`[${company.name}] ${released} reserva(s) vencida(s) liberada(s)`);
      } catch (error) {
        this.logger.warn(`No se pudieron liberar reservas vencidas de ${company.name}: ${String(error)}`);
      }
    }
  }
}
