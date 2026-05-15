import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateProductPriceDto {
  @IsUUID()
  product_id!: string;

  @IsUUID()
  currency_id!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  exemption_rate?: number;
}
