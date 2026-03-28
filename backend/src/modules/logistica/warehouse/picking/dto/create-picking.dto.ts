import { IsUUID, IsArray, ValidateNested, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

class PickingItemDto {
  @IsUUID()
  product_id!: string;

  @IsDecimal()
  quantity!: string;
}

export class CreatePickingDto {
  @IsUUID()
  warehouse_id!: string;

  @IsUUID()
  created_by!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PickingItemDto)
  items!: PickingItemDto[];
}
