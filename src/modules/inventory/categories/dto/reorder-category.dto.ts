import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class ReorderCategoryDto {
  @IsOptional()
  @IsUUID()
  parent_id?: string | null;

  @IsInt()
  @Min(0)
  sort_order!: number;
}
