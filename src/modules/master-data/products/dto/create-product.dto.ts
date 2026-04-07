import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @IsOptional()
  @IsBoolean()
  requires_refrigeration?: boolean;
}
