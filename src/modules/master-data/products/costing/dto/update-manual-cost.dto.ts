import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

import { ProductCostSource } from '@/generated/prisma/enums';

export class UpdateManualCostDto {
  @IsNumber()
  @Min(0)
  current_cost!: number;

  @IsUUID()
  currency_id!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(ProductCostSource)
  cost_source?: ProductCostSource = 'MANUAL';
}
