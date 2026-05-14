import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductAttributeValueDto {
  @IsOptional()
  @IsUUID()
  product_id?: string;

  @IsOptional()
  @IsUUID()
  variant_id?: string;

  @IsUUID()
  attribute_id!: string;

  @IsOptional()
  @IsString()
  text_value?: string;

  @IsOptional()
  @IsNumber()
  number_value?: number;

  @IsOptional()
  @IsBoolean()
  boolean_value?: boolean;
}
