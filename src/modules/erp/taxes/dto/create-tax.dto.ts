// dto/create-tax.dto.ts
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTaxDto {
  @IsUUID()
  company_id: string;

  @IsString()
  @MaxLength(20)
  code: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(30)
  tax_type: string;

  @IsNumber()
  rate: number;

  @IsBoolean()
  is_percentage: boolean;

  @IsBoolean()
  active: boolean;

  @IsString()
  @MaxLength(20)
  calculation_level: string;
}
