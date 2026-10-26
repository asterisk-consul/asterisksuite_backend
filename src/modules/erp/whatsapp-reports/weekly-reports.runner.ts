import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ManagementReportsService } from '../management-reports/management-reports.service';
import { OpenWaClient } from './openwa.client';
import { createWhatsAppReportCaption } from './whatsapp-report-messages';

export const WHATSAPP_REPORTS_TIME_ZONE = 'America/Argentina/Buenos_Aires';
const SETTINGS_BATCH_SIZE = 25;
const STALE_RUN_MS = 30 * 60 * 1000;

type ReportKind = 'consolidated' | 'inventory';
type WeeklyRunOptions = { dryRun?: boolean; companyId?: string };

@Injectable()
export class WeeklyWhatsAppReportsRunner {
  private readonly logger = new Logger(WeeklyWhatsAppReportsRunner.name);

  constructor(
    private readonly db: PrismaService,
    private readonly reports: ManagementReportsService,
    private readonly openWa: OpenWaClient,
  ) {}

  async run(options: WeeklyRunOptions = {}) {
    const period = previousFullWeek(new Date(), WHATSAPP_REPORTS_TIME_ZONE);
    const publicDb = this.db.getDefaultClient();
    let cursor: string | undefined;
    let processedReports = 0;
    let skippedReports = 0;
    let failedReports = 0;

    this.logger.log(`Inicio de reportes WhatsApp; período ${period.from} a ${period.to}; zona ${WHATSAPP_REPORTS_TIME_ZONE}${options.dryRun ? '; simulación' : ''}`);
    if (!options.dryRun) this.openWa.assertReady();

    while (true) {
      const settings = await publicDb.company_whatsapp_report_settings.findMany({
        where: {
          enabled: true,
          company: { deleted_at: null, subdomain: { not: null } },
          ...(options.companyId ? { company_id: options.companyId } : {}),
        },
        include: { company: { select: { id: true, name: true } } },
        orderBy: { company_id: 'asc' },
        take: SETTINGS_BATCH_SIZE,
        ...(cursor ? { cursor: { company_id: cursor }, skip: 1 } : {}),
      });
      if (!settings.length) break;

      for (const setting of settings) {
        const selectedCompanyIds = readCompanyIds(setting.selected_company_ids, setting.company_id);
        const reportTasks: Array<{ kind: ReportKind; enabled: boolean; groupId: string | null }> = [
          { kind: 'consolidated', enabled: setting.consolidated_enabled, groupId: setting.consolidated_group_id },
          { kind: 'inventory', enabled: setting.inventory_enabled, groupId: setting.inventory_group_id },
        ];

        for (const task of reportTasks) {
          if (!task.enabled) continue;
          if (!setting.configured_by) {
            this.logger.error(`Empresa ${setting.company.name}: no tiene usuario configurador registrado.`);
            failedReports += 1;
            continue;
          }
          if (!options.dryRun) {
            const claimed = await this.claimRun(setting.company_id, task.kind, period.from, period.to);
            if (!claimed) {
              skippedReports += 1;
              this.logger.log(`Omitido ${task.kind} de ${setting.company.name}: ya enviado o en ejecución.`);
              continue;
            }
          }

          try {
            if (!task.groupId) throw new Error(`No hay un grupo configurado para el informe ${task.kind}.`);
            const file = await this.reports.exportConsolidatedReport(
              {
                company_ids: selectedCompanyIds,
                date_from: period.from,
                date_to: period.to,
                view: task.kind,
                format: 'pdf',
              },
              setting.configured_by,
            );

            if (options.dryRun) {
              this.logger.log(`Simulación ${task.kind} · ${setting.company.name} · ${file.filename} · ${file.buffer.length} bytes`);
              processedReports += 1;
              continue;
            }

            const sendResult = await this.openWa.sendDocument(
              task.groupId,
              file.filename,
              createWhatsAppReportCaption(task.kind, setting.company.name, period, false, selectedCompanyIds.length),
              file.buffer,
              `weekly-report-${setting.company_id}-${task.kind}-${period.from}`,
            );
            await this.finishRun(setting.company_id, task.kind, period.from, period.to, {
              status: 'SENT',
              message_id: sendResult?.messageId ?? null,
              sent_at: new Date(),
              last_error: null,
            });
            processedReports += 1;
            this.logger.log(`Enviado ${task.kind} · ${setting.company.name} · ${file.filename}`);
          } catch (error) {
            failedReports += 1;
            const message = safeErrorMessage(error);
            this.logger.error(`Falló ${task.kind} · ${setting.company.name}: ${message}`);
            if (!options.dryRun) {
              await this.finishRun(setting.company_id, task.kind, period.from, period.to, {
                status: 'FAILED',
                last_error: message.slice(0, 2000),
              });
            }
          }
        }
      }

      cursor = settings[settings.length - 1].company_id;
      if (settings.length < SETTINGS_BATCH_SIZE) break;
    }

    this.logger.log(`Fin de reportes WhatsApp; enviados/simulados=${processedReports}, omitidos=${skippedReports}, fallidos=${failedReports}.`);
    if (failedReports > 0) throw new Error(`Fallaron ${failedReports} reporte(s) de WhatsApp.`);
  }

