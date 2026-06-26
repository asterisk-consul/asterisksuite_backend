import { IsUUID } from 'class-validator';

export class AssignProductTagDto {
  @IsUUID()
  product_id!: string;

  @IsUUID()
  tag_id!: string;
}
