import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';
import { PrismaService } from '@/prisma/prisma.service';
import { OpenWaClient } from '@/modules/erp/whatsapp-reports/openwa.client';

export interface SaveWhatsAppNotificationSettingsInput {
  enabled: boolean;
  assignments_enabled: boolean;
  customer_balances_enabled: boolean;
  customer_balance_recipient_ids: string[];
  supplier_balances_enabled: boolean;
  supplier_balance_recipient_ids: string[];
  checks_enabled: boolean;
  check_recipient_ids: string[];
  min_interval_seconds: number;
  batch_window_seconds: number;
}

export interface WhatsAppNotificationItem {
  companyId: string;
  eventType: string;
  deduplicationKey: string;
  title: string;
  message: string;
  targetPath?: string | null;
}

type NotificationRoute = {
  enabledColumn: string;
  recipientsColumn: string;
};

const ROUTES: Record<string, NotificationRoute> = {
  CUSTOMER_BALANCE_OLD: {
    enabledColumn: 'customer_balances_enabled',
    recipientsColumn: 'customer_balance_recipient_ids',
  },
  SUPPLIER_BALANCE_OLD: {
    enabledColumn: 'supplier_balances_enabled',
    recipientsColumn: 'supplier_balance_recipient_ids',
  },
  CHECK_DUE: {
    enabledColumn: 'checks_enabled',
    recipientsColumn: 'check_recipient_ids',
  },
  CHECK_OVERDUE: {
    enabledColumn: 'checks_enabled',
    recipientsColumn: 'check_recipient_ids',
  },
};

const DEFAULT_SETTINGS: SaveWhatsAppNotificationSettingsInput = {
  enabled: false,
  assignments_enabled: true,
  customer_balances_enabled: false,
  customer_balance_recipient_ids: [],
  supplier_balances_enabled: false,
  supplier_balance_recipient_ids: [],
  checks_enabled: false,
  check_recipient_ids: [],
  min_interval_seconds: 15,
  batch_window_seconds: 20,
};

@Injectable()
export class WhatsAppNotificationsService {
  private readonly logger = new Logger(WhatsAppNotificationsService.name);

  constructor(
    private readonly db: PrismaService,
    private readonly openWa: OpenWaClient,
  ) {}

  isDeliveryEnabled() {
    return process.env.WHATSAPP_NOTIFICATIONS_ENABLED?.trim().toLowerCase() === 'true';
  }

  async getMyContact(userId: string) {
    const rows = await this.publicDb().$queryRaw<any[]>`
      SELECT phone_e164, opted_in, consent_at
      FROM public.user_whatsapp_contacts
      WHERE user_id = ${userId}::uuid
      LIMIT 1
    `;
    return rows[0] ?? { phone_e164: '', opted_in: false, consent_at: null };
  }

  async getManagedContact(userId: string) {
    const rows = await this.publicDb().$queryRaw<any[]>`
      SELECT phone_e164, opted_in
      FROM public.user_whatsapp_contacts
      WHERE user_id = ${userId}::uuid
      LIMIT 1
    `;
    return rows[0] ?? { phone_e164: '', opted_in: false };
  }

  async prepareManagedPhone(value: string | null | undefined) {
    const rawPhone = String(value ?? '').trim();
    if (!rawPhone) return null;
    const phone = this.normalizePhone(rawPhone);
    if (!phone) {
      throw new BadRequestException('Usá el formato internacional con + y código de país, por ejemplo +54911XXXXXXXX.');
    }
    // Validate storage before a caller creates or updates a user, so an unapplied
    // schema change cannot leave a partially created account behind.
    await this.publicDb().$queryRaw`SELECT user_id FROM public.user_whatsapp_contacts LIMIT 0`;
    return phone;
  }

  async saveManagedPhone(userId: string, value: string | null | undefined) {
    const phone = await this.prepareManagedPhone(value);
    if (!phone) {
      await this.publicDb().$executeRaw`DELETE FROM public.user_whatsapp_contacts WHERE user_id = ${userId}::uuid`;
      return { phone_e164: '', opted_in: false };
    }

    await this.publicDb().$executeRaw`
      INSERT INTO public.user_whatsapp_contacts AS current_contact (user_id, phone_e164, opted_in, consent_at, updated_at)
      VALUES (${userId}::uuid, ${phone}, false, NULL, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        phone_e164 = EXCLUDED.phone_e164,
        opted_in = CASE
          WHEN current_contact.phone_e164 IS DISTINCT FROM EXCLUDED.phone_e164 THEN false
          ELSE current_contact.opted_in
        END,
        consent_at = CASE
          WHEN current_contact.phone_e164 IS DISTINCT FROM EXCLUDED.phone_e164 THEN NULL
          ELSE current_contact.consent_at
        END,
        updated_at = NOW()
    `;
    return this.getManagedContact(userId);
  }

