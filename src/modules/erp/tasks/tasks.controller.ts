import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { PermissionsGuard } from '@/access-control/guards/permissions.guard';
import { AllowCompanyAdmins } from '@/access-control/decorators/allow-company-admins.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskBoardDto, CreateTaskChecklistDto, CreateTaskChecklistItemDto, CreateTaskColumnDto, CreateTaskCommentDto, CreateTaskDto, CreateTaskLabelDto, MoveAllTasksDto, MoveTaskColumnDto, SetTaskCompletionDto, TaskBoardQueryDto, TaskColumnPreferencesDto, TaskNotificationSettingsDto, TaskPartyQueryDto, UpdateTaskChecklistItemDto, UpdateTaskDto } from './dto/task.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get('notification-settings')
  @RequirePermissions('tasks.read')
  getNotificationSettings() {
    return this.service.getNotificationSettings();
  }

  @Put('notification-settings')
  @UseGuards(PermissionsGuard)
  @AllowCompanyAdmins()
  @RequirePermissions('companies.update')
  updateNotificationSettings(@Body() dto: TaskNotificationSettingsDto, @CurrentUser() user: AuthUser) {
    return this.service.updateNotificationSettings(dto.in_app_enabled, user);
  }

  @Get(':taskId/checklists')
  @RequirePermissions('tasks.read')
  getChecklists(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.service.getChecklists(taskId);
  }

  @Post(':taskId/checklists')
  @RequirePermissions('tasks.update')
  createChecklist(@Param('taskId', ParseUUIDPipe) taskId: string, @Body() dto: CreateTaskChecklistDto, @CurrentUser() user: AuthUser) {
    return this.service.createChecklist(taskId, dto, user);
  }

  @Delete('checklists/:checklistId')
  @RequirePermissions('tasks.update')
  deleteChecklist(@Param('checklistId', ParseUUIDPipe) checklistId: string) {
    return this.service.deleteChecklist(checklistId);
  }

  @Post('checklists/:checklistId/items')
  @RequirePermissions('tasks.update')
  createChecklistItem(@Param('checklistId', ParseUUIDPipe) checklistId: string, @Body() dto: CreateTaskChecklistItemDto, @CurrentUser() user: AuthUser) {
    return this.service.createChecklistItem(checklistId, dto, user);
  }

  @Patch('checklist-items/:itemId')
  @RequirePermissions('tasks.update')
  updateChecklistItem(@Param('itemId', ParseUUIDPipe) itemId: string, @Body() dto: UpdateTaskChecklistItemDto, @CurrentUser() user: AuthUser) {
    return this.service.updateChecklistItem(itemId, dto, user);
  }

  @Delete('checklist-items/:itemId')
  @RequirePermissions('tasks.update')
  deleteChecklistItem(@Param('itemId', ParseUUIDPipe) itemId: string) {
    return this.service.deleteChecklistItem(itemId);
  }

  @Get('boards')
  @RequirePermissions('tasks.read')
  getBoards() {
    return this.service.getBoards();
  }

  @Post('boards')
  @RequirePermissions('tasks.create')
  createBoard(@Body() dto: CreateTaskBoardDto, @CurrentUser() user: AuthUser) {
    return this.service.createBoard(dto, user);
  }

  @Get('members')
  @RequirePermissions('tasks.read')
  getMembers() {
    return this.service.getMembers();
  }

  @Get('labels')
  @RequirePermissions('tasks.read')
  getLabels() {
    return this.service.getLabels();
  }

  @Post('labels')
  @RequirePermissions('tasks.update')
  createLabel(@Body() dto: CreateTaskLabelDto, @CurrentUser() user: AuthUser) {
    return this.service.createLabel(dto, user);
  }

  @Get('by-party/:partyId')
  @RequirePermissions('tasks.read')
  getTasksByParty(@Param('partyId', ParseUUIDPipe) partyId: string, @Query() query: TaskPartyQueryDto) {
    return this.service.getTasksByParty(partyId, query.limit);
  }

  @Get('boards/:boardId')
  @RequirePermissions('tasks.read')
  getBoard(@Param('boardId', ParseUUIDPipe) boardId: string, @Query() query: TaskBoardQueryDto, @CurrentUser() user: AuthUser) {
    return this.service.getBoard(boardId, query.party_id, user.id);
  }

  @Post('boards/:boardId/columns')
  @RequirePermissions('tasks.create')
  createColumn(@Param('boardId', ParseUUIDPipe) boardId: string, @Body() dto: CreateTaskColumnDto, @CurrentUser() user: AuthUser) {
    return this.service.createColumn(boardId, dto, user);
  }

  @Patch('columns/:columnId/position')
  @RequirePermissions('tasks.update')
  moveColumn(@Param('columnId', ParseUUIDPipe) columnId: string, @Body() dto: MoveTaskColumnDto, @CurrentUser() user: AuthUser) {
    return this.service.moveColumn(columnId, dto, user);
  }

  @Post('columns/:columnId/copy')
  @RequirePermissions('tasks.create')
  copyColumn(@Param('columnId', ParseUUIDPipe) columnId: string, @CurrentUser() user: AuthUser) {
    return this.service.copyColumn(columnId, user);
  }

  @Post('columns/:columnId/move-tasks')
  @RequirePermissions('tasks.update')
  moveAllTasks(@Param('columnId', ParseUUIDPipe) columnId: string, @Body() dto: MoveAllTasksDto, @CurrentUser() user: AuthUser) {
    return this.service.moveAllTasks(columnId, dto, user);
  }

  @Patch('columns/:columnId/preferences')
  @RequirePermissions('tasks.update')
  updateColumnPreferences(@Param('columnId', ParseUUIDPipe) columnId: string, @Body() dto: TaskColumnPreferencesDto, @CurrentUser() user: AuthUser) {
    return this.service.updateColumnPreferences(columnId, user.id, dto);
  }

  @Get(':taskId/comments')
  @RequirePermissions('tasks.read')
  getComments(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.service.getComments(taskId);
  }

  @Post(':taskId/comments')
  @RequirePermissions('tasks.comment')
  createComment(@Param('taskId', ParseUUIDPipe) taskId: string, @Body() dto: CreateTaskCommentDto, @CurrentUser() user: AuthUser) {
    return this.service.createComment(taskId, dto, user);
  }

  @Get(':taskId')
  @RequirePermissions('tasks.read')
  getTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.service.getTask(taskId);
  }

  @Post('boards/:boardId/tasks')
  @RequirePermissions('tasks.create')
  createTask(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.createTask(boardId, dto, user);
  }

  @Patch(':taskId/completion')
  @RequirePermissions('tasks.update')
  setTaskCompletion(@Param('taskId', ParseUUIDPipe) taskId: string, @Body() dto: SetTaskCompletionDto, @CurrentUser() user: AuthUser) {
    return this.service.setTaskCompletion(taskId, dto, user);
  }

  @Patch(':taskId')
  @RequirePermissions('tasks.update')
  updateTask(@Param('taskId', ParseUUIDPipe) taskId: string, @Body() dto: UpdateTaskDto, @CurrentUser() user: AuthUser) {
    return this.service.updateTask(taskId, dto, user);
  }

  @Delete(':taskId')
  @RequirePermissions('tasks.delete')
  deleteTask(@Param('taskId', ParseUUIDPipe) taskId: string, @CurrentUser() user: AuthUser) {
    return this.service.deleteTask(taskId, user);
  }
}
