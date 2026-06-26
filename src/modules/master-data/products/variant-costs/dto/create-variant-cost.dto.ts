import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { VariantCostSource } from '@/generated/prisma/enums';

export class CreateVariantCostDto {
  @IsUUID()
  variant_id!: string;

  @IsUUID()
  currency_id!: string;

  @IsEnum(VariantCostSource)
  source!: VariantCostSource;

  @IsNumber()
  cost!: number;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
