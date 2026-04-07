import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsDecimal,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
class CreatePickingItemDto {
  @IsUUID()
  product_id!: string;

  @IsDecimal()
  quantity!: string;
}

export class CreatePickingOrderDto {
  @IsUUID()
  warehouse_id!: string;

  @IsUUID()
  created_by!: string;

  @IsOptional()
  @IsUUID()
  dispatch_order_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePickingItemDto)
  items!: CreatePickingItemDto[];
}
