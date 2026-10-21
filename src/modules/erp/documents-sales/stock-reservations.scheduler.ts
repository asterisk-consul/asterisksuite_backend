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
    try {
      const allowedTenants = (process.env.SCHEDULER_TENANT_DATABASES ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      const companies = await this.db.getDefaultClient().companies.findMany({
        where: {
          deleted_at: null,
          schema_name: allowedTenants.length ? { in: allowedTenants } : { not: null },
        },
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
    } finally {
      this.running = false;
    }
  }
}
