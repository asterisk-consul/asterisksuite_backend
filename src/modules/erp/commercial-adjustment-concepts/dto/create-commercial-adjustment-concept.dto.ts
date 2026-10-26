import { IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export const COMMERCIAL_ADJUSTMENT_SCOPES = ['SALES', 'PURCHASES', 'BOTH'] as const;
export const COMMERCIAL_ADJUSTMENT_VALUE_TYPES = ['PERCENTAGE', 'AMOUNT'] as const;
export const COMMERCIAL_ADJUSTMENT_BASES = ['NET', 'GROSS'] as const;

export class CreateCommercialAdjustmentConceptDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @IsIn(COMMERCIAL_ADJUSTMENT_SCOPES)
  applies_to!: (typeof COMMERCIAL_ADJUSTMENT_SCOPES)[number];

  @IsIn(COMMERCIAL_ADJUSTMENT_VALUE_TYPES)
  value_type!: (typeof COMMERCIAL_ADJUSTMENT_VALUE_TYPES)[number];

  @IsIn(COMMERCIAL_ADJUSTMENT_BASES)
  basis!: (typeof COMMERCIAL_ADJUSTMENT_BASES)[number];

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.01)
  @Max(1000000000000)
  default_value?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;
}
