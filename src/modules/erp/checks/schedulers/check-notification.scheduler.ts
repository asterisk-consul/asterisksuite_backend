import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { WhatsAppNotificationsService } from '@/modules/notifications/whatsapp-notifications.service';

@Injectable()
export class CheckNotificationScheduler {
  private readonly logger = new Logger(CheckNotificationScheduler.name);
  private running = false;

  constructor(
    private db: PrismaService,
    private readonly whatsApp: WhatsAppNotificationsService,
  ) {}

  @Cron('0 9 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async sendCheckNotifications() {
    if (this.running) {
      this.logger.warn('La revisión anterior de cheques todavía está en ejecución; se omite esta corrida');
      return;
    }
    this.running = true;
    const startedAt = Date.now();
    let tenantsProcessed = 0;
    let tenantsFailed = 0;
    let tenantsSkipped = 0;
    try {
      const allowedTenants = (process.env.SCHEDULER_TENANT_DATABASES ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      const publicClient = this.db.getDefaultClient();
      this.logger.log(
        JSON.stringify({
          event: 'scheduler_start',
          scheduler: 'check_notifications',
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
          select: { id: true, schema_name: true, name: true },
          orderBy: { id: 'asc' },
          take: 100,
        });
        if (!companies.length) break;

        for (const company of companies) {
          if (!company.schema_name) continue;
          const tenantStartedAt = Date.now();
          try {
            const memberships = await publicClient.company_users.findMany({
              where: { company_id: company.id, user: { active: true, deleted_at: null } },
              select: { user_id: true, role: true },
            });
            const memberIds = new Set<string>(memberships.map((membership) => String(membership.user_id)));
            const administrators = memberships
              .filter((membership) => membership.role === 'OWNER' || membership.role === 'ADMIN')
              .map((membership) => membership.user_id);
            const result = await this.db.withTemporaryTenantClient(company.schema_name, (client) =>
              this.notifyTenant(client, company.id, company.name, administrators, memberIds),
            );
            tenantsProcessed += 1;
            this.logger.log(
              JSON.stringify({
                event: 'scheduler_tenant_complete',
                scheduler: 'check_notifications',
                tenant: company.name,
                durationMs: Date.now() - tenantStartedAt,
                ...result,
                runtime: this.db.getRuntimeMemoryDiagnostics(),
              }),
            );
          } catch (error) {
            const code = (error as { code?: string })?.code;
            if (code === 'P2021' || code === 'P2022') {
              tenantsSkipped += 1;
              this.logger.warn(
                `Avisos de cheques omitidos para ${company.name}: la base requiere la migración 20260901_checks_partial_application`,
              );
              continue;
            }
            tenantsFailed += 1;
            this.logger.warn(
              JSON.stringify({
                event: 'scheduler_tenant_failed',
                scheduler: 'check_notifications',
                tenant: company.name,
                durationMs: Date.now() - tenantStartedAt,
                error: String(error),
                runtime: this.db.getRuntimeMemoryDiagnostics(),
              }),
            );
            this.logger.error(`Error revisando vencimientos en ${company.name}`, error);
          }
        }
        afterId = companies[companies.length - 1].id;
      }
    } catch (error) {
      this.logger.error('Falló la corrida del scheduler de avisos de cheques', error);
      throw error;
    } finally {
      this.running = false;
      this.logger.log(
        JSON.stringify({
          event: 'scheduler_complete',
          scheduler: 'check_notifications',
          at: new Date().toISOString(),
          durationMs: Date.now() - startedAt,
          tenantsProcessed,
          tenantsFailed,
          tenantsSkipped,
          runtime: this.db.getRuntimeMemoryDiagnostics(),
        }),
      );
    }
  }

  private argentinaDate(daysToAdd = 0) {
    const value = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
    const date = new Date(`${value}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + daysToAdd);
    return date;
  }

  private async notifyTenant(
    prisma: any,
    companyId: string,
    companyName: string,
    administratorIds: string[],
    memberIds: Set<string>,
  ) {
    const today = this.argentinaDate();
    const upcomingLimit = this.argentinaDate(2);
    const batchSize = 100;
    let upcomingNotified = 0;
    let upcomingReviewed = 0;
    let overdueReviewed = 0;
    let remindersCreatedOrReopened = 0;
    let remindersResolved = 0;
    let upcomingAfterId: string | undefined;
    const upcomingDigest: string[] = [];
    while (true) {
      const upcomingChecks = await prisma.checks.findMany({
        where: {
          status: { in: ['PENDING', 'CONFIRMED'] },
          due_date: { gt: today, lte: upcomingLimit },
          deleted_at: null,
          ...(upcomingAfterId ? { id: { gt: upcomingAfterId } } : {}),
        },
        select: {
          id: true,
          is_own: true,
          check_number: true,
          due_date: true,
          notification_sent: true,
          created_by: true,
          payment: { select: { created_by: true } },
          payment_allocations: {
            select: { payment: { select: { created_by: true } } },
          },
        },
        orderBy: { id: 'asc' },
        take: batchSize,
      });
      if (!upcomingChecks.length) break;
      upcomingReviewed += upcomingChecks.length;
      for (const check of upcomingChecks) {
        const dueDate = check.due_date.toISOString().slice(0, 10);
        if (upcomingDigest.length < 8) {
          upcomingDigest.push(`• Cheque ${check.is_own ? 'propio' : 'de tercero'} #${check.check_number}: vence el ${dueDate}`);
        }

        const recipients = [...new Set([
          ...administratorIds,
          check.created_by,
          check.payment?.created_by,
          ...check.payment_allocations.map((allocation: any) => allocation.payment?.created_by),
        ].filter((userId): userId is string => Boolean(userId) && memberIds.has(userId)))];
        const title = check.is_own ? 'Cheque propio próximo a vencer' : 'Cheque de tercero próximo a vencer';
        const message = check.is_own
          ? `El cheque propio #${check.check_number} vence el ${dueDate}. Prepará la revisión del saldo y el registro del débito cuando se acredite.`
          : `El cheque de tercero #${check.check_number} vence el ${dueDate}. Prepará su depósito, cobro por caja o aplicación a un pago.`;
        const reminderData = {
          actor_user_id: null,
          type: 'CHECK_DUE',
          title,
          message,
          target_path: '/erp/treasury/checks?alert=upcoming&days=2',
          target_type: 'CHECK_DUE',
          target_id: check.id,
        };

        for (const recipientUserId of recipients) {
          const existingReminder = await prisma.user_notifications.findFirst({
            where: {
              recipient_user_id: recipientUserId,
              type: 'CHECK_DUE',
              target_type: 'CHECK_DUE',
              target_id: check.id,
            },
            select: { id: true },
          });
          if (existingReminder) {
            await prisma.user_notifications.update({ where: { id: existingReminder.id }, data: reminderData });
          } else {
            await prisma.user_notifications.create({
              data: {
                ...reminderData,
                recipient_user_id: recipientUserId,
                created_at: new Date(),
                read_at: null,
              },
            });
          }
          remindersCreatedOrReopened += 1;
        }

        if (!check.notification_sent) {
          await prisma.checks.update({ where: { id: check.id }, data: { notification_sent: true } });
        }
        upcomingNotified += 1;
        this.logger.log(`[${companyName}] Aviso preventivo: cheque ${check.is_own ? 'propio' : 'de tercero'} #${check.check_number} vence ${dueDate}`);
      }
      upcomingAfterId = upcomingChecks[upcomingChecks.length - 1].id;
    }

