import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
export class UpdateDocumentSequenceDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  point_of_sale?: string;

  @IsOptional()
  @IsBoolean()
  automatic?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  range_start?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  range_end?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  prefix?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
