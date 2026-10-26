import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';
import { PrismaService } from '@/prisma/prisma.service';
import { ManagementReportsService } from '../management-reports/management-reports.service';
import { OpenWaClient } from './openwa.client';
import { previousFullWeek, WHATSAPP_REPORTS_TIME_ZONE } from './weekly-reports.runner';
import { createWhatsAppReportCaption, createWhatsAppTextTestMessage } from './whatsapp-report-messages';
import { TestWhatsAppReportSettingsDto, UpdateWhatsAppReportSettingsDto } from './dto/update-whatsapp-report-settings.dto';

const GROUP_ID_PATTERN = /^[a-zA-Z0-9._-]+@g\.us$/;

@Injectable()
export class WhatsAppReportsService {
  private pdfTestInFlight = false;

  constructor(
    private readonly db: PrismaService,
    private readonly reports: ManagementReportsService,
    private readonly openWa: OpenWaClient,
  ) {}

  getGatewayStatus() {
    return this.openWa.getStatus();
  }

  async getSettings(userId: string) {
    const companyId = await this.requireCompanyAdmin(userId);
    const settings = await this.db.getDefaultClient().company_whatsapp_report_settings.findUnique({
      where: { company_id: companyId },
    });
    return this.toPublicSettings(settings, companyId);
  }

  async getAvailableCompanies(userId: string) {
    await this.requireCompanyAdmin(userId);
    return this.reports.getAvailableCompanies(userId);
  }

  async getGroups(userId: string) {
    await this.requireCompanyAdmin(userId);
    return this.openWa.listGroups();
  }

  async saveSettings(userId: string, dto: UpdateWhatsAppReportSettingsDto) {
    const companyId = await this.requireCompanyAdmin(userId);
    const selectedCompanyIds = [...new Set(dto.selected_company_ids)];
    if (!selectedCompanyIds.includes(companyId)) {
      throw new BadRequestException('El alcance del informe debe incluir la empresa actual.');
    }

    const availableCompanies = await this.reports.getAvailableCompanies(userId);
    const availableIds = new Set(availableCompanies.map((company) => company.id));
    if (selectedCompanyIds.some((id) => !availableIds.has(id))) {
      throw new ForbiddenException('No tenés acceso a una o más empresas seleccionadas para el informe.');
    }

    const consolidatedGroupId = this.normalizeGroupId(dto.consolidated_group_id);
    const inventoryGroupId = this.normalizeGroupId(dto.inventory_group_id);
    if (dto.enabled && !dto.consolidated_enabled && !dto.inventory_enabled) {
      throw new BadRequestException('Activá al menos uno de los informes semanales.');
    }
    if (dto.enabled && dto.consolidated_enabled && !consolidatedGroupId) {
      throw new BadRequestException('Seleccioná el grupo para el reporte consolidado.');
    }
    if (dto.enabled && dto.inventory_enabled && !inventoryGroupId) {
      throw new BadRequestException('Seleccioná el grupo para el reporte de inventario.');
    }

    const saved = await this.db.getDefaultClient().company_whatsapp_report_settings.upsert({
      where: { company_id: companyId },
      create: {
        company_id: companyId,
        enabled: dto.enabled,
        selected_company_ids: selectedCompanyIds as any,
        consolidated_enabled: dto.consolidated_enabled,
        consolidated_group_id: consolidatedGroupId,
        inventory_enabled: dto.inventory_enabled,
        inventory_group_id: inventoryGroupId,
        configured_by: userId,
      },
      update: {
        enabled: dto.enabled,
        selected_company_ids: selectedCompanyIds as any,
        consolidated_enabled: dto.consolidated_enabled,
        consolidated_group_id: consolidatedGroupId,
        inventory_enabled: dto.inventory_enabled,
        inventory_group_id: inventoryGroupId,
        configured_by: userId,
      },
    });
    return this.toPublicSettings(saved, companyId);
  }