  async saveMyContact(userId: string, input: { phone_e164: string; opted_in: boolean }) {
    if (!String(input.phone_e164 ?? '').trim() && !input.opted_in) {
      await this.publicDb().$executeRaw`DELETE FROM public.user_whatsapp_contacts WHERE user_id = ${userId}::uuid`;
      return { phone_e164: '', opted_in: false, consent_at: null };
    }
    const phone = this.normalizePhone(input.phone_e164);
    if (input.opted_in && !phone) {
      throw new BadRequestException('Ingresá tu número con código de país para activar WhatsApp.');
    }
    if (!phone) throw new BadRequestException('Ingresá un número válido con código de país, por ejemplo +54911XXXXXXXX.');

    await this.publicDb().$executeRaw`
      INSERT INTO public.user_whatsapp_contacts (user_id, phone_e164, opted_in, consent_at, updated_at)
      VALUES (
        ${userId}::uuid,
        ${phone},
        ${input.opted_in},
        ${input.opted_in ? new Date() : null},
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        phone_e164 = EXCLUDED.phone_e164,
        opted_in = EXCLUDED.opted_in,
        consent_at = EXCLUDED.consent_at,
        updated_at = NOW()
    `;

    return this.getMyContact(userId);
  }

  async getCompanySettings(userId: string) {
    const companyId = await this.requireCompanyAdmin(userId);
    const row = await this.findCompanySettings(companyId);
    return this.toPublicSettings(row);
  }

  async getCompanyRecipients(userId: string) {
    const companyId = await this.requireCompanyAdmin(userId);
    return this.publicDb().$queryRaw<any[]>`
      SELECT u.id, u.name, c.phone_e164, COALESCE(c.opted_in, false) AS opted_in
      FROM public.company_users cu
      INNER JOIN public.users u ON u.id = cu.user_id
      LEFT JOIN public.user_whatsapp_contacts c ON c.user_id = u.id
      WHERE cu.company_id = ${companyId}::uuid
        AND u.active = true
        AND u.deleted_at IS NULL
      ORDER BY u.name ASC
    `;
  }

