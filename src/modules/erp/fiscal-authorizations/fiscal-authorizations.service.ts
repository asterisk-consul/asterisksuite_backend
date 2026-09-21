import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { Prisma } from '@/generated/prisma/client';
import { CreateFiscalAuthorizationDto, UpdateFiscalAuthorizationDto, UpdateFiscalAuthorizationSettingsDto } from './dto/fiscal-authorization.dto';

@Injectable()
export class FiscalAuthorizationsService {
  constructor(private readonly db: PrismaService) {}

  private get prisma() { return this.db.getClientForCurrentContext(); }

  private startOfDay(value: Date | string) {
    const date = new Date(value);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  private derivedStatus(row: any, now = new Date()) {
    if (row.status === 'ANNULLED' || row.status === 'REPLACED') return row.status;
    const today = this.startOfDay(now).getTime();
    const from = this.startOfDay(row.valid_from).getTime();
    const to = this.startOfDay(row.valid_to).getTime();
    if (today < from) return 'FUTURE';
    if (today > to) return 'EXPIRED';
    const days = Math.ceil((to - today) / 86400000);
    return days <= 30 ? 'EXPIRING' : 'CURRENT';
  }

  private present(row: any) {
    const current = Number(row.document_sequence?.current_number ?? 0);
    return {
      ...row,
      derived_status: this.derivedStatus(row),
      remaining_numbers: Math.max(0, Number(row.range_to) - Math.max(current, Number(row.range_from) - 1)),
    };
  }

  async getSettings() {
    return this.prisma.fiscal_authorization_settings.upsert({
      where: { settings_key: 'default' },
      update: {},
      create: { settings_key: 'default' },
    });
  }

  async updateSettings(dto: UpdateFiscalAuthorizationSettingsDto, userId?: string) {
    return this.prisma.fiscal_authorization_settings.upsert({
      where: { settings_key: 'default' },
      create: { settings_key: 'default', ...dto, updated_by: userId },
      update: { ...dto, updated_by: userId, updated_at: new Date() },
    });
  }

  async findAll() {
    const rows = await this.prisma.fiscal_authorizations.findMany({
      where: { deleted_at: null },
      include: { document_type: true, document_sequence: true, _count: { select: { documents: true } } },
      orderBy: [{ valid_to: 'desc' }, { created_at: 'desc' }],
    });
    return rows.map(row => this.present(row));
  }

  private validatePeriod(dto: CreateFiscalAuthorizationDto) {
    if (new Date(dto.valid_to) < new Date(dto.valid_from)) throw new BadRequestException('El vencimiento no puede ser anterior al inicio de vigencia');
    if (dto.range_to < dto.range_from) throw new BadRequestException('El número hasta no puede ser menor que el número desde');
  }

  private async ensureNoOverlap(dto: CreateFiscalAuthorizationDto, excludeId?: string) {
    this.validatePeriod(dto);
    const overlap = await this.prisma.fiscal_authorizations.findFirst({
      where: {
        id: excludeId ? { not: excludeId } : undefined,
        deleted_at: null,
        status: 'ACTIVE',
        authorization_type: dto.authorization_type ?? 'CAI',
        document_type_id: dto.document_type_id,
        document_sequence_id: dto.document_sequence_id,
        valid_from: { lte: new Date(dto.valid_to) },
        valid_to: { gte: new Date(dto.valid_from) },
        range_from: { lte: dto.range_to },
        range_to: { gte: dto.range_from },
      },
    });
    if (overlap) throw new BadRequestException('La vigencia y numeración se superponen con otra autorización activa');
  }

  async create(dto: CreateFiscalAuthorizationDto, userId?: string) {
    await this.ensureNoOverlap(dto);
    return this.prisma.fiscal_authorizations.create({
      data: {
        ...dto,
        authorization_type: dto.authorization_type ?? 'CAI',
        valid_from: new Date(dto.valid_from),
        valid_to: new Date(dto.valid_to),
        replacement_date: dto.replacement_date ? new Date(dto.replacement_date) : null,
        created_by: userId,
      },
    });
  }

  async update(id: string, dto: UpdateFiscalAuthorizationDto, userId?: string) {
    const existing = await this.prisma.fiscal_authorizations.findFirst({ where: { id, deleted_at: null } });
    if (!existing) throw new NotFoundException('Autorización fiscal no encontrada');
    await this.ensureNoOverlap(dto, id);
    return this.prisma.fiscal_authorizations.update({
      where: { id },
      data: {
        ...dto,
        valid_from: new Date(dto.valid_from),
        valid_to: new Date(dto.valid_to),
        replacement_date: dto.replacement_date ? new Date(dto.replacement_date) : null,
        updated_by: userId,
        updated_at: new Date(),
      },
    });
  }

  async remove(id: string, userId?: string) {
    const used = await this.prisma.documents.count({ where: { fiscal_authorization_id: id, deleted_at: null } });
    if (used) throw new BadRequestException('La autorización fue utilizada por documentos y sólo puede marcarse como reemplazada o anulada');
    return this.prisma.fiscal_authorizations.update({ where: { id }, data: { deleted_at: new Date(), deleted_by: userId } });
  }

  async resolveForDocument(document: any, tx?: Prisma.TransactionClient) {
    // El CAI configurado pertenece a la empresa emisora: aplica a remitos de
    // salida (ventas). Los remitos recibidos requieren capturar el CAI del proveedor.
    if (document.document_types?.category !== 'REMITO' || document.document_types?.direction !== 1) return null;
    const client: any = tx ?? this.prisma;
    const settings = await client.fiscal_authorization_settings.upsert({
      where: { settings_key: 'default' }, update: {}, create: { settings_key: 'default' },
    });
    if (settings.missing_policy === 'OFF' && settings.expired_policy === 'OFF') return null;
    if (!document.document_sequence_id) {
      if (settings.missing_policy === 'BLOCK') throw new BadRequestException('El remito no tiene punto de venta para resolver el CAI');
      return null;
    }
    const date = this.startOfDay(document.date);
    const candidates = await client.fiscal_authorizations.findMany({
      where: {
        deleted_at: null,
        status: 'ACTIVE',
        document_type_id: document.document_type_id,
        document_sequence_id: document.document_sequence_id,
        valid_from: { lte: date },
        valid_to: { gte: date },
        range_from: { lte: document.number },
        range_to: { gte: document.number },
        OR: [{ replacement_date: null }, { replacement_date: { gt: date } }],
      },
    });
    if (candidates.length > 1) throw new BadRequestException('Hay más de una autorización fiscal aplicable. Corregí la configuración antes de confirmar');
    const authorization = candidates[0];
    if (!authorization) {
      const expired = await client.fiscal_authorizations.findFirst({
        where: { deleted_at: null, status: 'ACTIVE', document_type_id: document.document_type_id, document_sequence_id: document.document_sequence_id, valid_to: { lt: date } },
        orderBy: { valid_to: 'desc' },
      });
      const policy = expired ? settings.expired_policy : settings.missing_policy;
      if (policy === 'BLOCK') throw new BadRequestException(expired ? `El CAI venció el ${expired.valid_to.toISOString().slice(0, 10)}` : 'No existe un CAI vigente para este remito y punto de venta');
      return null;
    }
    return {
      fiscal_authorization_id: authorization.id,
      fiscal_authorization_type: authorization.authorization_type,
      fiscal_authorization_code: authorization.code,
      fiscal_authorization_expires_at: authorization.valid_to,
      fiscal_authorization_range_from: authorization.range_from,
      fiscal_authorization_range_to: authorization.range_to,
    };
  }

  async previewForDocument(documentId: string) {
    const document = await this.prisma.documents.findFirst({
      where: { id: documentId, deleted_at: null },
      include: { document_types: true, document_sequences: true },
    });
    if (!document) throw new NotFoundException('Documento no encontrado');
    try {
      const snapshot = await this.resolveForDocument(document);
      if (!snapshot) return { status: 'WARNING', message: 'El remito se confirmará sin autorización fiscal según la política configurada.' };
      const daysRemaining = Math.ceil((this.startOfDay(snapshot.fiscal_authorization_expires_at).getTime() - this.startOfDay(new Date()).getTime()) / 86400000);
      return { status: daysRemaining <= 30 ? 'WARNING' : 'OK', days_remaining: daysRemaining, ...snapshot };
    } catch (error) {
      if (error instanceof BadRequestException) return { status: 'BLOCKED', message: error.message };
      throw error;
    }
  }

  async refreshAlerts(clientOverride?: any) {
    const client = clientOverride ?? this.prisma;
    const settings = await client.fiscal_authorization_settings.upsert({
      where: { settings_key: 'default' }, update: {}, create: { settings_key: 'default' },
    });
    if (!settings.alerts_enabled) return [];
    const rows = await client.fiscal_authorizations.findMany({
      where: { deleted_at: null, status: 'ACTIVE' }, include: { document_type: true, document_sequence: true },
    });
    const today = this.startOfDay(new Date());
    const dayThresholds = (settings.day_thresholds as number[]).map(Number).sort((a, b) => a - b);
    const numberThresholds = (settings.number_thresholds as number[]).map(Number).sort((a, b) => a - b);
    for (const row of rows) {
      const days = Math.ceil((this.startOfDay(row.valid_to).getTime() - today.getTime()) / 86400000);
      const remaining = Math.max(0, row.range_to - Math.max(row.document_sequence.current_number, row.range_from - 1));
      const dayThreshold = dayThresholds.find(value => days <= value && days >= 0);
      const numberThreshold = numberThresholds.find(value => remaining <= value);
      const base = `${row.authorization_type} ${row.code} · ${row.document_type.code} · PV ${row.document_sequence.point_of_sale}`;
      if (dayThreshold != null) await client.fiscal_authorization_alerts.upsert({
        where: { fiscal_authorization_id_alert_key: { fiscal_authorization_id: row.id, alert_key: `days-${dayThreshold}` } },
        update: {}, create: { fiscal_authorization_id: row.id, alert_key: `days-${dayThreshold}`, severity: days <= 3 ? 'ERROR' : 'WARNING', title: 'Autorización fiscal próxima a vencer', message: `${base}. Vence en ${days} día(s).` },
      });
      if (days < 0 && settings.daily_after_expiration) await client.fiscal_authorization_alerts.upsert({
        where: { fiscal_authorization_id_alert_key: { fiscal_authorization_id: row.id, alert_key: `expired-${today.toISOString().slice(0, 10)}` } },
        update: {}, create: { fiscal_authorization_id: row.id, alert_key: `expired-${today.toISOString().slice(0, 10)}`, severity: 'ERROR', title: 'Autorización fiscal vencida', message: `${base}. Venció hace ${Math.abs(days)} día(s).` },
      });
      if (numberThreshold != null) await client.fiscal_authorization_alerts.upsert({
        where: { fiscal_authorization_id_alert_key: { fiscal_authorization_id: row.id, alert_key: `numbers-${numberThreshold}` } },
        update: {}, create: { fiscal_authorization_id: row.id, alert_key: `numbers-${numberThreshold}`, severity: remaining <= 10 ? 'ERROR' : 'WARNING', title: 'Numeración fiscal próxima a agotarse', message: `${base}. Quedan ${remaining} números disponibles.` },
      });
    }
    return client.fiscal_authorization_alerts.findMany({
      where: { is_read: false }, include: { authorization: { include: { document_type: true, document_sequence: true } } }, orderBy: { created_at: 'desc' }, take: 50,
    });
  }

  async markAlertRead(id: string) {
    return this.prisma.fiscal_authorization_alerts.update({ where: { id }, data: { is_read: true, read_at: new Date() } });
  }
}
