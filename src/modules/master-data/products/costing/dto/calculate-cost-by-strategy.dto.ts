import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { ProductCostSource } from '@/generated/prisma/enums';

export class CalculateCostByStrategyDto {
  @IsUUID()
  product_id!: string;

  @IsUUID()
  currency_id!: string;

  @IsOptional()
  @IsEnum(ProductCostSource)
  force_strategy?: ProductCostSource;

  @IsOptional()
  @IsBoolean()
  save_snapshot?: boolean = true;
}