  async saveCompanySettings(userId: string, input: SaveWhatsAppNotificationSettingsInput) {
    const companyId = await this.requireCompanyAdmin(userId);
    const settings = this.normalizeSettings(input);
    const selectedIds = [...new Set([
      ...settings.customer_balance_recipient_ids,
      ...settings.supplier_balance_recipient_ids,
      ...settings.check_recipient_ids,
    ])];

    if (selectedIds.length > 150) throw new BadRequestException('Podés configurar hasta 50 destinatarios por categoría.');
    if (selectedIds.length) {
      const contacts = await this.publicDb().$queryRaw<any[]>`
        SELECT cu.user_id
        FROM public.company_users cu
        INNER JOIN public.users u ON u.id = cu.user_id
        INNER JOIN public.user_whatsapp_contacts c ON c.user_id = u.id AND c.opted_in = true
        WHERE cu.company_id = ${companyId}::uuid
          AND cu.user_id IN (
            SELECT value::uuid FROM jsonb_array_elements_text(${JSON.stringify(selectedIds)}::jsonb) AS ids(value)
          )
          AND u.active = true
          AND u.deleted_at IS NULL
          AND c.phone_e164 <> ''
      `;
      const eligible = new Set(contacts.map((contact: any) => String(contact.user_id)));
      const invalid = selectedIds.filter(id => !eligible.has(id));
      if (invalid.length) {
        throw new BadRequestException('Todos los destinatarios deben pertenecer a la empresa y haber activado su número de WhatsApp.');
      }
    }

    await this.publicDb().$executeRaw`
      INSERT INTO public.company_whatsapp_notification_settings (
        company_id, enabled, assignments_enabled,
        customer_balances_enabled, customer_balance_recipient_ids,
        supplier_balances_enabled, supplier_balance_recipient_ids,
        checks_enabled, check_recipient_ids,
        min_interval_seconds, batch_window_seconds, configured_by, created_at, updated_at
      ) VALUES (
        ${companyId}::uuid,
        ${settings.enabled},
        ${settings.assignments_enabled},
        ${settings.customer_balances_enabled},
        ${JSON.stringify(settings.customer_balance_recipient_ids)}::jsonb,
        ${settings.supplier_balances_enabled},
        ${JSON.stringify(settings.supplier_balance_recipient_ids)}::jsonb,
        ${settings.checks_enabled},
        ${JSON.stringify(settings.check_recipient_ids)}::jsonb,
        ${settings.min_interval_seconds},
        ${settings.batch_window_seconds},
        ${userId}::uuid,
        NOW(),
        NOW()
      )
      ON CONFLICT (company_id) DO UPDATE SET
        enabled = EXCLUDED.enabled,
        assignments_enabled = EXCLUDED.assignments_enabled,
        customer_balances_enabled = EXCLUDED.customer_balances_enabled,
        customer_balance_recipient_ids = EXCLUDED.customer_balance_recipient_ids,
        supplier_balances_enabled = EXCLUDED.supplier_balances_enabled,
        supplier_balance_recipient_ids = EXCLUDED.supplier_balance_recipient_ids,
        checks_enabled = EXCLUDED.checks_enabled,
        check_recipient_ids = EXCLUDED.check_recipient_ids,
        min_interval_seconds = EXCLUDED.min_interval_seconds,
        batch_window_seconds = EXCLUDED.batch_window_seconds,
        configured_by = EXCLUDED.configured_by,
        updated_at = NOW()
    `;

    return this.toPublicSettings(await this.findCompanySettings(companyId));
  }

  async enqueueOrderAssignment(input: {
    companyId: string;
    recipientUserId: string;
    documentId: string;
    documentNumber: number;
    documentReference?: string | null;
    partyName?: string | null;
    assignedAt: Date;
  }) {
    const contact = await this.getOrderNotificationContact(input.companyId, input.recipientUserId, 'asignación');
    if (!contact) return false;
    const targetUrl = await this.companyDocumentUrl(input.companyId, `/erp/sales/${input.documentId}`);
    const queued = await this.enqueueForRecipient(input.companyId, input.recipientUserId, contact.phone_e164, {
      eventType: 'OV_ASSIGNED',
      companyId: input.companyId,
      deduplicationKey: `ov-assigned:${input.documentId}:${input.recipientUserId}:${input.assignedAt.toISOString()}`,
      title: 'Te asignaron una Orden de Venta',
      message: [
        `OV #${input.documentNumber}`,
        input.partyName ? `- Cliente: ${input.partyName}` : null,
        input.documentReference ? `- Referencia: ${input.documentReference}` : null,
        'Ingresá al enlace para seguir la gestión o buscá la OV por referencia o número.',
      ].filter(Boolean).join('\n'),
      targetPath: targetUrl,
    });
    if (queued) this.logger.log('Aviso de asignación de OV encolado para WhatsApp.');
    return queued;
  }

  async enqueueOrderReadyForDelivery(input: {
    companyId: string;
    recipientUserId: string;
    documentId: string;
    operationId: string;
    documentNumber: number;
    documentReference?: string | null;
    partyName?: string | null;
    readyAt: Date;
  }) {
    const contact = await this.getOrderNotificationContact(input.companyId, input.recipientUserId, 'lista para entrega');
    if (!contact) return false;
    const targetUrl = await this.companyDocumentUrl(input.companyId, `/erp/sales/${input.documentId}`);
    const queued = await this.enqueueForRecipient(input.companyId, input.recipientUserId, contact.phone_e164, {
      eventType: 'OV_READY_FOR_DELIVERY',
      companyId: input.companyId,
      deduplicationKey: `ov-ready:${input.operationId}:${input.recipientUserId}:${input.readyAt.toISOString()}`,
      title: 'Orden de Venta lista para entregar',
      message: [
        `OV #${input.documentNumber}`,
        input.partyName ? `- Cliente: ${input.partyName}` : null,
        input.documentReference ? `- Referencia: ${input.documentReference}` : null,
        'La orden ya está lista para entregar.',
        'Ingresá al enlace para seguir la gestión o buscá la OV por referencia o número.',
      ].filter(Boolean).join('\n'),
      targetPath: targetUrl,
    });
    if (queued) this.logger.log('Aviso de OV lista para entrega encolado para WhatsApp.');
    return queued;
  }

