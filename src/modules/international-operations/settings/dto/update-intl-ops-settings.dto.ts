import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateIntlOpsSettingsDto {
  @IsOptional()
  @IsObject()
  container_fields?: Record<string, boolean>;

  @IsOptional()
  @IsObject()
  operation_fields?: Record<string, boolean>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  operation_statuses?: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  container_statuses?: string[] | null;
}
