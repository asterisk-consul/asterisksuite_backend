import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  NotEquals,
  ValidateNested,
} from 'class-validator';

export class ImportBankStatementRowDto {
  @IsInt()
  @Min(1)
  row_number!: number;

  @IsDateString()
  date!: string;

  @IsString()
  @MaxLength(255)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;

  // Un importe con signo desde la perspectiva de la cuenta bancaria.
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @NotEquals(0)
  amount!: number;

  @IsUUID()
  bank_concept_id!: string;
}

export class ImportBankStatementDto {
  @IsString()
  @Matches(/^[a-f0-9]{64}$/i)
  file_hash!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ImportBankStatementRowDto)
  rows!: ImportBankStatementRowDto[];
}