  private async getOrderNotificationContact(companyId: string, recipientUserId: string, eventLabel: string) {
    if (!this.isDeliveryEnabled()) {
      this.logger.warn(`No se encoló el aviso de OV (${eventLabel}): WHATSAPP_NOTIFICATIONS_ENABLED no está en true.`);
      return null;
    }
    const settings = await this.findCompanySettings(companyId);
    if (!settings?.enabled || !settings.assignments_enabled) {
      this.logger.warn(`No se encoló el aviso de OV (${eventLabel}): el canal o la categoría Asignaciones están desactivados para la empresa.`);
      return null;
    }
    const contact = await this.findOptedInContact(companyId, recipientUserId);
    if (!contact) {
      this.logger.warn(`No se encoló el aviso de OV (${eventLabel}): el responsable no tiene un teléfono habilitado con consentimiento.`);
      return null;
    }
    return contact;
  }

  private async companyDocumentUrl(companyId: string, path: string) {
    const company = await this.publicDb().companies.findUnique({
      where: { id: companyId },
      select: { subdomain: true },
    });
    const baseDomain = (process.env.APP_PUBLIC_BASE_DOMAIN?.trim() || 'asterisksuite.cloud')
      .replace(/^https?:\/\//i, '')
      .replace(/\/+$/, '')
      .toLowerCase();
    const subdomain = String(company?.subdomain ?? '').trim().toLowerCase();
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (!/^[a-z0-9.-]+$/.test(baseDomain) || baseDomain.includes('..')) {
      throw new Error('APP_PUBLIC_BASE_DOMAIN no es un dominio válido');
    }
    if (subdomain && !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(subdomain)) {
      throw new Error('El subdominio de la empresa no es válido');
    }

    const host = subdomain ? `${subdomain}.${baseDomain}` : baseDomain;
    return `https://${host}${normalizedPath}`;
  }

  async enqueueConfiguredRoute(input: WhatsAppNotificationItem) {
    if (!this.isDeliveryEnabled()) return 0;
    const route = ROUTES[input.eventType];
    if (!route) return 0;
    const settings = await this.findCompanySettings(input.companyId);
    if (!settings?.enabled || !settings[route.enabledColumn]) return 0;
    const recipientIds = this.jsonIds(settings[route.recipientsColumn]);
    const contacts = await this.findOptedInContacts(input.companyId, recipientIds);
    let enqueued = 0;
    for (const recipientUserId of recipientIds) {
      const contact = contacts.get(recipientUserId);
      if (!contact) continue;
      const inserted = await this.enqueueForRecipient(
        input.companyId,
        recipientUserId,
        contact.phone_e164,
        input,
      );
      if (inserted) enqueued += 1;
    }
    return enqueued;
  }

  async enqueueConfiguredDigest(input: WhatsAppNotificationItem) {
    if (!this.isDeliveryEnabled()) return 0;
    const route = ROUTES[input.eventType];
    if (!route) return 0;
    const settings = await this.findCompanySettings(input.companyId);
    if (!settings?.enabled || !settings[route.enabledColumn]) return 0;
    const recipientIds = this.jsonIds(settings[route.recipientsColumn]);
    const contacts = await this.findOptedInContacts(input.companyId, recipientIds);
    let enqueued = 0;
    for (const recipientUserId of recipientIds) {
      const contact = contacts.get(recipientUserId);
      if (!contact) continue;
      const inserted = await this.enqueueForRecipient(input.companyId, recipientUserId, contact.phone_e164, input);
      if (inserted) enqueued += 1;
    }
    return enqueued;
  }

  async enqueueAgedAccountAlerts(companyId: string, tenant: any, today: Date) {
    if (!this.isDeliveryEnabled()) return { queued: 0, reviewed: 0 };
    const settings = await this.findCompanySettings(companyId);
    if (!settings?.enabled) return { queued: 0, reviewed: 0 };

    const cutoff = new Date(today);
    cutoff.setUTCDate(cutoff.getUTCDate() - 30);
    const routes: Array<{ partyType: 'CUSTOMER' | 'SUPPLIER'; eventType: string; recipientIds: string[] }> = [
      {
        partyType: 'CUSTOMER',
        eventType: 'CUSTOMER_BALANCE_OLD',
        recipientIds: settings.customer_balances_enabled
          ? this.jsonIds(settings.customer_balance_recipient_ids)
          : [],
      },
      {
        partyType: 'SUPPLIER',
        eventType: 'SUPPLIER_BALANCE_OLD',
        recipientIds: settings.supplier_balances_enabled
          ? this.jsonIds(settings.supplier_balance_recipient_ids)
          : [],
      },
    ];
    let reviewed = 0;
    let queued = 0;
    for (const route of routes) {
      if (!route.recipientIds.length) continue;
      const contacts = await this.findOptedInContacts(companyId, route.recipientIds);
      const preview: string[] = [];
      let routeReviewed = 0;
      let afterId: string | undefined;
      while (true) {
        const accounts = await tenant.current_accounts.findMany({
          where: {
            deleted_at: null,
            active: true,
            party_type: route.partyType,
            balance: { gt: 0 },
            last_entry_date: { lte: cutoff },
            ...(afterId ? { id: { gt: afterId } } : {}),
          },
          select: {
            id: true,
            party_id: true,
            balance: true,
            last_entry_date: true,
            party: { select: { name: true } },
          },
          orderBy: { id: 'asc' },
          take: 100,
        });
        if (!accounts.length) break;
        reviewed += accounts.length;
        routeReviewed += accounts.length;
        for (const account of accounts) {
          const lastMovement = account.last_entry_date ? new Date(account.last_entry_date) : cutoff;
          const days = Math.max(30, Math.floor((today.getTime() - lastMovement.getTime()) / 86_400_000));
          if (preview.length < 8) preview.push(`• ${String(account.party?.name ?? 'Parte interesada').slice(0, 60)}: ${days} días sin movimientos`);
        }
        afterId = accounts[accounts.length - 1].id;
      }
      if (!routeReviewed) continue;
      const title = route.partyType === 'CUSTOMER'
        ? 'Saldos de clientes sin movimientos'
        : 'Saldos de proveedores sin movimientos';
      const message = [
        `${routeReviewed} cuenta(s) con saldo pendiente sin movimientos durante 30 días o más.`,
        ...preview,
        ...(routeReviewed > preview.length ? [`• Y ${routeReviewed - preview.length} cuenta(s) más.`] : []),
      ].join('\n');
      const contactsForRoute = [...contacts.entries()];
      for (const [recipientUserId, contact] of contactsForRoute) {
        const inserted = await this.enqueueForRecipient(companyId, recipientUserId, contact.phone_e164, {
          eventType: route.eventType,
          companyId,
          deduplicationKey: `${route.eventType}:digest:${recipientUserId}:${today.toISOString().slice(0, 10)}`,
          title,
          message,
          targetPath: '/erp/treasury/current-accounts',
        });
        if (inserted) queued += 1;
      }
    }
    return { queued, reviewed };
  }

  async deliverNextBatch() {
    const publicDb = this.publicDb();
    await publicDb.$executeRaw`
      UPDATE public.whatsapp_notification_outbox q
      SET status = 'CANCELLED',
          locked_at = NULL,
          last_error = 'El destinatario o la categoría ya no está habilitada.',
          updated_at = NOW()
      FROM public.company_whatsapp_notification_settings s
      WHERE s.company_id = q.company_id
        AND q.status = 'PENDING'
        AND (
          s.enabled = false
          OR NOT EXISTS (
            SELECT 1
            FROM public.company_users cu
            INNER JOIN public.users u ON u.id = cu.user_id AND u.active = true AND u.deleted_at IS NULL
            INNER JOIN public.user_whatsapp_contacts c ON c.user_id = u.id AND c.opted_in = true
            WHERE cu.company_id = q.company_id
              AND cu.user_id = q.recipient_user_id
              AND c.phone_e164 = q.recipient_phone
          )
          OR (q.event_type IN ('OV_ASSIGNED', 'OV_READY_FOR_DELIVERY') AND s.assignments_enabled = false)
          OR (q.event_type = 'CUSTOMER_BALANCE_OLD' AND (s.customer_balances_enabled = false OR NOT (s.customer_balance_recipient_ids @> to_jsonb(q.recipient_user_id::text))))
          OR (q.event_type = 'SUPPLIER_BALANCE_OLD' AND (s.supplier_balances_enabled = false OR NOT (s.supplier_balance_recipient_ids @> to_jsonb(q.recipient_user_id::text))))
          OR (q.event_type IN ('CHECK_DUE', 'CHECK_OVERDUE') AND (s.checks_enabled = false OR NOT (s.check_recipient_ids @> to_jsonb(q.recipient_user_id::text))))
        )
    `;
    await publicDb.$executeRaw`
      UPDATE public.whatsapp_notification_outbox
      SET status = CASE WHEN attempt_count >= 5 THEN 'FAILED' ELSE 'PENDING' END,
          locked_at = NULL,
          available_at = CASE WHEN attempt_count >= 5 THEN available_at ELSE NOW() END,
          last_error = CASE WHEN attempt_count >= 5 THEN 'El envío quedó interrumpido y alcanzó el máximo de intentos.' ELSE last_error END,
          updated_at = NOW()
      WHERE status = 'PROCESSING' AND locked_at < NOW() - INTERVAL '5 minutes'
    `;

    const candidates = await publicDb.$queryRaw<any[]>`
      SELECT q.id, q.company_id, q.recipient_user_id, q.recipient_phone,
             COALESCE(s.min_interval_seconds, 15) AS min_interval_seconds,
             COALESCE(s.batch_window_seconds, 20) AS batch_window_seconds
      FROM public.whatsapp_notification_outbox q
      INNER JOIN public.company_whatsapp_notification_settings s ON s.company_id = q.company_id
      WHERE q.status = 'PENDING'
        AND q.attempt_count < 5
        AND q.available_at <= NOW()
        AND q.created_at <= NOW() - (GREATEST(COALESCE(s.batch_window_seconds, 20), 10) * INTERVAL '1 second')
        AND s.enabled = true
      ORDER BY q.created_at ASC, q.id ASC
      LIMIT 1
    `;
    if (!candidates.length) return false;

    const candidate = candidates[0];
    const minInterval = Math.max(15, Math.min(300, Number(candidate.min_interval_seconds) || 15));
    const batchWindow = Math.max(10, Math.min(120, Number(candidate.batch_window_seconds) || 20));
    await publicDb.$executeRaw`
      INSERT INTO public.whatsapp_notification_dispatch_state (id, next_send_at, locked_until, updated_at)
      VALUES (1, NOW(), NULL, NOW())
      ON CONFLICT (id) DO NOTHING
    `;
    const lock = await publicDb.$queryRaw<any[]>`
      UPDATE public.whatsapp_notification_dispatch_state
      SET next_send_at = NOW() + (${minInterval} * INTERVAL '1 second'),
          locked_until = NOW() + INTERVAL '3 minutes',
          updated_at = NOW()
      WHERE id = 1
        AND (next_send_at IS NULL OR next_send_at <= NOW())
        AND (locked_until IS NULL OR locked_until < NOW())
      RETURNING id
    `;
    if (!lock.length) return false;

    let rows: any[] = [];
    try {
      rows = await publicDb.$queryRaw<any[]>`
        WITH candidates AS (
          SELECT id
          FROM public.whatsapp_notification_outbox
          WHERE status = 'PENDING'
            AND attempt_count < 5
            AND available_at <= NOW()
            AND created_at <= NOW() - (${batchWindow} * INTERVAL '1 second')
            AND company_id = ${candidate.company_id}::uuid
            AND recipient_user_id = ${candidate.recipient_user_id}::uuid
            AND recipient_phone = ${candidate.recipient_phone}
          ORDER BY created_at ASC, id ASC
          LIMIT 6
          FOR UPDATE SKIP LOCKED
        )
        UPDATE public.whatsapp_notification_outbox q
        SET status = 'PROCESSING', locked_at = NOW(), attempt_count = q.attempt_count + 1, updated_at = NOW()
        FROM candidates c
        WHERE q.id = c.id
        RETURNING q.id, q.recipient_phone, q.event_type, q.title, q.message, q.target_path, q.attempt_count
      `;
      if (!rows.length) return false;

      const message = this.composeMessage(rows);
      const idempotencyKey = `wa-outbox-${createHash('sha256').update(rows.map(row => row.id).sort().join(':')).digest('hex').slice(0, 48)}`;
      const result = await this.openWa.sendText(this.toChatId(candidate.recipient_phone), message, idempotencyKey);
      for (const row of rows) {
        await publicDb.$executeRaw`
          UPDATE public.whatsapp_notification_outbox
          SET status = 'SENT', sent_at = NOW(), provider_message_id = ${result?.messageId ?? null},
              locked_at = NULL, last_error = NULL, updated_at = NOW()
          WHERE id = ${row.id}::uuid AND status = 'PROCESSING'
        `;
      }
      this.logger.log(`WhatsApp operativo enviado a ${this.maskPhone(candidate.recipient_phone)} (${rows.length} aviso(s)).`);
      return true;
    } catch (error) {
      const detail = this.safeError(error);
      for (const row of rows) {
        const failed = Number(row.attempt_count) >= 5;
        const retryMinutes = Math.min(60, 2 ** Math.max(Number(row.attempt_count) - 1, 0));
        await publicDb.$executeRaw`
          UPDATE public.whatsapp_notification_outbox
          SET status = ${failed ? 'FAILED' : 'PENDING'},
              available_at = ${failed ? new Date() : new Date(Date.now() + retryMinutes * 60_000)},
              locked_at = NULL,
              last_error = ${detail.slice(0, 500)},
              updated_at = NOW()
          WHERE id = ${row.id}::uuid AND status = 'PROCESSING'
        `;
      }
      this.logger.warn(`Falló un envío operativo de WhatsApp a ${this.maskPhone(candidate.recipient_phone)}: ${detail}`);
      return false;
    } finally {
      await publicDb.$executeRaw`
        UPDATE public.whatsapp_notification_dispatch_state
        SET locked_until = NULL, updated_at = NOW()
        WHERE id = 1
      `;
    }
  }

  async purgeOldOutboxRows() {
    const result = await this.publicDb().$executeRaw`
      WITH expired AS (
        SELECT id
        FROM public.whatsapp_notification_outbox
        WHERE status IN ('SENT', 'FAILED', 'CANCELLED')
          AND updated_at < NOW() - INTERVAL '90 days'
        ORDER BY updated_at ASC
        LIMIT 2000
      )
      DELETE FROM public.whatsapp_notification_outbox q
      USING expired e
      WHERE q.id = e.id
    `;
    return result;
  }

  private async enqueueForRecipient(
    companyId: string,
    recipientUserId: string,
    phone: string,
    item: WhatsAppNotificationItem,
  ) {
    const normalizedPhone = this.normalizePhone(phone);
    if (!normalizedPhone) return false;
    const key = `${companyId}:${recipientUserId}:${item.deduplicationKey}`.slice(0, 300);
    const result = await this.publicDb().$executeRaw`
      INSERT INTO public.whatsapp_notification_outbox (
        id, company_id, recipient_user_id, recipient_phone, event_type, title, message,
        target_path, deduplication_key, status, attempt_count, available_at, created_at, updated_at
      ) VALUES (
        ${randomUUID()}::uuid,
        ${companyId}::uuid,
        ${recipientUserId}::uuid,
        ${normalizedPhone},
        ${item.eventType},
        ${item.title.slice(0, 160)},
        ${item.message.slice(0, 800)},
        ${item.targetPath ?? null},
        ${key},
        'PENDING',
        0,
        NOW(),
        NOW(),
        NOW()
      )
      ON CONFLICT (deduplication_key) DO NOTHING
    `;
    return result > 0;
  }

  private async findCompanySettings(companyId: string) {
    const rows = await this.publicDb().$queryRaw<any[]>`
      SELECT * FROM public.company_whatsapp_notification_settings
      WHERE company_id = ${companyId}::uuid
      LIMIT 1
    `;
    return rows[0] ?? null;
  }

  private async findOptedInContact(companyId: string, userId: string) {
    const rows = await this.publicDb().$queryRaw<any[]>`
      SELECT c.phone_e164
      FROM public.company_users cu
      INNER JOIN public.users u ON u.id = cu.user_id AND u.active = true AND u.deleted_at IS NULL
      INNER JOIN public.user_whatsapp_contacts c ON c.user_id = u.id AND c.opted_in = true
      WHERE cu.company_id = ${companyId}::uuid AND cu.user_id = ${userId}::uuid
      LIMIT 1
    `;
    return rows[0] ?? null;
  }

  private async findOptedInContacts(companyId: string, userIds: string[]) {
    if (!userIds.length) return new Map<string, { phone_e164: string }>();
    const rows = await this.publicDb().$queryRaw<any[]>`
      SELECT cu.user_id, c.phone_e164
      FROM public.company_users cu
      INNER JOIN public.users u ON u.id = cu.user_id AND u.active = true AND u.deleted_at IS NULL
      INNER JOIN public.user_whatsapp_contacts c ON c.user_id = u.id AND c.opted_in = true
      WHERE cu.company_id = ${companyId}::uuid
        AND cu.user_id IN (
          SELECT value::uuid FROM jsonb_array_elements_text(${JSON.stringify(userIds)}::jsonb) AS ids(value)
        )
        AND c.phone_e164 <> ''
    `;
    return new Map<string, { phone_e164: string }>(
      rows.map((row: any) => [String(row.user_id), { phone_e164: String(row.phone_e164) }]),
    );
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
      throw new ForbiddenException('Solo OWNER o ADMIN pueden configurar avisos empresariales por WhatsApp.');
    }
    return companyId;
  }

