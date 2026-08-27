import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateDocumentsTypeDto {
  @IsOptional()
  @IsUUID()
  document_sequence_id?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  document_sequence_ids?: string[];

  @IsString()
  @MaxLength(20)
  code!: string;

  @IsString()
  @MaxLength(150)
  description!: string;

  @IsInt()
  direction!: number;

  @IsBoolean()
  affects_stock!: boolean;

  @IsBoolean()
  affects_accounting!: boolean;

  @IsBoolean()
  affects_tax_book!: boolean;

  @IsBoolean()
  affects_payment!: boolean;

  @IsBoolean()
  active!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  letter_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  afip_code?: string;

  @IsOptional()
  @IsBoolean()
  requires_cae?: boolean;

  @IsOptional()
  @IsBoolean()
  is_electronic?: boolean;

  @IsOptional()
  custom_fields_config?: any;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tax_ids?: string[];
}
