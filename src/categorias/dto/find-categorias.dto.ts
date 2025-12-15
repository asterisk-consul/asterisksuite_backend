import { IsOptional, IsString, IsArray, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindCategoriasDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (Array.isArray(value)) {
      return value.map(String);
    }

    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }

    return undefined;
  })
  @IsArray()
  @IsString({ each: true })
  grupo?: string[];

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string' || typeof value === 'number') {
      return Number(value);
    }
    return undefined;
  })
  @IsInt()
  parentid?: number;
}