  private normalizeSettings(input: SaveWhatsAppNotificationSettingsInput): SaveWhatsAppNotificationSettingsInput {
    const recipientFields: Array<keyof SaveWhatsAppNotificationSettingsInput> = [
      'customer_balance_recipient_ids',
      'supplier_balance_recipient_ids',
      'check_recipient_ids',
    ];
    const normalized: any = { ...input };
    for (const field of recipientFields) {
      const value = input[field];
      if (!Array.isArray(value)) throw new BadRequestException('La lista de destinatarios no es válida.');
      normalized[field] = [...new Set(value)];
    }
    normalized.min_interval_seconds = Math.max(15, Math.min(300, Math.trunc(Number(input.min_interval_seconds) || 15)));
    normalized.batch_window_seconds = Math.max(10, Math.min(120, Math.trunc(Number(input.batch_window_seconds) || 20)));
    return normalized as SaveWhatsAppNotificationSettingsInput;
  }

  private toPublicSettings(row: any): SaveWhatsAppNotificationSettingsInput {
    if (!row) return { ...DEFAULT_SETTINGS };
    return {
      enabled: Boolean(row.enabled),
      assignments_enabled: Boolean(row.assignments_enabled),
      customer_balances_enabled: Boolean(row.customer_balances_enabled),
      customer_balance_recipient_ids: this.jsonIds(row.customer_balance_recipient_ids),
      supplier_balances_enabled: Boolean(row.supplier_balances_enabled),
      supplier_balance_recipient_ids: this.jsonIds(row.supplier_balance_recipient_ids),
      checks_enabled: Boolean(row.checks_enabled),
      check_recipient_ids: this.jsonIds(row.check_recipient_ids),
      min_interval_seconds: Number(row.min_interval_seconds ?? 15),
      batch_window_seconds: Number(row.batch_window_seconds ?? 20),
    };
  }

