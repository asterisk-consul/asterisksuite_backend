import { IsEnum, IsDateString, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ContainerEventType } from '@/generated/prisma/enums';

export class CreateEventDto {
  @IsEnum(ContainerEventType)
  event_type!: ContainerEventType;

  @IsDateString()
  event_date!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location_text?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  created_by?: string;
}
