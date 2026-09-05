import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartyType } from '@/generated/prisma/client';

class CreatePartyLocationDto {
  @IsString()
  location_id!: string;

  @IsOptional()
  @IsString()
  label?: string;
}

class CreatePartyContactDto {
  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;
}

class CreatePartyBankAccountDto {
  @IsString()
  cbu!: string;

  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  @IsString()
  bank_name?: string;

  @IsOptional()
  @IsString()
  account_type?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  holder_name?: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class CreateBusinessPartyDto {
  @IsBoolean()
  active: boolean;

  @IsEnum(PartyType)
  type!: PartyType;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  business_names?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  document_type?: string;

  @IsOptional()
  @IsString()
  tax_id?: string;

  @IsOptional()
  @IsString()
  vat_condition?: string;

  @IsOptional()
  @IsNumber()
  exemption_rate?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePartyLocationDto)
  locations?: CreatePartyLocationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePartyContactDto)
  contacts?: CreatePartyContactDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePartyBankAccountDto)
  bank_accounts?: CreatePartyBankAccountDto[];

  // ─── Datos laborales (solo se aplican al empleado vinculado si type = EMPLOYEE) ───
  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  hire_date?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  currency_code?: string;

  @IsOptional()
  @IsBoolean()
  is_salesperson?: boolean;

  @IsOptional()
  @IsNumber()
  default_commission_rate?: number;

  @IsOptional()
  @IsString()
  commission_base?: string;
}
