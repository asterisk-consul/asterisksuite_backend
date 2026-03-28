import {
  IsUUID,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  ValidateNested,
  IsArray,
  IsBoolean,
  isNumber,
  isString,
} from 'class-validator';

export class CreateDocumentsTypesDto {
  @IsString()
  document_sequence_id!: string;
  @IsUUID()
  document_id!: string;
  @IsString()
  code!: string;
  @IsString()
  description!: string;
  @IsNumber()
  direction!: number;
  @IsBoolean()
  affects_stock!: boolean;
  @IsBoolean()
  affects_accounting!: boolean;
  @IsBoolean()
  active!: boolean;
}
