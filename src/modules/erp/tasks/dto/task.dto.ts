import { Type } from 'class-transformer';
import { IsArray, ArrayMaxSize, ArrayMinSize, ArrayUnique, IsBoolean, IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';

export enum TaskPriorityDto {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskMemberRoleDto {
  COLLABORATOR = 'COLLABORATOR',
  REVIEWER = 'REVIEWER',
  OBSERVER = 'OBSERVER',
}

export class TaskMemberInputDto {
  @IsUUID()
  user_id!: string;

  @IsEnum(TaskMemberRoleDto)
  role!: TaskMemberRoleDto;
}

export class CreateTaskBoardDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsUUID()
  party_id?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(80, { each: true })
  columns?: string[];
}

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  description?: string;

  @IsUUID()
  column_id!: string;

  @IsOptional()
  @IsUUID()
  party_id?: string | null;

  @IsOptional()
  @IsUUID()
  assigned_to?: string | null;

  @IsOptional()
  @IsDateString()
  start_at?: string | null;

  @IsOptional()
  @IsDateString()
  due_at?: string | null;

  @IsOptional()
  @IsEnum(TaskPriorityDto)
  priority?: TaskPriorityDto;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsUUID(undefined, { each: true })
  label_ids?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ArrayUnique((member: TaskMemberInputDto) => member.user_id)
  @ValidateNested({ each: true })
  @Type(() => TaskMemberInputDto)
  members?: TaskMemberInputDto[];
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  description?: string | null;

  @IsOptional()
  @IsUUID()
  column_id?: string;

  @IsOptional()
  @IsUUID()
  party_id?: string | null;

  @IsOptional()
  @IsUUID()
  assigned_to?: string | null;

  @IsOptional()
  @IsDateString()
  start_at?: string | null;

  @IsOptional()
  @IsDateString()
  due_at?: string | null;

  @IsOptional()
  @IsEnum(TaskPriorityDto)
  priority?: TaskPriorityDto;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsUUID(undefined, { each: true })
  label_ids?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ArrayUnique((member: TaskMemberInputDto) => member.user_id)
  @ValidateNested({ each: true })
  @Type(() => TaskMemberInputDto)
  members?: TaskMemberInputDto[];
}

export class SetTaskCompletionDto {
  @IsBoolean()
  completed!: boolean;
}

export class CreateTaskLabelDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name!: string;

  @IsOptional()
  @IsString()
  @IsIn(['primary', 'success', 'info', 'warning', 'error', 'neutral'])
  color?: string;
}

export class CreateTaskCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content!: string;
}

export class CreateTaskChecklistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;
}

export class CreateTaskChecklistItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content!: string;
}

export class UpdateTaskChecklistItemDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsUUID()
  assigned_to?: string | null;

  @IsOptional()
  @IsDateString()
  due_at?: string | null;
}

export class CreateTaskColumnDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name!: string;
}

export class MoveTaskColumnDto {
  @IsInt()
  @Min(0)
  position!: number;
}

export class MoveAllTasksDto {
  @IsUUID()
  target_column_id!: string;
}

export class TaskColumnPreferencesDto {
  @IsOptional()
  @IsBoolean()
  is_pinned?: boolean;

  @IsOptional()
  @IsBoolean()
  is_watching?: boolean;
}

export class TaskNotificationSettingsDto {
  @IsBoolean()
  in_app_enabled!: boolean;
}

export class TaskBoardQueryDto {
  @IsOptional()
  @IsUUID()
  party_id?: string;
}

export class TaskPartyQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
