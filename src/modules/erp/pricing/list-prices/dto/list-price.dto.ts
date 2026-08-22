import { IsUUID, IsDecimal, IsOptional, IsBoolean } from 'class-validator';

export class CreateListPriceDto {
  @IsUUID()
  price_list_id!: string;

  @IsUUID()
  product_id!: string;

  @IsDecimal()
  price!: string;

  @IsOptional()
  @IsDecimal()
  margin_percentage?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateListPriceDto {
  @IsOptional()
  @IsDecimal()
  price?: string;

  @IsOptional()
  @IsDecimal()
  margin_percentage?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
