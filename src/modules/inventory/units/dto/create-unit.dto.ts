import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { UnitType } from '@/generated/prisma/enums';

export class CreateUnitDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsString()
  @MaxLength(20)
  symbol!: string;

  @IsEnum(UnitType)
  unit_type!: UnitType;

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}
