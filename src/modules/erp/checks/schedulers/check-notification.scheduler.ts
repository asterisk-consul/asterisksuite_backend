import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CheckNotificationScheduler {
  private readonly logger = new Logger(CheckNotificationScheduler.name);

  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  @Cron('0 9 * * *')
  async sendCheckNotifications() {
    this.logger.log('Ejecutando scheduler de notificación de cheques...');

    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);

    const checksNeedingNotification = await this.prisma.checks.findMany({
      where: {
        is_own: true,
        status: 'PENDING',
        payment_date: { lte: twoDaysFromNow, gte: today },
        notification_sent: false,
        deleted_at: null,
      },
    });

    this.logger.log(`Cheques pendientes de notificación: ${checksNeedingNotification.length}`);

    for (const check of checksNeedingNotification) {
      let availableFunds = 0;

      if (check.bank_account_id) {
        const bankAccount = await this.prisma.bank_accounts.findUnique({
          where: { id: check.bank_account_id },
        });
        availableFunds = Number(bankAccount?.balance ?? 0);
      }

      const hasEnoughFunds = availableFunds >= Number(check.amount);

      this.logger.log(
        `Cheque #${check.check_number}: ` +
        `Monto: $${check.amount}, Fondos: $${availableFunds}, ` +
        `${hasEnoughFunds ? 'Fondos suficientes' : 'Fondos insuficientes'}`,
      );

      await this.prisma.checks.update({
        where: { id: check.id },
        data: { notification_sent: true },
      });
    }
  }
}