  async sendTest(userId: string, dto: TestWhatsAppReportSettingsDto) {
    const companyId = await this.requireCompanyAdmin(userId);
    const settings = await this.db.getDefaultClient().company_whatsapp_report_settings.findUnique({
      where: { company_id: companyId },
      include: { company: { select: { name: true } } },
    });
    if (!settings) throw new NotFoundException('Guardá primero la configuración de WhatsApp.');

    const chatId = dto.destination === 'consolidated'
      ? settings.consolidated_group_id
      : settings.inventory_group_id;
    if (!chatId || !GROUP_ID_PATTERN.test(chatId)) {
      throw new BadRequestException('Elegí y guardá un grupo válido para ese informe.');
    }

    if (dto.format === 'pdf') {
      if (this.pdfTestInFlight) {
        throw new ConflictException('Ya hay una prueba de PDF en curso. Esperá a que termine antes de iniciar otra.');
      }

      this.pdfTestInFlight = true;
      try {
        const selectedCompanyIds = Array.isArray(settings.selected_company_ids)
          ? [...new Set(settings.selected_company_ids.filter((id: unknown) => typeof id === 'string') as string[])]
          : [companyId];
        if (!selectedCompanyIds.includes(companyId)) {
          throw new BadRequestException('La configuración debe incluir la empresa actual antes de generar el PDF.');
        }

        const period = previousFullWeek(new Date(), WHATSAPP_REPORTS_TIME_ZONE);
        const file = await this.reports.exportConsolidatedReport({
          company_ids: selectedCompanyIds,
          date_from: period.from,
          date_to: period.to,
          view: dto.destination === 'inventory' ? 'inventory' : 'consolidated',
          format: 'pdf',
        }, userId);
        const caption = createWhatsAppReportCaption(dto.destination, settings.company.name, period, true, selectedCompanyIds.length);
        const result = await this.openWa.sendDocument(
          chatId,
          file.filename,
          caption,
          file.buffer,
          `wa-settings-pdf-test-${companyId}-${dto.destination}-${randomUUID()}`,
        );

        return {
          success: true,
          format: 'pdf' as const,
          messageId: result?.messageId ?? null,
          filename: file.filename,
          sizeBytes: file.buffer.length,
          period,
        };
      } finally {
        this.pdfTestInFlight = false;
      }
    }

    const result = await this.openWa.sendTestText(
      chatId,
      createWhatsAppTextTestMessage(settings.company.name),
      `wa-settings-test-${companyId}-${dto.destination}-${randomUUID()}`,
    );
    return { success: true, format: 'text' as const, messageId: result?.messageId ?? null };
  }

  async getRecentRuns(userId: string) {
    const companyId = await this.requireCompanyAdmin(userId);
    return this.db.getDefaultClient().company_whatsapp_report_runs.findMany({
      where: { company_id: companyId },
      orderBy: [{ created_at: 'desc' }, { report_type: 'asc' }],
      take: 20,
      select: {
        id: true,
        report_type: true,
        period_start: true,
        period_end: true,
        status: true,
        attempt_count: true,
        last_error: true,
        started_at: true,
        sent_at: true,
        created_at: true,
      },
    });
  }

  private async requireCompanyAdmin(userId: string) {
    const companyId = getCurrentCompanyId();
    if (!companyId) throw new BadRequestException('No se pudo determinar la empresa actual.');

    const membership = await this.db.getDefaultClient().company_users.findUnique({
      where: { company_id_user_id: { company_id: companyId, user_id: userId } },
      select: { role: true, company: { select: { deleted_at: true } } },
    });
    if (!membership || membership.company.deleted_at) throw new ForbiddenException('No tenés acceso a esta empresa.');
    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException('Solo OWNER o ADMIN pueden configurar los envíos por WhatsApp.');
    }
    return companyId;
  }

  private normalizeGroupId(value?: string | null) {
    const normalized = value?.trim() || null;
    if (normalized && !GROUP_ID_PATTERN.test(normalized)) {
      throw new BadRequestException('El identificador del grupo debe terminar en @g.us.');
    }
    return normalized;
  }

  private toPublicSettings(settings: any, companyId: string) {
    const selectedIds = Array.isArray(settings?.selected_company_ids)
      ? settings.selected_company_ids.filter((id: unknown): id is string => typeof id === 'string')
      : [companyId];
    return {
      enabled: settings?.enabled ?? false,
      selected_company_ids: selectedIds.length ? selectedIds : [companyId],
      consolidated_enabled: settings?.consolidated_enabled ?? true,
      consolidated_group_id: settings?.consolidated_group_id ?? null,
      inventory_enabled: settings?.inventory_enabled ?? true,
      inventory_group_id: settings?.inventory_group_id ?? null,
    };
  }
}
