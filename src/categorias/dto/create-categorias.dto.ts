import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoriaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  parentid?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  grupo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  procparentid?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orden?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  notas?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  valor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  macroparentid?: number;
}
