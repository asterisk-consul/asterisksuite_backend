import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class SaveTablePreferenceDto {
  @IsString()
  tableKey!: string;

  @IsArray()
  @IsString({ each: true })
  visibleColumns!: string[];

  @IsArray()
  @IsString({ each: true })
  columnsOrder: string[];

  @IsOptional()
  @IsInt()
  pageSize?: number;

  @IsOptional()
  sort?: Record<string, 'asc' | 'desc'>;
}
