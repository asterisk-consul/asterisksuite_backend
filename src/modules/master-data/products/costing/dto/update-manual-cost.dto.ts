// src/modules/master-data/products/costing/dto/update-manual-cost.dto.ts

import { IsNumber, IsUUID } from 'class-validator';

export class UpdateManualCostDto {
  @IsUUID()
  currency_id!: string;

  @IsNumber()
  material_cost!: number;

  @IsNumber()
  labor_cost!: number;

  @IsNumber()
  overhead_cost!: number;
}