    if (upcomingReviewed > 0) {
      try {
        await this.whatsApp.enqueueConfiguredDigest({
          companyId,
          eventType: 'CHECK_DUE',
          deduplicationKey: `check-due-digest:${this.argentinaDate().toISOString().slice(0, 10)}`,
          title: 'Cheques próximos a vencer',
          message: [
            `Hay ${upcomingReviewed} cheque(s) pendiente(s) con vencimiento dentro de 2 días.`,
            ...upcomingDigest,
            ...(upcomingReviewed > upcomingDigest.length ? [`• Y ${upcomingReviewed - upcomingDigest.length} cheque(s) más.`] : []),
          ].join('\n'),
          targetPath: '/erp/treasury/checks',
        });
      } catch (error) {
        this.logger.warn(`No se pudo encolar el resumen de cheques próximos a vencer para ${companyName}: ${String(error)}`);
      }
    }

    let afterId: string | undefined;
    const overdueDigest: string[] = [];
    while (true) {
      const overdueChecks = await prisma.checks.findMany({
        where: {
          status: { in: ['PENDING', 'CONFIRMED'] },
          due_date: { lte: today },
          deleted_at: null,
          ...(afterId ? { id: { gt: afterId } } : {}),
        },
        select: {
          id: true,
          is_own: true,
          check_number: true,
          due_date: true,
          currency_code: true,
          amount: true,
          created_by: true,
          payment: { select: { id: true, number: true, created_by: true } },
          payment_allocations: {
            select: { payment: { select: { id: true, number: true, type: true, created_by: true } } },
          },
          bank_account: { select: { balance: true, active: true, currency_code: true } },
        },
        orderBy: { id: 'asc' },
        take: batchSize,
      });
      if (!overdueChecks.length) break;

      this.logger.log(`[${companyName}] ${overdueChecks.length} cheque(s) con vencimiento hoy o anterior requieren una acción`);
      overdueReviewed += overdueChecks.length;
      for (const check of overdueChecks) {
        const checkDueDate = check.due_date.toISOString().slice(0, 10);
        if (overdueDigest.length < 8) {
          overdueDigest.push(`• Cheque ${check.is_own ? 'propio' : 'de tercero'} #${check.check_number}: ${checkDueDate === today.toISOString().slice(0, 10) ? 'vence hoy' : `venció el ${checkDueDate}`}`);
        }
        const linkedPayments = [
          ...(check.payment ? [check.payment] : []),
          ...check.payment_allocations.map((allocation: any) => allocation.payment),
        ];
        const creatorIds = [
          check.created_by,
          ...linkedPayments.map((payment: any) => payment.created_by),
        ].filter((userId): userId is string => Boolean(userId) && memberIds.has(userId));
        const recipients = [...new Set([...administratorIds, ...creatorIds])];
        const dueDate = checkDueDate;
        const dueToday = dueDate === today.toISOString().slice(0, 10);
        const dueState = dueToday ? 'vence hoy' : `venció el ${dueDate}`;
        const linkedPaymentLabel = linkedPayments[0]
          ? `${linkedPayments[0].type === 'COLLECTION' ? ' · Cobro' : ' · Pago'} #${linkedPayments[0].number}`
          : '';
        const title = check.is_own
          ? dueToday ? 'Débito de cheque propio para verificar hoy' : 'Resolver cheque propio vencido'
          : dueToday ? 'Cheque de tercero vence hoy' : 'Cheque vencido pendiente de depósito';
        const message = check.is_own
          ? `El cheque propio #${check.check_number}${linkedPaymentLabel} ${dueState}. Registrá su débito cuando aparezca en el banco o su pago desde caja si corresponde.`
          : `El cheque de tercero #${check.check_number}${linkedPaymentLabel} ${dueState}. Depositá, cobrá por caja o registrá su entrega a un proveedor.`;

        for (const recipientUserId of recipients) {
          const existingReminder = await prisma.user_notifications.findFirst({
            where: {
              recipient_user_id: recipientUserId,
              type: 'CHECK_OVERDUE',
              target_type: 'CHECK_OVERDUE',
              target_id: check.id,
            },
            select: { id: true },
          });
          const reminderData = {
            actor_user_id: null,
            type: 'CHECK_OVERDUE',
            title,
            message,
            target_path: check.is_own
              ? '/erp/treasury/checks?alert=own'
              : '/erp/treasury/checks?alert=third-party',
            target_type: 'CHECK_OVERDUE',
            target_id: check.id,
          };
          if (existingReminder) {
            // Refresh the copy without reopening a reminder that the user has
            // already hidden for today.
            await prisma.user_notifications.update({ where: { id: existingReminder.id }, data: reminderData });
          } else {
            await prisma.user_notifications.create({
              data: { ...reminderData, recipient_user_id: recipientUserId, created_at: new Date(), read_at: null },
            });
          }
          remindersCreatedOrReopened += 1;
        }

        if (!check.is_own) {
          this.logger.log(
            `[${companyName}] Aviso operativo: cheque de tercero #${check.check_number} vencido; requiere decidir depósito, cobro por caja o entrega a proveedor`,
          );
          continue;
        }
        const account = check.bank_account;
        const hasEnoughFunds = Boolean(
          account?.active &&
          account.currency_code === check.currency_code &&
          Number(account.balance) >= Number(check.amount),
        );
        this.logger.log(
          `[${companyName}] Aviso operativo: cheque propio #${check.check_number} vencido; ` +
            `${hasEnoughFunds ? 'fondos suficientes' : 'requiere revisión de cuenta o fondos'}`,
        );
      }
      afterId = overdueChecks[overdueChecks.length - 1].id;
    }
    if (overdueReviewed > 0) {
      try {
        await this.whatsApp.enqueueConfiguredDigest({
          companyId,
          eventType: 'CHECK_OVERDUE',
          deduplicationKey: `check-overdue-digest:${this.argentinaDate().toISOString().slice(0, 10)}`,
          title: 'Cheques vencidos o con vencimiento hoy',
          message: [
            `Hay ${overdueReviewed} cheque(s) vencido(s) que requieren una acción.`,
            ...overdueDigest,
            ...(overdueReviewed > overdueDigest.length ? [`• Y ${overdueReviewed - overdueDigest.length} cheque(s) más.`] : []),
          ].join('\n'),
          targetPath: '/erp/treasury/checks',
        });
      } catch (error) {
        this.logger.warn(`No se pudo encolar el resumen de cheques vencidos para ${companyName}: ${String(error)}`);
      }
    }

