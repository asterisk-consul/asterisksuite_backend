import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID, MaxLength, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

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

export class CreateEmployeeDto {
  @IsOptional()
  @IsUUID()
  party_id?: string;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserDto)
  create_user?: CreateUserDto;

  // ─── Employee fields ───────────────────────────
  @IsString()
  @MaxLength(100)
  first_name!: string;

  @IsString()
  @MaxLength(100)
  last_name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  document_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  document_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @IsOptional()
  @IsDateString()
  hire_date?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency_code?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // ─── Business party fields (for auto-creation) ─
  @IsOptional()
  @IsString()
  @MaxLength(200)
  business_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  tax_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
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
}
