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
    const where = { recipient_user_id: userId };

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
    const result = await this.prisma.user_notifications.updateMany({
      where: { recipient_user_id: userId, read_at: null },
      data: { read_at: new Date() },
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
