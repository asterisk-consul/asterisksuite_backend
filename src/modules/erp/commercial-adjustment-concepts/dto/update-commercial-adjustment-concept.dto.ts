import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import {
  COMMERCIAL_ADJUSTMENT_BASES,
  COMMERCIAL_ADJUSTMENT_SCOPES,
  COMMERCIAL_ADJUSTMENT_VALUE_TYPES,
} from './create-commercial-adjustment-concept.dto';

export class UpdateCommercialAdjustmentConceptDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @IsOptional()
  @IsIn(COMMERCIAL_ADJUSTMENT_SCOPES)
  applies_to?: (typeof COMMERCIAL_ADJUSTMENT_SCOPES)[number];

  @IsOptional()
  @IsIn(COMMERCIAL_ADJUSTMENT_VALUE_TYPES)
  value_type?: (typeof COMMERCIAL_ADJUSTMENT_VALUE_TYPES)[number];

  @IsOptional()
  @IsIn(COMMERCIAL_ADJUSTMENT_BASES)
  basis?: (typeof COMMERCIAL_ADJUSTMENT_BASES)[number];

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0.01)
  @Max(1000000000000)
  default_value?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
