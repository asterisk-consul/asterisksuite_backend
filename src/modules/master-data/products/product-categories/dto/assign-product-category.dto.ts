import { IsUUID } from 'class-validator';

export class AssignProductCategoryDto {
  @IsUUID()
  product_id!: string;

  @IsUUID()
  category_id!: string;
}
