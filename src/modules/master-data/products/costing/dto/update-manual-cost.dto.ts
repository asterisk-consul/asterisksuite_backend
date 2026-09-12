import { IsEnum, IsNumber, IsOptional } from 'class-validator';

import { ProductCostSource } from '@/generated/prisma/enums';

export class UpdateManualCostDto {
  @IsNumber()
  current_cost!: number;

  @IsOptional()
  @IsEnum(ProductCostSource)
  cost_source?: ProductCostSource = 'MANUAL';
}
