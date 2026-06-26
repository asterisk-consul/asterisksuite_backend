import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class BulkAssignProductCategoriesDto {
  @IsUUID()
  product_id!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  category_ids!: string[];
}
