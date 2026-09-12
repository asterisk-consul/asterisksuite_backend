import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CurrencyRateType } from '@/generated/prisma/enums';
export class CreateCurrencyRateDto {
  @IsUUID()
  from_currency_id!: string;

  @IsUUID()
  to_currency_id!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.000001)
  rate!: number;

  @IsOptional()
  @IsString()
  source?: string;

  @IsDateString()
  effective_date!: string;

  @IsOptional()
  @IsEnum(CurrencyRateType)
  rate_type?: CurrencyRateType;
}
