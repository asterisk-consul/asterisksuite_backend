import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class IntakeRecordsService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(body: { title?: string; notes?: string; suggested_type?: string }, userId: string) {
    return this.prisma.intake_records.create({
      data: {
        title: body.title?.trim() || 'Captura sin título',
        notes: body.notes?.trim() || null,
        suggested_type: body.suggested_type || null,
        created_by: userId,
      },
    });
  }

  async findAll(userId: string, scope?: string) {
    const where: any = { deleted_at: null };
    if (scope === 'mine') {
      where.created_by = userId;
    } else if (scope === 'assigned') {
      where.assigned_to = userId;
    } else {
      // La bandeja es personal: registros creados por el usuario o enviados a él.
      where.OR = [{ created_by: userId }, { assigned_to: userId }];
    }
    const records = await this.prisma.intake_records.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });
    return this.enrich(records);
  }

  async findOne(id: string) {
    const record = await this.prisma.intake_records.findFirst({ where: { id, deleted_at: null } });
    if (!record) throw new NotFoundException('Captura no encontrada');
    const [enriched] = await this.enrich([record]);
    return enriched;
  }

  async update(id: string, body: any, userId: string) {
    const record = await this.findOne(id);
    if (record.status !== 'DRAFT') throw new BadRequestException('Solo se puede editar una captura en borrador');
    return this.prisma.intake_records.update({
      where: { id },
      data: {
        title: body.title?.trim() || record.title,
        notes: body.notes === undefined ? record.notes : body.notes?.trim() || null,
        suggested_type: body.suggested_type === undefined ? record.suggested_type : body.suggested_type || null,
        updated_by: userId,
      },
    });
  }

  async send(id: string, assignedTo: string, userId: string) {
    const record = await this.findOne(id);
    if (record.status !== 'DRAFT') throw new BadRequestException('Solo se puede enviar una captura en borrador');
    if (!assignedTo) throw new BadRequestException('Seleccioná un usuario responsable');
    const attachmentCount = await this.prisma.entity_photos.count({
      where: { entity_type: 'intake', entity_id: id, deleted_at: null },
    });
    if (!attachmentCount) throw new BadRequestException('Subí al menos un archivo antes de enviar');
    return this.prisma.intake_records.update({
      where: { id },
      data: { status: 'SENT', assigned_to: assignedTo, sent_at: new Date(), updated_by: userId },
    });
  }

  async start(id: string, userId: string) {
    const record = await this.findOne(id);
    if (record.assigned_to !== userId) throw new BadRequestException('La captura está asignada a otro usuario');
    if (record.status !== 'SENT') throw new BadRequestException('La captura no está pendiente de procesamiento');
    return this.prisma.intake_records.update({ where: { id }, data: { status: 'IN_PROGRESS', updated_by: userId } });
  }

  async complete(id: string, body: { target_type: string; target_id: string }, userId: string) {
    const record = await this.findOne(id);
    if (!['DRAFT', 'SENT', 'IN_PROGRESS'].includes(record.status)) throw new BadRequestException('La captura no se puede completar');
    if (!body.target_type || !body.target_id) throw new BadRequestException('Indicá el registro creado');
    const entityTypeMap: Record<string, string> = {
      PAYMENT: 'payment', CHECK: 'check', PURCHASE_DOCUMENT: 'document', SALES_DOCUMENT: 'document',
      CHECK_DEPOSIT: 'check_deposit',
    };
    const attachments = await this.prisma.entity_photos.findMany({
      where: { entity_type: 'intake', entity_id: id, deleted_at: null },
    });
    return this.prisma.$transaction(async tx => {
      const targetEntityType = entityTypeMap[body.target_type];
      if (targetEntityType && attachments.length) {
        await tx.entity_photos.createMany({
          data: attachments.map(a => ({
            entity_type: targetEntityType, entity_id: body.target_id, file_id: a.file_id,
            photo_type: a.photo_type, created_by: userId,
          })),
        });
      }
      return tx.intake_records.update({
        where: { id },
        data: {
          status: 'COMPLETED', target_type: body.target_type, target_id: body.target_id,
          completed_at: new Date(), completed_by: userId, updated_by: userId,
        },
      });
    });
  }

  async remove(id: string, userId: string) {
    const record = await this.findOne(id);
    if (record.status !== 'DRAFT') throw new BadRequestException('Solo se puede eliminar una captura en borrador');
    if (record.assigned_to) throw new BadRequestException('No se puede eliminar una captura que ya fue asignada');
    if (record.created_by !== userId) throw new BadRequestException('Solo puede eliminarla el usuario que la creó');
    const attachments = await this.prisma.entity_photos.findMany({
      where: { entity_type: 'intake', entity_id: id, deleted_at: null },
    });
    const now = new Date();
    return this.prisma.$transaction(async tx => {
      if (attachments.length) {
        await tx.entity_photos.updateMany({
          where: { id: { in: attachments.map(a => a.id) } },
          data: { deleted_at: now, deleted_by: userId },
        });
        await tx.files.updateMany({
          where: { id: { in: attachments.map(a => a.file_id) } },
          data: { deleted_at: now, deleted_by: userId },
        });
      }
      return tx.intake_records.update({
        where: { id }, data: { deleted_at: now, deleted_by: userId },
      });
    });
  }

  private async enrich(records: any[]) {
    const userIds = [...new Set(records.flatMap(r => [r.created_by, r.assigned_to, r.completed_by]).filter(Boolean))] as string[];
    const users = userIds.length ? await this.db.getDefaultClient().users.findMany({
      where: { id: { in: userIds } }, select: { id: true, name: true, email: true },
    }) : [];
    const userMap = Object.fromEntries(users.map(u => [u.id, u]));
    return records.map(r => ({
      ...r,
      creator: r.created_by ? userMap[r.created_by] ?? null : null,
      assignee: r.assigned_to ? userMap[r.assigned_to] ?? null : null,
      completed_user: r.completed_by ? userMap[r.completed_by] ?? null : null,
    }));
  }
}
