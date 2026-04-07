import { IsUUID } from 'class-validator';

export class TransferPalletDto {
  @IsUUID()
  pallet_id!: string;

  @IsUUID()
  from_warehouse_id!: string;

  @IsUUID()
  to_warehouse_id!: string;

  @IsUUID()
  user_id!: string;
}
