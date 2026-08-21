import { IsUUID, IsDecimal } from 'class-validator';

export class TransferStockDto {
  @IsUUID()
  product_id!: string;

  @IsUUID()
  from_warehouse_id!: string;

  @IsUUID()
  to_warehouse_id!: string;

  @IsDecimal()
  quantity!: string;
}
