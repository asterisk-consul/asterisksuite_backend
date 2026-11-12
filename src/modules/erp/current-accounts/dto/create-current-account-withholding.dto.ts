import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateCurrentAccountWithholdingItemDto {
  @IsEnum(['GANANCIAS', 'IIBB', 'SUSS', 'IVA'] as const)
  tax_type!: string;

  @IsUUID()
  @IsOptional()
  jurisdiction_id?: string;

  @IsUUID()
  @IsOptional()
  withholding_concept_id?: string;

  @IsUUID()
  @IsOptional()
  tax_rule_id?: string;

  @IsNumber()
  @Min(0.01)
  base_amount!: number;

  @IsNumber()
  @IsOptional()
  rate?: number;

  @IsNumber()
  @Min(0.01)
  withheld_amount!: number;

  @IsNumber()
  @IsOptional()
  automatic_amount?: number;

  @IsNumber()
  @IsOptional()
  manual_amount?: number;

  @IsString()
  @IsOptional()
  certificate_number?: string;

  @IsDateString()
  @IsOptional()
  certificate_date?: string;

  @IsString()
  @IsOptional()
  observations?: string;
}

export class CreateCurrentAccountWithholdingDto {
  @IsUUID()
  party_id!: string;

  @IsEnum(['CUSTOMER', 'SUPPLIER', 'SERVICE_PROVIDER', 'UTILITY', 'FINANCIAL', 'TAX_AUTHORITY'] as const)
  party_type!: string;

  @IsString()
  currency_code!: string;

  @IsNumber()
  @Min(0.000001)
  @IsOptional()
  exchange_rate?: number;

  @IsString()
  @IsOptional()
  rate_type?: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  opening_balance_document_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCurrentAccountWithholdingItemDto)
  withholdings!: CreateCurrentAccountWithholdingItemDto[];
}
