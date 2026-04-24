import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateDocumentItemTaxDto {
  @IsUUID()
  tax_id!: string;

  @IsNumber()
  tax_rate!: number;

  @IsNumber()
  tax_amount!: number;
}

export class CreateDocumentItemDto {
  @IsUUID()
  @IsOptional()
  product_id?: string;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unit_price!: number;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentItemTaxDto)
  @IsOptional()
  taxes?: CreateDocumentItemTaxDto[];
}

export class CreateDocumentTaxDto {
  @IsUUID()
  tax_id!: string;

  @IsNumber()
  tax_rate!: number;

  @IsNumber()
  taxable_base!: number;

  @IsNumber()
  tax_amount!: number;
}

export class CreateSaleDocumentDto {
  @IsUUID()
  document_type_id!: string;

  @IsUUID()
  @IsOptional()
  party_id?: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  descrip?: string;

  @IsString()
  @IsOptional()
  ref?: string;

  @IsNumber()
  @Min(0)
  subtotal!: number;

  @IsNumber()
  @Min(0)
  exempt_amount!: number;

  @IsNumber()
  @Min(0)
  total_taxes!: number;

  @IsNumber()
  @Min(0)
  total!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentItemDto)
  items!: CreateDocumentItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentTaxDto)
  @IsOptional()
  taxes?: CreateDocumentTaxDto[];
}