    // Remove reminders when their check is resolved or leaves its reminder window.
    let notificationAfterId: string | undefined;
    while (true) {
      const reminders = await prisma.user_notifications.findMany({
        where: {
          type: { in: ['CHECK_DUE', 'CHECK_OVERDUE'] },
          target_type: { in: ['CHECK_DUE', 'CHECK_OVERDUE'] },
          ...(notificationAfterId ? { id: { gt: notificationAfterId } } : {}),
        },
        select: { id: true, type: true, target_id: true },
        orderBy: { id: 'asc' },
        take: batchSize,
      });
      if (!reminders.length) break;

      const checkIds = [...new Set(reminders.map((reminder) => reminder.target_id).filter(Boolean))] as string[];
      const activeChecks = checkIds.length
        ? await prisma.checks.findMany({
            where: {
              id: { in: checkIds },
              status: { in: ['PENDING', 'CONFIRMED'] },
              OR: [
                { due_date: { lte: today } },
                { due_date: { gt: today, lte: upcomingLimit } },
              ],
              deleted_at: null,
            },
            select: { id: true, due_date: true },
          })
        : [];
      const activeOverdueIds = new Set(activeChecks
        .filter((check: any) => check.due_date <= today)
        .map((check: any) => check.id));
      const activeUpcomingIds = new Set(activeChecks
        .filter((check: any) => check.due_date > today && check.due_date <= upcomingLimit)
        .map((check: any) => check.id));
      const resolvedIds = reminders.filter((reminder) => {
        const activeIds = reminder.type === 'CHECK_DUE' ? activeUpcomingIds : activeOverdueIds;
        return !reminder.target_id || !activeIds.has(reminder.target_id);
      })
        .map((reminder) => reminder.id);
      if (resolvedIds.length) {
        const result = await prisma.user_notifications.deleteMany({
          where: { id: { in: resolvedIds } },
        });
        remindersResolved += result.count;
      }
      notificationAfterId = reminders[reminders.length - 1].id;
    }

    return { upcomingNotified, overdueReviewed, remindersCreatedOrReopened, remindersResolved };
  }
}
