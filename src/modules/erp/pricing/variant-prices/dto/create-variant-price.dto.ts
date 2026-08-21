import { IsUUID, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateVariantPriceDto {
  @IsUUID()
  variant_id!: string;

  @IsUUID()
  currency_id!: string;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsString()
  price_list?: string;

  @IsOptional()
  @IsNumber()
  margin?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
