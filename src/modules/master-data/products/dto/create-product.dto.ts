import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsUUID,
} from 'class-validator';

import {
  CalculationType,
  ProductCostSource,
  ProductType,
  UsageType,
} from '@/generated/prisma/enums';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsBoolean()
  requires_refrigeration?: boolean;

  @IsOptional()
  @IsBoolean()
  price_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  is_rate_type?: boolean;

  @IsOptional()
  @IsUUID()
  rate_id?: string;

  @IsOptional()
  @IsUUID()
  taxId?: string;

  @IsOptional()
  @IsUUID()
  tax_category_id?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsEnum(ProductType)
  product_type?: ProductType;

  @IsOptional()
  @IsEnum(UsageType)
  usage_type?: UsageType;

  @IsOptional()
  @IsBoolean()
  is_composed?: boolean;

  @IsOptional()
  @IsBoolean()
  auto_calculate_cost?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sale_margin_percentage?: number;

  @IsOptional()
  @IsBoolean()
  has_engineering?: boolean;

  @IsOptional()
  @IsBoolean()
  manages_stock?: boolean;

  @IsOptional()
  @IsUUID()
  income_account_id?: string;

  @IsOptional()
  @IsUUID()
  expense_account_id?: string;

  @IsOptional()
  @IsUUID()
  inventory_account_id?: string;

  @IsOptional()
  @IsEnum(CalculationType)
  calculation_type?: CalculationType;

  @IsOptional()
  @IsEnum(ProductCostSource)
  cost_source?: ProductCostSource;

  @IsOptional()
  @IsUUID()
  unit_id?: string;

  @IsOptional()
  @IsUUID()
  purchase_unit_id?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.000001)
  purchase_to_stock_factor?: number;
}
