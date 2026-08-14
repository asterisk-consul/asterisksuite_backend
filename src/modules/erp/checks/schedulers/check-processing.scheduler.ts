import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CheckProcessingScheduler {
  private readonly logger = new Logger(CheckProcessingScheduler.name);

  constructor(private db: PrismaService) {}

  @Cron('0 10 * * *', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async processChecks() {
    this.logger.log('Ejecutando scheduler de procesamiento de cheques...');

    const companies = await this.db.getDefaultClient().companies.findMany({
      where: { deleted_at: null },
      select: { schema_name: true, name: true },
    });

    for (const company of companies) {
      if (!company.schema_name) continue;

      try {
        await this.processChecksForTenant(company.schema_name, company.name);
      } catch (error) {
        this.logger.error(`Error procesando cheques en tenant ${company.schema_name}`, error);
      }
    }
  }

  private async processChecksForTenant(tenantDb: string, companyName: string) {
    const prisma = this.db.getTenantClient(tenantDb);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checksToProcess = await prisma.checks.findMany({
      where: {
        is_own: true,
        status: { in: ['PENDING'] },
        payment_date: { gte: today, lt: tomorrow },
        deleted_at: null,
      },
    });

    if (checksToProcess.length === 0) return;

    this.logger.log(`[${companyName}] Cheques a procesar hoy: ${checksToProcess.length}`);

    for (const check of checksToProcess) {
      if (!check.bank_account_id) {
        this.logger.warn(`[${companyName}] Cheque #${check.check_number}: Sin cuenta bancaria, saltando...`);
        continue;
      }

      const bankAccount = await prisma.bank_accounts.findUnique({
        where: { id: check.bank_account_id },
      });

      if (!bankAccount || !bankAccount.active) {
        this.logger.warn(`[${companyName}] Cheque #${check.check_number}: Cuenta inactiva, saltando...`);
        continue;
      }

      if (Number(bankAccount.balance) >= Number(check.amount)) {
        this.logger.log(`[${companyName}] Cheque #${check.check_number}: Fondos suficientes, procesando...`);

        await prisma.$transaction(async (tx: any) => {
          const currentBalance = Number(bankAccount.balance);
          const amount = Number(check.amount);

          await tx.checks.update({
            where: { id: check.id },
            data: { status: 'CLEARED', clearing_date: today },
          });

          await tx.bank_account_movements.create({
            data: {
              bank_account_id: check.bank_account_id!,
              type: 'CHECK_ISSUED',
              amount: -amount,
              currency_code: check.currency_code,
              exchange_rate: check.exchange_rate,
              rate_type: check.rate_type,
              converted_amount: check.converted_amount,
              balance_before: currentBalance,
              balance_after: currentBalance - amount,
              description: `Cheque #${check.check_number} cobrado por scheduler`,
              reference_type: 'check',
              reference_id: check.id,
              payment_id: check.payment_id,
              date: today,
            },
          });

          await tx.bank_accounts.update({
            where: { id: check.bank_account_id! },
            data: { balance: { decrement: amount } },
          });
        });
      } else {
        this.logger.warn(`[${companyName}] Cheque #${check.check_number}: Fondos insuficientes, rechazando...`);

        await prisma.checks.update({
          where: { id: check.id },
          data: { status: 'BOUNCED' },
        });

        if (check.payment_id) {
          const payment = await prisma.payments.findUnique({
            where: { id: check.payment_id },
          });

          if (payment?.party_id) {
            const currentAccount = await prisma.current_accounts.findUnique({
              where: { party_id: payment.party_id },
            });

            if (currentAccount) {
              const currentBalance = Number(currentAccount.balance);
              const amount = Number(check.amount);

              await prisma.current_account_entries.create({
                data: {
                  current_account_id: currentAccount.id,
                  type: 'CHECK_BOUNCED',
                  amount: amount,
                  currency_code: check.currency_code,
                  balance_before: currentBalance,
                  balance_after: currentBalance + amount,
                  description: `Cheque #${check.check_number} rechazado - reversión`,
                  reference_type: 'check',
                  reference_id: check.id,
                  payment_id: check.payment_id,
                  date: today,
                },
              });

              await prisma.current_accounts.update({
                where: { id: currentAccount.id },
                data: { balance: { increment: amount } },
              });
            }
          }
        }
      }
    }
  }
}
