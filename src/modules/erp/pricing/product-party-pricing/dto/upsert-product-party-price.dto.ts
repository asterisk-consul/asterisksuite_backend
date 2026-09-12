import { IsIn, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class UpsertProductPartyPriceDto {
  @IsUUID()
  product_id!: string;

  @IsUUID()
  party_id!: string;

  @IsUUID()
  currency_id!: string;

  @IsIn(['SALE', 'PURCHASE'])
  operation_type!: 'SALE' | 'PURCHASE';

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  effective_from?: string;
}
