import { IsArray, IsDecimal, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
class PickingSourceDto {
  @IsUUID()
  picking_item_id!: string;

  @IsUUID()
  pallet_id!: string;

  @IsDecimal()
  quantity!: string;
}

export class ExecutePickingDto {
  @IsUUID()
  picking_order_id!: string;

  @IsUUID()
  result_pallet_id!: string;

  @IsUUID()
  user_id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PickingSourceDto)
  sources!: PickingSourceDto[];
}
