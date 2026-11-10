import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { requestContext } from '@/common/context/request-context';
import { TaskPriority } from '@/generated/prisma/client';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { WhatsAppNotificationsService } from '@/modules/notifications/whatsapp-notifications.service';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CreateTaskBoardDto, CreateTaskChecklistDto, CreateTaskChecklistItemDto, CreateTaskColumnDto, CreateTaskCommentDto, CreateTaskDto, CreateTaskLabelDto, MoveAllTasksDto, MoveTaskColumnDto, SetTaskCompletionDto, TaskColumnPreferencesDto, TaskMemberInputDto, TaskPriorityDto, UpdateTaskChecklistItemDto, UpdateTaskDto } from './dto/task.dto';

const DEFAULT_COLUMNS = [
  { name: 'Pendiente', color: 'neutral', is_closed: false },
  { name: 'En curso', color: 'info', is_closed: false },
  { name: 'En revisión', color: 'warning', is_closed: false },
  { name: 'Finalizada', color: 'success', is_closed: true },
];

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly db: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly whatsapp: WhatsAppNotificationsService,
  ) {}

  private context() {
    const context = requestContext.getStore();
    if (!context?.companyId || !context.schema || context.schema === 'public') {
      throw new ForbiddenException('Seleccioná una empresa');
    }
    return context;
  }

  private get tenant() {
    this.context();
    return this.db.getClientForCurrentContext();
  }

  async getNotificationSettings() {
    const companyId = this.context().companyId!;
    const row = await (this.db.getDefaultClient() as any).company_whatsapp_notification_settings.findUnique({
      where: { company_id: companyId },
      select: { in_app_tasks_enabled: true },
    });
    return { in_app_enabled: row?.in_app_tasks_enabled ?? true };
  }

  async updateNotificationSettings(inAppEnabled: boolean, user: AuthUser) {
    const companyId = this.context().companyId!;
    const settings = (this.db.getDefaultClient() as any).company_whatsapp_notification_settings;
    const row = await settings.upsert({
      where: { company_id: companyId },
      create: { company_id: companyId, in_app_tasks_enabled: inAppEnabled, configured_by: user.id },
      update: { in_app_tasks_enabled: inAppEnabled, configured_by: user.id },
      select: { in_app_tasks_enabled: true },
    });
    return { in_app_enabled: row.in_app_tasks_enabled };
  }

  async getBoards() {
    const boards = await this.tenant.task_boards.findMany({
      where: { active: true, deleted_at: null },
      orderBy: [{ is_default: 'desc' }, { name: 'asc' }],
      take: 50,
      select: {
        id: true,
        name: true,
        description: true,
        party_id: true,
        party: { select: { id: true, name: true } },
        is_default: true,
        created_at: true,
        _count: { select: { columns: true, tasks: true } },
      },
    });
    return boards;
  }

  async createBoard(dto: CreateTaskBoardDto, user: AuthUser) {
    const tenant = this.tenant;
    await this.validateParty(dto.party_id);
    const names = dto.columns?.length ? dto.columns.map(name => name.trim()) : DEFAULT_COLUMNS.map(column => column.name);
    if (names.some(name => !name) || new Set(names.map(name => name.toLocaleLowerCase('es'))).size !== names.length) {
      throw new BadRequestException('Los nombres de las columnas deben ser distintos y no pueden estar vacíos');
    }
    return tenant.$transaction(async (tx) => {
      const board = await tx.task_boards.create({
        data: {
          name: dto.name.trim(),
          description: dto.description?.trim() || null,
          party_id: dto.party_id ?? null,
          is_default: (await tx.task_boards.count({ where: { deleted_at: null } })) === 0,
          created_by: user.id,
          columns: {
            create: names.map((name, position) => ({
              name,
              position,
              color: DEFAULT_COLUMNS[position]?.color ?? 'neutral',
              is_closed: position === names.length - 1 && names.length > 1,
            })),
          },
        },
        select: { id: true, name: true, description: true, is_default: true },
      });
      return board;
    });
  }

  async createColumn(boardId: string, dto: CreateTaskColumnDto, user: AuthUser) {
    const tenant = this.tenant;
    const board = await tenant.task_boards.findFirst({ where: { id: boardId, active: true, deleted_at: null }, select: { id: true } });
    if (!board) throw new NotFoundException('Tablero no encontrado');
    const name = dto.name.trim();
    const existing = await tenant.task_board_columns.findFirst({
      where: { board_id: boardId, deleted_at: null, name: { equals: name, mode: 'insensitive' } },
      select: { id: true },
    });
    if (existing) throw new BadRequestException('Ya existe una lista con ese nombre en este tablero');
    const count = await tenant.task_board_columns.count({ where: { board_id: boardId, deleted_at: null } });
    if (count >= 50) throw new BadRequestException('El tablero admite hasta 50 listas');
    return tenant.task_board_columns.create({
      data: { board_id: boardId, name, position: count, color: 'neutral', created_by: user.id },
      select: { id: true, name: true, position: true, color: true, is_closed: true },
    });
  }

  async moveColumn(columnId: string, dto: MoveTaskColumnDto, user: AuthUser) {
    const tenant = this.tenant;
    const column = await tenant.task_board_columns.findFirst({ where: { id: columnId, deleted_at: null }, select: { id: true, board_id: true } });
    if (!column) throw new NotFoundException('Lista no encontrada');
    const columns = await tenant.task_board_columns.findMany({
      where: { board_id: column.board_id, deleted_at: null },
      orderBy: [{ position: 'asc' }, { created_at: 'asc' }],
      take: 50,
      select: { id: true },
    });
    const currentIndex = columns.findIndex(item => item.id === column.id);
    const targetIndex = Math.min(dto.position, columns.length - 1);
    if (currentIndex === -1 || currentIndex === targetIndex) return { success: true };
    const reordered = [...columns];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved!);
    await tenant.$transaction(reordered.map((item, position) => tenant.task_board_columns.update({ where: { id: item.id }, data: { position, updated_by: user.id } })));
    return { success: true };
  }

  async copyColumn(columnId: string, user: AuthUser) {
    const tenant = this.tenant;
    const source = await tenant.task_board_columns.findFirst({
      where: { id: columnId, deleted_at: null },
      select: { id: true, board_id: true, name: true, color: true, is_closed: true },
    });
    if (!source) throw new NotFoundException('Lista no encontrada');
    const sourceTasks = await tenant.tasks.findMany({
      where: { column_id: source.id, deleted_at: null },
      orderBy: [{ position: 'asc' }, { created_at: 'asc' }],
      take: 501,
      select: {
        title: true, description: true, priority: true, party_id: true, assigned_to: true, start_at: true, due_at: true,
        labels: { select: { label_id: true } },
      },
    });
    if (sourceTasks.length > 500) throw new BadRequestException('Esta lista supera las 500 tareas; no se puede duplicar completa en una sola operación');
    const position = await tenant.task_board_columns.count({ where: { board_id: source.board_id, deleted_at: null } });
    const copyName = `${source.name.slice(0, 72)} (copia)`;
    return tenant.$transaction(async tx => {
      const copy = await tx.task_board_columns.create({
        data: { board_id: source.board_id, name: copyName, color: source.color, is_closed: source.is_closed, position, created_by: user.id },
        select: { id: true, name: true, position: true, color: true, is_closed: true },
      });
      for (const [index, task] of sourceTasks.entries()) {
        await tx.tasks.create({
          data: {
            board_id: source.board_id,
            column_id: copy.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            party_id: task.party_id,
            assigned_to: task.assigned_to,
            start_at: task.start_at,
            due_at: task.due_at,
            position: index,
            completed_at: source.is_closed ? new Date() : null,
            created_by: user.id,
            labels: task.labels.length ? { create: task.labels.map(({ label_id }) => ({ label: { connect: { id: label_id } } })) } : undefined,
          },
          select: { id: true },
        });
      }
      return { ...copy, copied_tasks: sourceTasks.length };
    });
  }

  async moveAllTasks(columnId: string, dto: MoveAllTasksDto, user: AuthUser) {
    const tenant = this.tenant;
    const source = await tenant.task_board_columns.findFirst({ where: { id: columnId, deleted_at: null }, select: { id: true, board_id: true } });
    if (!source) throw new NotFoundException('Lista de origen no encontrada');
    const target = await tenant.task_board_columns.findFirst({ where: { id: dto.target_column_id, board_id: source.board_id, deleted_at: null }, select: { id: true, is_closed: true } });
    if (!target) throw new BadRequestException('La lista de destino debe pertenecer al mismo tablero');
    if (target.id === source.id) throw new BadRequestException('Elegí una lista de destino diferente');
    const tasks = await tenant.tasks.findMany({
      where: { column_id: source.id, deleted_at: null },
      orderBy: [{ position: 'asc' }, { created_at: 'asc' }],
      take: 1001,
      select: { id: true },
    });
    if (tasks.length > 1000) throw new BadRequestException('Esta acción admite hasta 1.000 tareas por vez');
    const maxPosition = await tenant.tasks.aggregate({ where: { column_id: target.id, deleted_at: null }, _max: { position: true } });
    await tenant.$transaction(async tx => {
      for (const [index, task] of tasks.entries()) {
        await tx.tasks.update({
          where: { id: task.id },
          data: { column_id: target.id, position: (maxPosition._max.position ?? -1) + index + 1, completed_at: target.is_closed ? new Date() : null, updated_by: user.id },
        });
      }
    });
    return { moved_tasks: tasks.length };
  }

  async updateColumnPreferences(columnId: string, userId: string, dto: TaskColumnPreferencesDto) {
    if (dto.is_pinned === undefined && dto.is_watching === undefined) throw new BadRequestException('No hay preferencias para actualizar');
    const tenant = this.tenant;
    const column = await tenant.task_board_columns.findFirst({ where: { id: columnId, deleted_at: null }, select: { id: true } });
    if (!column) throw new NotFoundException('Lista no encontrada');
    return tenant.task_board_column_preferences.upsert({
      where: { column_id_user_id: { column_id: columnId, user_id: userId } },
      create: { column_id: columnId, user_id: userId, is_pinned: dto.is_pinned ?? false, is_watching: dto.is_watching ?? false },
      update: { ...(dto.is_pinned !== undefined ? { is_pinned: dto.is_pinned } : {}), ...(dto.is_watching !== undefined ? { is_watching: dto.is_watching } : {}) },
      select: { is_pinned: true, is_watching: true },
    });
  }

  async getBoard(boardId: string, partyId: string | undefined, userId: string) {
    const board = await this.tenant.task_boards.findFirst({
      where: { id: boardId, active: true, deleted_at: null },
      select: {
        id: true,
        name: true,
        description: true,
        party_id: true,
        party: { select: { id: true, name: true } },
        is_default: true,
        columns: {
          where: { deleted_at: null },
          orderBy: [{ position: 'asc' }, { created_at: 'asc' }],
          select: {
            id: true,
            name: true,
            position: true,
            color: true,
            is_closed: true,
            preferences: { where: { user_id: userId }, select: { is_pinned: true, is_watching: true }, take: 1 },
            _count: {
              select: {
                tasks: { where: { deleted_at: null, ...(partyId ? { party_id: partyId } : {}) } },
              },
            },
            tasks: {
              where: { deleted_at: null, ...(partyId ? { party_id: partyId } : {}) },
              orderBy: [{ position: 'asc' }, { updated_at: 'desc' }],
              take: 100,
              select: {
                id: true,
                title: true,
                description: true,
                priority: true,
                assigned_to: true,
                start_at: true,
                due_at: true,
                position: true,
                created_at: true,
                updated_at: true,
                completed_at: true,
                party: { select: { id: true, name: true } },
                members: { select: { user_id: true, role: true } },
                labels: { select: { label: { select: { id: true, name: true, color: true } } } },
                _count: { select: { comments: true, checklists: true } },
              },
            },
          },
        },
      },
    });
    if (!board) throw new NotFoundException('Tablero no encontrado');
    const decorated = await this.attachAssignees(board.columns.flatMap(column => column.tasks));
    const taskMap = new Map(decorated.map(task => [task.id, task]));
    return {
      ...board,
      columns: [...board.columns]
        .sort((a, b) => Number(b.preferences[0]?.is_pinned ?? false) - Number(a.preferences[0]?.is_pinned ?? false) || a.position - b.position)
        .map(column => ({
        ...column,
        is_pinned: column.preferences[0]?.is_pinned ?? false,
        is_watching: column.preferences[0]?.is_watching ?? false,
        total_tasks: column._count.tasks,
        tasks: column.tasks.map(task => ({
          ...(taskMap.get(task.id) ?? task),
          labels: task.labels.map(({ label }) => label),
          comments_count: task._count.comments,
          checklist_count: task._count.checklists,
        })),
        limited: column._count.tasks > column.tasks.length,
      })),
    };
  }

  async getTasksByParty(partyId: string, limit = 100) {
    this.context();
    const tenant = this.db.getClientForCurrentContext();
    const party = await tenant.business_parties.findFirst({
      where: {
        id: partyId,
        deleted_at: null,
        OR: [
          { type: 'CUSTOMER' },
          { roles: { some: { role: 'CUSTOMER', active: true } } },
        ],
      },
      select: { id: true },
    });
    if (!party) throw new NotFoundException('Cliente no encontrado');
    const tasks = await tenant.tasks.findMany({
      where: { party_id: partyId, deleted_at: null },
      orderBy: [{ due_at: 'asc' }, { updated_at: 'desc' }],
      take: Math.min(limit, 200),
      select: {
        id: true,
        board_id: true,
        title: true,
        description: true,
        priority: true,
        assigned_to: true,
        due_at: true,
        position: true,
        updated_at: true,
        completed_at: true,
        board: { select: { name: true } },
        column: { select: { name: true, is_closed: true } },
        members: { select: { user_id: true, role: true } },
      },
    });
    return this.attachAssignees(tasks);
  }

  async getMembers() {
    const context = this.context();
    const members = await this.db.getDefaultClient().company_users.findMany({
      where: { company_id: context.companyId, user: { active: true, deleted_at: null } },
      select: { user: { select: { id: true, name: true } } },
      take: 500,
    });
    return members.map(({ user }) => user).sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }

  async getLabels() {
    return this.tenant.task_labels.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      take: 200,
      select: { id: true, name: true, color: true },
    });
  }

  async createLabel(dto: CreateTaskLabelDto, user: AuthUser) {
    const tenant = this.tenant;
    const name = dto.name.trim();
    const existing = await tenant.task_labels.findUnique({ where: { name } });
    if (existing) {
      if (!existing.active) return tenant.task_labels.update({ where: { id: existing.id }, data: { active: true, color: dto.color ?? existing.color } });
      return existing;
    }
    return tenant.task_labels.create({
      data: { name, color: dto.color ?? 'primary', created_by: user.id },
      select: { id: true, name: true, color: true },
    });
  }

  async getComments(taskId: string) {
    const tenant = this.tenant;
    const task = await tenant.tasks.findFirst({ where: { id: taskId, deleted_at: null }, select: { id: true } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    const comments = await tenant.task_comments.findMany({
      where: { task_id: taskId },
      orderBy: { created_at: 'asc' },
      take: 200,
      select: { id: true, content: true, created_at: true, created_by: true },
    });
    const users = await this.db.getDefaultClient().users.findMany({
      where: { id: { in: [...new Set(comments.map(comment => comment.created_by))] } },
      select: { id: true, name: true },
      take: comments.length,
    });
    const byId = new Map<string, { id: string; name: string }>(users.map(user => [user.id, user] as const));
    return comments.map(comment => ({ ...comment, author: byId.get(comment.created_by) ?? null }));
  }

  async createComment(taskId: string, dto: CreateTaskCommentDto, user: AuthUser) {
    const tenant = this.tenant;
    const context = this.context();
    const inAppEnabled = await this.getInAppTasksNotificationsEnabled(context.companyId!);
    const task = await tenant.tasks.findFirst({
      where: { id: taskId, deleted_at: null },
      select: { id: true, title: true, board_id: true, assigned_to: true, created_by: true, members: { select: { user_id: true } } },
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    const content = dto.content.trim();
    const recipients = [...new Set([task.assigned_to, task.created_by, ...task.members.map(member => member.user_id)].filter((id): id is string => !!id))];
    const targetPath = this.taskPath(task.board_id, task.id);
    const comment = await tenant.$transaction(async tx => {
      const created = await tx.task_comments.create({
        data: { task_id: taskId, content, created_by: user.id },
        select: { id: true, content: true, created_at: true, created_by: true },
      });
      if (inAppEnabled) {
        await this.notifications.createTaskActivity({
          tx,
          companyId: context.companyId,
          recipientUserIds: recipients,
          actorUserId: user.id,
          type: 'TASK_COMMENTED',
          title: `Nuevo comentario en ${task.title}`,
          message: content.length > 280 ? `${content.slice(0, 277)}…` : content,
          targetPath,
          taskId: task.id,
        });
      }
      return created;
    });
    await this.enqueueTaskWhatsApp({
      companyId: context.companyId!, recipientUserIds: recipients, eventType: 'TASK_COMMENTED',
      taskId: task.id, boardId: task.board_id, taskTitle: task.title, detail: content, actorUserId: user.id,
    });
    return comment;
  }

  async getChecklists(taskId: string) {
    const tenant = this.tenant;
    const task = await tenant.tasks.findFirst({ where: { id: taskId, deleted_at: null }, select: { id: true } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    return tenant.task_checklists.findMany({
      where: { task_id: taskId },
      orderBy: [{ position: 'asc' }, { created_at: 'asc' }],
      select: {
        id: true, title: true, position: true,
        items: { orderBy: [{ position: 'asc' }, { created_at: 'asc' }], select: { id: true, content: true, completed: true, position: true, assigned_to: true, due_at: true } },
      },
    });
  }

  async createChecklist(taskId: string, dto: CreateTaskChecklistDto, user: AuthUser) {
    const tenant = this.tenant;
    const task = await tenant.tasks.findFirst({ where: { id: taskId, deleted_at: null }, select: { id: true } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    const position = await tenant.task_checklists.count({ where: { task_id: taskId } });
    if (position >= 20) throw new BadRequestException('Cada tarea admite hasta 20 checklist');
    return tenant.task_checklists.create({ data: { task_id: taskId, title: dto.title.trim(), position, created_by: user.id }, select: { id: true, title: true, position: true, items: true } });
  }

  async deleteChecklist(checklistId: string) {
    const tenant = this.tenant;
    const checklist = await tenant.task_checklists.findUnique({ where: { id: checklistId }, select: { id: true } });
    if (!checklist) throw new NotFoundException('Lista de comprobación no encontrada');
    await tenant.task_checklists.delete({ where: { id: checklistId } });
    return { success: true };
  }

  async createChecklistItem(checklistId: string, dto: CreateTaskChecklistItemDto, user: AuthUser) {
    const tenant = this.tenant;
    const checklist = await tenant.task_checklists.findUnique({ where: { id: checklistId }, select: { id: true } });
    if (!checklist) throw new NotFoundException('Lista de comprobación no encontrada');
    const position = await tenant.task_checklist_items.count({ where: { checklist_id: checklistId } });
    if (position >= 100) throw new BadRequestException('Cada checklist admite hasta 100 elementos');
    return tenant.task_checklist_items.create({ data: { checklist_id: checklistId, content: dto.content.trim(), position, created_by: user.id }, select: { id: true, content: true, completed: true, position: true, assigned_to: true, due_at: true } });
  }

  async updateChecklistItem(itemId: string, dto: UpdateTaskChecklistItemDto, user: AuthUser) {
    const tenant = this.tenant;
    const item = await tenant.task_checklist_items.findUnique({ where: { id: itemId }, select: { id: true } });
    if (!item) throw new NotFoundException('Elemento de checklist no encontrado');
    if (dto.assigned_to !== undefined) await this.validateMember(dto.assigned_to);
    return tenant.task_checklist_items.update({
      where: { id: itemId },
      data: {
        ...(dto.content !== undefined ? { content: dto.content.trim() } : {}),
        ...(dto.completed !== undefined ? { completed: dto.completed } : {}),
        ...(dto.assigned_to !== undefined ? { assigned_to: dto.assigned_to ?? null } : {}),
        ...(dto.due_at !== undefined ? { due_at: dto.due_at ? new Date(dto.due_at) : null } : {}),
        updated_by: user.id,
      },
      select: { id: true, content: true, completed: true, position: true, assigned_to: true, due_at: true },
    });
  }

  async deleteChecklistItem(itemId: string) {
    const tenant = this.tenant;
    const item = await tenant.task_checklist_items.findUnique({ where: { id: itemId }, select: { id: true } });
    if (!item) throw new NotFoundException('Elemento de checklist no encontrado');
    await tenant.task_checklist_items.delete({ where: { id: itemId } });
    return { success: true };
  }

  async createTask(boardId: string, dto: CreateTaskDto, user: AuthUser) {
    const tenant = this.tenant;
    const context = this.context();
    const board = await tenant.task_boards.findFirst({ where: { id: boardId, active: true, deleted_at: null }, select: { id: true, party_id: true } });
    if (!board) throw new NotFoundException('Tablero no encontrado');
    const column = await tenant.task_board_columns.findFirst({ where: { id: dto.column_id, board_id: boardId, deleted_at: null }, select: { id: true, is_closed: true } });
    if (!column) throw new BadRequestException('La columna no pertenece a este tablero');
    if (board.party_id && dto.party_id && board.party_id !== dto.party_id) {
      throw new BadRequestException('Las tareas de este tablero deben pertenecer al cliente asociado');
    }
    const partyId = board.party_id ?? dto.party_id;
    await this.validateParty(partyId);
    await this.validateMember(dto.assigned_to);
    const taskMembers = this.withoutResponsible(dto.members ?? [], dto.assigned_to);
    await this.validateMembers(taskMembers);
    await this.validateLabels(dto.label_ids);
    const maxPosition = await tenant.tasks.aggregate({ where: { column_id: column.id, deleted_at: null }, _max: { position: true } });
    const title = dto.title.trim();
    const description = dto.description?.trim() || null;
    const inAppEnabled = await this.getInAppTasksNotificationsEnabled(context.companyId!);
    const task = await tenant.$transaction(async tx => {
      const created = await tx.tasks.create({
        data: {
          board_id: boardId,
          column_id: column.id,
          title,
          description,
          priority: (dto.priority ?? TaskPriorityDto.NORMAL) as TaskPriority,
          party_id: partyId ?? null,
          assigned_to: dto.assigned_to ?? null,
          start_at: dto.start_at ? new Date(dto.start_at) : null,
          due_at: dto.due_at ? new Date(dto.due_at) : null,
          position: (maxPosition._max.position ?? -1) + 1,
          completed_at: column.is_closed ? new Date() : null,
          created_by: user.id,
          labels: dto.label_ids?.length ? { create: dto.label_ids.map(label_id => ({ label: { connect: { id: label_id } } })) } : undefined,
        },
        select: { id: true, board_id: true, title: true, assigned_to: true, description: true },
      });
      if (taskMembers.length) {
        await tx.task_members.createMany({
          data: taskMembers.map(member => ({ task_id: created.id, user_id: member.user_id, role: member.role, created_by: user.id })),
          skipDuplicates: true,
        });
      }
      if (inAppEnabled) {
        if (created.assigned_to) {
          await this.notifications.createTaskActivity({
            tx, companyId: context.companyId, recipientUserIds: [created.assigned_to], actorUserId: user.id,
            type: 'TASK_ASSIGNED', title: 'Te asignaron una tarea', message: created.title,
            targetPath: this.taskPath(created.board_id, created.id), taskId: created.id,
          });
        }
        if (taskMembers.length) {
          await this.notifications.createTaskActivity({
            tx, companyId: context.companyId, recipientUserIds: taskMembers.map(member => member.user_id), actorUserId: user.id,
            type: 'TASK_MEMBER_ADDED', title: 'Te sumaron a una tarea', message: created.title,
            targetPath: this.taskPath(created.board_id, created.id), taskId: created.id,
          });
        }
        const mentionedIds = this.extractMentionedUserIds(created.description)
          .filter(id => id !== created.assigned_to && !taskMembers.some(member => member.user_id === id));
        if (mentionedIds.length) {
          await this.notifications.createTaskActivity({
            tx, companyId: context.companyId, recipientUserIds: mentionedIds, actorUserId: user.id,
            type: 'TASK_MENTIONED', title: 'Te mencionaron en una tarea', message: created.title,
            targetPath: this.taskPath(created.board_id, created.id), taskId: created.id,
          });
        }
      }
      return created;
    });
    const mentionedIds = this.extractMentionedUserIds(task.description)
      .filter(id => id !== task.assigned_to && !taskMembers.some(member => member.user_id === id));
    if (task.assigned_to) await this.enqueueTaskWhatsApp({ companyId: context.companyId!, recipientUserIds: [task.assigned_to], eventType: 'TASK_ASSIGNED', taskId: task.id, boardId: task.board_id, taskTitle: task.title, actorUserId: user.id });
    if (taskMembers.length) await this.enqueueTaskWhatsApp({ companyId: context.companyId!, recipientUserIds: taskMembers.map(member => member.user_id), eventType: 'TASK_MEMBER_ADDED', taskId: task.id, boardId: task.board_id, taskTitle: task.title, actorUserId: user.id });
    if (mentionedIds.length) await this.enqueueTaskWhatsApp({ companyId: context.companyId!, recipientUserIds: mentionedIds, eventType: 'TASK_MENTIONED', taskId: task.id, boardId: task.board_id, taskTitle: task.title, actorUserId: user.id });
    return { id: task.id };
  }

  async setTaskCompletion(taskId: string, dto: SetTaskCompletionDto, user: AuthUser) {
    const tenant = this.tenant;
    return tenant.$transaction(async tx => {
      const task = await tx.tasks.findFirst({
        where: { id: taskId, deleted_at: null },
        select: { id: true, board_id: true, column_id: true, completed_at: true, column: { select: { is_closed: true } } },
      });
      if (!task) throw new NotFoundException('Tarea no encontrada');
      if (!!task.completed_at === dto.completed) return { success: true, completed: dto.completed, column_id: task.column_id, position: undefined, completed_at: task.completed_at };

      let targetColumn: { id: string; is_closed: boolean } | null = null;
      if (dto.completed) {
        targetColumn = await tx.task_board_columns.findFirst({
          where: { board_id: task.board_id, deleted_at: null, is_closed: true },
          orderBy: [{ position: 'asc' }, { created_at: 'asc' }],
          select: { id: true, is_closed: true },
        });
      } else if (task.column.is_closed) {
        targetColumn = await tx.task_board_columns.findFirst({
          where: { board_id: task.board_id, deleted_at: null, is_closed: false },
          orderBy: [{ position: 'asc' }, { created_at: 'asc' }],
          select: { id: true, is_closed: true },
        });
      }

      const data: Record<string, unknown> = {
        completed_at: dto.completed ? new Date() : null,
        updated_by: user.id,
      };
      if (targetColumn && targetColumn.id !== task.column_id) {
        const maxPosition = await tx.tasks.aggregate({ where: { column_id: targetColumn.id, deleted_at: null }, _max: { position: true } });
        data.column_id = targetColumn.id;
        data.position = (maxPosition._max.position ?? -1) + 1;
      }
      const updated = await tx.tasks.update({
        where: { id: task.id },
        data: data as any,
        select: { column_id: true, position: true, completed_at: true },
      });
      return { success: true, completed: dto.completed, ...updated };
    });
  }

  async updateTask(taskId: string, dto: UpdateTaskDto, user: AuthUser) {
    const tenant = this.tenant;
    const context = this.context();
    const task = await tenant.tasks.findFirst({ where: { id: taskId, deleted_at: null }, select: { id: true, title: true, description: true, assigned_to: true, created_by: true, board_id: true, column_id: true, members: { select: { user_id: true, role: true } }, board: { select: { party_id: true } } } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    const targetColumn = dto.column_id
      ? await tenant.task_board_columns.findFirst({
        where: { id: dto.column_id, board_id: task.board_id, deleted_at: null },
        select: { id: true, is_closed: true },
      })
      : undefined;
    if (dto.column_id) {
      if (!targetColumn) throw new BadRequestException('La columna no pertenece al tablero de esta tarea');
    }
    if (dto.party_id !== undefined) {
      if (task.board.party_id && dto.party_id && task.board.party_id !== dto.party_id) {
        throw new BadRequestException('Las tareas de este tablero deben pertenecer al cliente asociado');
      }
      await this.validateParty(dto.party_id);
    }
    if (dto.assigned_to !== undefined) await this.validateMember(dto.assigned_to);
    const assignedTo = dto.assigned_to !== undefined ? dto.assigned_to : task.assigned_to;
    const nextMembers = this.withoutResponsible(dto.members ?? task.members, assignedTo);
    if (dto.members !== undefined) await this.validateMembers(nextMembers);
    if (dto.label_ids !== undefined) await this.validateLabels(dto.label_ids);
    const inAppEnabled = await this.getInAppTasksNotificationsEnabled(context.companyId!);
    const data: Record<string, unknown> = { updated_by: user.id };
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.description !== undefined) data.description = dto.description?.trim() || null;
    if (dto.priority !== undefined) data.priority = dto.priority as TaskPriority;
    if (dto.party_id !== undefined) data.party_id = dto.party_id ?? null;
    if (dto.assigned_to !== undefined) data.assigned_to = dto.assigned_to ?? null;
    if (dto.start_at !== undefined) data.start_at = dto.start_at ? new Date(dto.start_at) : null;
    if (dto.due_at !== undefined) data.due_at = dto.due_at ? new Date(dto.due_at) : null;
    if (targetColumn) {
      data.column_id = targetColumn.id;
      data.completed_at = targetColumn.is_closed ? new Date() : null;
    }
    if (dto.position !== undefined) data.position = dto.position;
    const updated = await tenant.$transaction(async tx => {
      if (dto.label_ids !== undefined) {
        await tx.task_label_assignments.deleteMany({ where: { task_id: task.id } });
        if (dto.label_ids.length) {
          await tx.task_label_assignments.createMany({ data: dto.label_ids.map(label_id => ({ task_id: task.id, label_id })), skipDuplicates: true });
        }
      }
      if (dto.members !== undefined || dto.assigned_to !== undefined) {
        await tx.task_members.deleteMany({ where: { task_id: task.id } });
        if (nextMembers.length) {
          await tx.task_members.createMany({
            data: nextMembers.map(member => ({ task_id: task.id, user_id: member.user_id, role: member.role, created_by: user.id })),
            skipDuplicates: true,
          });
        }
      }
      const result = await tx.tasks.update({ where: { id: task.id }, data: data as any, select: { id: true, title: true, description: true, assigned_to: true, board_id: true } });
      if (inAppEnabled) {
        if (result.assigned_to && result.assigned_to !== task.assigned_to) {
          await this.notifications.createTaskActivity({
            tx, companyId: context.companyId, recipientUserIds: [result.assigned_to], actorUserId: user.id,
            type: 'TASK_ASSIGNED', title: 'Te asignaron una tarea', message: result.title,
            targetPath: this.taskPath(result.board_id, result.id), taskId: result.id,
          });
        }
        const existingMemberIds = new Set(task.members.map(member => member.user_id));
        const addedMemberIds = nextMembers.map(member => member.user_id).filter(id => !existingMemberIds.has(id));
        if (addedMemberIds.length) {
          await this.notifications.createTaskActivity({
            tx, companyId: context.companyId, recipientUserIds: addedMemberIds, actorUserId: user.id,
            type: 'TASK_MEMBER_ADDED', title: 'Te sumaron a una tarea', message: result.title,
            targetPath: this.taskPath(result.board_id, result.id), taskId: result.id,
          });
        }
        const previousMentions = new Set(this.extractMentionedUserIds(task.description));
        const addedMentions = this.extractMentionedUserIds(result.description)
          .filter(id => !previousMentions.has(id) && id !== result.assigned_to && !addedMemberIds.includes(id));
        if (addedMentions.length) {
          await this.notifications.createTaskActivity({
            tx, companyId: context.companyId, recipientUserIds: addedMentions, actorUserId: user.id,
            type: 'TASK_MENTIONED', title: 'Te mencionaron en una tarea', message: result.title,
            targetPath: this.taskPath(result.board_id, result.id), taskId: result.id,
          });
        }
      }
      return result;
    });
    if (updated.assigned_to && updated.assigned_to !== task.assigned_to) await this.enqueueTaskWhatsApp({ companyId: context.companyId!, recipientUserIds: [updated.assigned_to], eventType: 'TASK_ASSIGNED', taskId: updated.id, boardId: updated.board_id, taskTitle: updated.title, actorUserId: user.id });
    const existingMemberIds = new Set(task.members.map(member => member.user_id));
    const addedMemberIds = nextMembers.map(member => member.user_id).filter(id => !existingMemberIds.has(id));
    if (addedMemberIds.length) await this.enqueueTaskWhatsApp({ companyId: context.companyId!, recipientUserIds: addedMemberIds, eventType: 'TASK_MEMBER_ADDED', taskId: updated.id, boardId: updated.board_id, taskTitle: updated.title, actorUserId: user.id });
    const previousMentions = new Set(this.extractMentionedUserIds(task.description));
    const addedMentions = this.extractMentionedUserIds(updated.description)
      .filter(id => !previousMentions.has(id) && id !== updated.assigned_to && !addedMemberIds.includes(id));
    if (addedMentions.length) await this.enqueueTaskWhatsApp({ companyId: context.companyId!, recipientUserIds: addedMentions, eventType: 'TASK_MENTIONED', taskId: updated.id, boardId: updated.board_id, taskTitle: updated.title, actorUserId: user.id });
    return { id: updated.id };
  }

  async getTask(taskId: string) {
    const task = await this.tenant.tasks.findFirst({
      where: { id: taskId, deleted_at: null },
      select: {
        id: true, board_id: true, column_id: true, title: true, description: true, priority: true,
        assigned_to: true, start_at: true, due_at: true, position: true, created_at: true,
        updated_at: true, completed_at: true, party: { select: { id: true, name: true } },
        members: { select: { user_id: true, role: true } },
        labels: { select: { label: { select: { id: true, name: true, color: true } } } },
        _count: { select: { comments: true, checklists: true } },
      },
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    const [decorated] = await this.attachAssignees([task]);
    return {
      ...decorated,
      labels: task.labels.map(({ label }) => label),
      comments_count: task._count.comments,
      checklist_count: task._count.checklists,
    };
  }

  private taskPath(boardId: string, taskId: string) {
    return `/erp/tasks?board_id=${encodeURIComponent(boardId)}&task_id=${encodeURIComponent(taskId)}`;
  }

  private async getInAppTasksNotificationsEnabled(companyId: string) {
    const row = await (this.db.getDefaultClient() as any).company_whatsapp_notification_settings.findUnique({
      where: { company_id: companyId },
      select: { in_app_tasks_enabled: true },
    });
    return row?.in_app_tasks_enabled !== false;
  }

  private extractMentionedUserIds(description?: string | null) {
    if (!description) return [];
    const ids = new Set<string>();
    const spanRegex = /<span\b[^>]*data-task-mention\s*=\s*["']true["'][^>]*>/gi;
    const idRegex = /\bdata-user-id\s*=\s*["']([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})["']/i;
    for (const match of description.matchAll(spanRegex)) {
      const id = match[0].match(idRegex)?.[1]?.toLowerCase();
      if (id) ids.add(id);
      if (ids.size >= 30) break;
    }
    return [...ids];
  }

  private async enqueueTaskWhatsApp(input: {
    companyId: string;
    recipientUserIds: string[];
    eventType: 'TASK_ASSIGNED' | 'TASK_MEMBER_ADDED' | 'TASK_COMMENTED' | 'TASK_MENTIONED';
    taskId: string;
    boardId: string;
    taskTitle: string;
    actorUserId: string;
    detail?: string;
  }) {
    try {
      await this.whatsapp.enqueueTaskActivity(input);
    } catch (error) {
      this.logger.warn(`No se pudo encolar el aviso WhatsApp de tarea ${input.taskId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async deleteTask(taskId: string, user: AuthUser) {
    const tenant = this.tenant;
    const task = await tenant.tasks.findFirst({ where: { id: taskId, deleted_at: null }, select: { id: true } });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    await tenant.tasks.update({ where: { id: task.id }, data: { deleted_at: new Date(), updated_by: user.id } });
    return { success: true };
  }

  private async validateParty(partyId?: string | null) {
    if (!partyId) return;
    const party = await this.tenant.business_parties.findFirst({
      where: {
        id: partyId,
        deleted_at: null,
        OR: [
          { type: 'CUSTOMER' },
          { roles: { some: { role: 'CUSTOMER', active: true } } },
        ],
      },
      select: { id: true },
    });
    if (!party) throw new BadRequestException('El cliente no pertenece a esta empresa o está eliminado');
  }

  private async validateMember(userId?: string | null) {
    if (!userId) return;
    const context = this.context();
    const member = await this.db.getDefaultClient().company_users.findFirst({
      where: { company_id: context.companyId, user_id: userId, user: { active: true, deleted_at: null } },
      select: { user_id: true },
    });
    if (!member) throw new BadRequestException('La persona asignada debe ser usuaria activa de esta empresa');
  }

  private withoutResponsible(members: TaskMemberInputDto[], assignedTo?: string | null) {
    return members.filter(member => member.user_id !== assignedTo);
  }

  private async validateMembers(members: TaskMemberInputDto[]) {
    const userIds = [...new Set(members.map(member => member.user_id))];
    if (!userIds.length) return;
    const context = this.context();
    const activeMembers = await this.db.getDefaultClient().company_users.findMany({
      where: { company_id: context.companyId, user_id: { in: userIds }, user: { active: true, deleted_at: null } },
      select: { user_id: true },
      take: userIds.length,
    });
    if (activeMembers.length !== userIds.length) throw new BadRequestException('Todos los miembros deben ser usuarios activos de esta empresa');
  }

  private async validateLabels(labelIds?: string[]) {
    if (!labelIds?.length) return;
    const labels = await this.tenant.task_labels.findMany({
      where: { id: { in: [...new Set(labelIds)] }, active: true },
      select: { id: true },
    });
    if (labels.length !== new Set(labelIds).size) throw new BadRequestException('Una o más etiquetas no están disponibles en esta empresa');
  }

  private async attachAssignees<T extends { id: string; assigned_to: string | null; members?: Array<{ user_id: string; role: string }> }>(items: T[]) {
    const userIds = [...new Set(items.flatMap(item => [item.assigned_to, ...(item.members ?? []).map(member => member.user_id)]).filter((id): id is string => !!id))];
    if (!userIds.length) return items.map(item => ({ ...item, assignee: null, members: [] }));
    const users = await this.db.getDefaultClient().users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
      take: userIds.length,
    });
    const byId = new Map<string, { id: string; name: string }>(users.map(user => [user.id, user] as const));
    return items.map(item => ({
      ...item,
      assignee: item.assigned_to ? byId.get(item.assigned_to) ?? null : null,
      members: (item.members ?? []).map(member => ({ ...member, name: byId.get(member.user_id)?.name ?? 'Usuario' })),
    }));
  }
}
