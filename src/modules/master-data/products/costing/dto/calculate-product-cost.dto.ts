import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CalculateProductCostDto {
  @IsUUID()
  product_id!: string;

  @IsUUID()
  currency_id!: string;

  @IsOptional()
  @IsBoolean()
  save_snapshot?: boolean = true;
}
