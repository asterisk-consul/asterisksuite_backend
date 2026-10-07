import { IsBoolean, IsInt, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class UpsertReplenishmentPolicyDto {
  @IsUUID()
  product_id!: string;

  @IsUUID()
  warehouse_id!: string;

  @IsOptional()
  @IsUUID()
  preferred_supplier_id?: string | null;

  @IsNumber()
  @Min(0)
  reorder_point!: number;

  @IsNumber()
  @Min(0)
  target_stock!: number;

  @IsInt()
  @Min(0)
  lead_time_days!: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
