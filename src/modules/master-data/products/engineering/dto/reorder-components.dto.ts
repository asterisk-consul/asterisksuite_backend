// reorder-components.dto.ts
import { IsArray, IsNumber, IsUUID } from 'class-validator';

export class ReorderComponentsDto {
  @IsArray()
  items!: { id: string; order: number }[];
}