  private jsonIds(value: unknown): string[] {
    if (Array.isArray(value)) return value.filter((id): id is string => typeof id === 'string');
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  private normalizePhone(value: string | null | undefined) {
    const clean = String(value ?? '').trim().replace(/[\s().-]/g, '');
    if (!/^\+[1-9]\d{7,14}$/.test(clean)) return null;
    return clean;
  }

  private toChatId(phone: string) {
    return `${phone.replace(/\D/g, '')}@c.us`;
  }

  private composeMessage(rows: any[]) {
    if (rows.length === 1) {
      const row = rows[0];
      return `*${row.title}*\n${row.message}${row.target_path ? `\nAbrí Asterisk Suite: ${row.target_path}` : ''}`.slice(0, 3800);
    }
    const entries = rows.map(row => `• *${String(row.title).slice(0, 100)}*\n${String(row.message).slice(0, 350)}${row.target_path ? `\n${String(row.target_path).slice(0, 120)}` : ''}`);
    return `*Asterisk Suite · ${rows.length} avisos pendientes*\n\n${entries.join('\n\n')}`.slice(0, 3800);
  }

  private safeError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return message.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').slice(0, 500);
  }

  private maskPhone(value: string) {
    return value.length > 5 ? `${value.slice(0, 4)}••••${value.slice(-3)}` : 'destinatario';
  }

  private publicDb() {
    return this.db.getDefaultClient() as any;
  }
}
