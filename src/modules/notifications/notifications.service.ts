import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, type PrismaTransactionClient } from '@/prisma/prisma.service';

export interface CreateAssignmentNotificationInput {
  tx: PrismaTransactionClient;
  companyId?: string;
  recipientUserId: string;
  actorUserId: string;
  title: string;
  message: string;
  targetPath: string;
  targetType: string;
  targetId: string;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private argentinaDateStart(value = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(value);
    const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
    return new Date(Date.UTC(Number(part('year')), Number(part('month')) - 1, Number(part('day'))));
  }

  private nextArgentinaMidnight(value = new Date()) {
    const tomorrow = this.argentinaDateStart(value);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    // Argentina currently uses UTC-03:00 year-round.
    tomorrow.setUTCHours(3);
    return tomorrow;
  }

  async createAssignment(input: CreateAssignmentNotificationInput) {
    if (!input.companyId) {
      throw new BadRequestException('No se pudo resolver la empresa para validar la asignación');
    }

    const membership = await this.db.getDefaultClient().company_users.findUnique({
      where: {
        company_id_user_id: {
          company_id: input.companyId,
          user_id: input.recipientUserId,
        },
      },
      select: { user_id: true },
    });

    if (!membership) {
      throw new BadRequestException('El usuario asignado no pertenece a esta empresa');
    }

    if (input.recipientUserId === input.actorUserId) return null;

    return input.tx.user_notifications.create({
      data: {
        recipient_user_id: input.recipientUserId,
        actor_user_id: input.actorUserId,
        type: 'ASSIGNMENT',
        title: input.title,
        message: input.message,
        target_path: input.targetPath,
        target_type: input.targetType,
        target_id: input.targetId,
      },
    });
  }

  async listForUser(userId: string, requestedTake?: string) {
    const parsedTake = Number(requestedTake);
    const take = Number.isInteger(parsedTake) && parsedTake > 0
      ? Math.min(parsedTake, 50)
      : 30;
    const now = new Date();
    await this.prisma.user_notifications.updateMany({
      where: { recipient_user_id: userId, dismissed_until: { lte: now } },
      data: { dismissed_until: null, read_at: null },
    });
    await this.removeResolvedCheckReminders(userId);

    const where = { recipient_user_id: userId, dismissed_until: null };

    const [rows, unreadCount, totalCount] = await Promise.all([
      this.prisma.user_notifications.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take,
      }),
      this.prisma.user_notifications.count({ where: { ...where, read_at: null } }),
      this.prisma.user_notifications.count({ where }),
    ]);

    const actorIds = [...new Set(rows.map(row => row.actor_user_id).filter(Boolean))] as string[];
    const actors = actorIds.length
      ? await this.db.getDefaultClient().users.findMany({
          where: { id: { in: actorIds } },
          select: { id: true, name: true },
        })
      : [];
    const actorNames = new Map(actors.map(actor => [actor.id, actor.name]));

    return {
      items: rows.map(row => ({
        id: row.id,
        type: row.type,
        title: row.title,
        message: row.message,
        target_path: row.target_path,
        target_type: row.target_type,
        target_id: row.target_id,
        created_at: row.created_at,
        read_at: row.read_at,
        actor: row.actor_user_id
          ? { id: row.actor_user_id, name: actorNames.get(row.actor_user_id) ?? 'Usuario' }
          : null,
      })),
      unread_count: unreadCount,
      total_count: totalCount,
    };
  }

  private async removeResolvedCheckReminders(userId: string) {
    const today = this.argentinaDateStart();
    const upcomingLimit = new Date(today);
    upcomingLimit.setUTCDate(upcomingLimit.getUTCDate() + 2);
    const reminders = await this.prisma.user_notifications.findMany({
      where: {
        recipient_user_id: userId,
        type: { in: ['CHECK_DUE', 'CHECK_OVERDUE'] },
        target_type: { in: ['CHECK_DUE', 'CHECK_OVERDUE'] },
      },
      select: { id: true, type: true, target_id: true },
      orderBy: { created_at: 'desc' },
      take: 500,
    });
    if (!reminders.length) return;

    const checkIds = [...new Set(reminders.map(row => row.target_id).filter(Boolean))] as string[];
    const activeChecks = checkIds.length
      ? await this.prisma.checks.findMany({
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
      .filter(check => check.due_date <= today)
      .map(check => check.id));
    const activeUpcomingIds = new Set(activeChecks
      .filter(check => check.due_date > today && check.due_date <= upcomingLimit)
      .map(check => check.id));
    const resolvedIds = reminders.filter(row => {
      const activeIds = row.type === 'CHECK_DUE' ? activeUpcomingIds : activeOverdueIds;
      return !row.target_id || !activeIds.has(row.target_id);
    })
      .map(row => row.id);
    if (resolvedIds.length) {
      await this.prisma.user_notifications.deleteMany({
        where: { recipient_user_id: userId, id: { in: resolvedIds } },
      });
    }
  }

  async listActiveDismissals(userId: string) {
    const now = new Date();
    await this.prisma.user_notification_alert_dismissals.deleteMany({
      where: { recipient_user_id: userId, dismissed_until: { lte: now } },
    });
    const rows = await this.prisma.user_notification_alert_dismissals.findMany({
      where: { recipient_user_id: userId, dismissed_until: { gt: now } },
      select: { alert_key: true },
      take: 500,
    });
    return { alert_keys: rows.map(row => row.alert_key) };
  }

  async dismissAlert(userId: string, alertKey: string) {
    const key = alertKey.trim();
    if (!key || key.length > 200) throw new BadRequestException('Identificador de alerta inválido');
    const dismissedUntil = this.nextArgentinaMidnight();
    await this.prisma.user_notification_alert_dismissals.upsert({
      where: { recipient_user_id_alert_key: { recipient_user_id: userId, alert_key: key } },
      create: { recipient_user_id: userId, alert_key: key, dismissed_until: dismissedUntil },
      update: { dismissed_until: dismissedUntil, created_at: new Date() },
    });
    return { success: true, dismissed_until: dismissedUntil };
  }

  async dismiss(id: string, userId: string) {
    const now = new Date();
    const result = await this.prisma.user_notifications.updateMany({
      where: { id, recipient_user_id: userId },
      data: { read_at: now, dismissed_until: this.nextArgentinaMidnight(now) },
    });
    if (result.count === 0) throw new NotFoundException('Notificación no encontrada');
    return { success: true };
  }

  async markRead(id: string, userId: string) {
    const result = await this.prisma.user_notifications.updateMany({
      where: { id, recipient_user_id: userId, read_at: null },
      data: { read_at: new Date() },
    });

    if (result.count === 0) {
      const exists = await this.prisma.user_notifications.findFirst({
        where: { id, recipient_user_id: userId },
        select: { id: true },
      });
      if (!exists) throw new NotFoundException('Notificación no encontrada');
    }

    return { success: true };
  }

  async markAllRead(userId: string) {
    const now = new Date();
    const result = await this.prisma.user_notifications.updateMany({
      where: { recipient_user_id: userId, read_at: null, dismissed_until: null },
      data: { read_at: now, dismissed_until: this.nextArgentinaMidnight(now) },
    });
    return { success: true, updated: result.count };
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.user_notifications.deleteMany({
      where: { id, recipient_user_id: userId },
    });

    if (result.count === 0) throw new NotFoundException('Notificación no encontrada');
    return { success: true };
  }
}
