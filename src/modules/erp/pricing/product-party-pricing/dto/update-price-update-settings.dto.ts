import { IsBoolean } from 'class-validator';

export class UpdatePriceUpdateSettingsDto {
  @IsBoolean()
  update_sales_party_prices!: boolean;

  @IsBoolean()
  update_sales_global_prices!: boolean;

  @IsBoolean()
  update_purchases_party_prices!: boolean;

  @IsBoolean()
  update_purchases_global_costs!: boolean;
}
