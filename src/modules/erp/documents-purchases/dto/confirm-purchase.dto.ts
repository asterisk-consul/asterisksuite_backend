import { IsOptional, IsString } from 'class-validator';

export class ConfirmPurchaseDto {
  @IsOptional()
  @IsString()
  updateProductPrices?: string;
}
