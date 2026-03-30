import {
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

  @IsString()
  @MaxLength(20)
  code: string;

  @IsString()
  @MaxLength(150)
  description: string;

  @IsInt()
  direction: number;

  @IsBoolean()
  affects_stock: boolean;

  @IsBoolean()
  affects_accounting: boolean;

  @IsBoolean()
  affects_tax_book: boolean;

  @IsBoolean()
  active: boolean;
}