  private async claimRun(companyId: string, kind: ReportKind, from: string, to: string) {
    const publicDb = this.db.getDefaultClient();
    const periodStart = new Date(`${from}T00:00:00.000Z`);
    const periodEnd = new Date(`${to}T00:00:00.000Z`);
    await publicDb.company_whatsapp_report_runs.createMany({
      data: [{
        company_id: companyId,
        report_type: kind,
        period_start: periodStart,
        period_end: periodEnd,
        status: 'PENDING',
      }],
      skipDuplicates: true,
    });

    const reclaimedBefore = new Date(Date.now() - STALE_RUN_MS);
    const claim = await publicDb.company_whatsapp_report_runs.updateMany({
      where: {
        company_id: companyId,
        report_type: kind,
        period_start: periodStart,
        period_end: periodEnd,
        OR: [
          { status: { in: ['PENDING', 'FAILED'] } },
          { status: 'PROCESSING', started_at: { lt: reclaimedBefore } },
        ],
      },
      data: {
        status: 'PROCESSING',
        started_at: new Date(),
        attempt_count: { increment: 1 },
        message_id: null,
        last_error: null,
      },
    });
    return claim.count === 1;
  }

  private async finishRun(
    companyId: string,
    kind: ReportKind,
    from: string,
    to: string,
    data: { status: 'SENT' | 'FAILED'; message_id?: string | null; sent_at?: Date; last_error: string | null },
  ) {
    await this.db.getDefaultClient().company_whatsapp_report_runs.updateMany({
      where: {
        company_id: companyId,
        report_type: kind,
        period_start: new Date(`${from}T00:00:00.000Z`),
        period_end: new Date(`${to}T00:00:00.000Z`),
      },
      data,
    });
  }
}

export function previousFullWeek(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const localTodayUtc = new Date(Date.UTC(value('year'), value('month') - 1, value('day')));
  const daysSinceMonday = (localTodayUtc.getUTCDay() + 6) % 7;
  const currentWeekMonday = new Date(localTodayUtc.getTime() - daysSinceMonday * 86_400_000);
  const previousMonday = new Date(currentWeekMonday.getTime() - 7 * 86_400_000);
  const previousSunday = new Date(currentWeekMonday.getTime() - 86_400_000);
  return {
    from: previousMonday.toISOString().slice(0, 10),
    to: previousSunday.toISOString().slice(0, 10),
  };
}

function readCompanyIds(value: unknown, fallbackId: string): string[] {
  if (!Array.isArray(value)) return [fallbackId];
  const ids = [...new Set(value.filter((item): item is string => typeof item === 'string'))];
  return ids.length ? ids : [fallbackId];
}

function safeErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
