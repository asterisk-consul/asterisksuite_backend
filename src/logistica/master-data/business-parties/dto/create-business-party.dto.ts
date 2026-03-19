import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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

export class CreateBusinessPartyDto {
  @IsString()
  company_id!: string;

  @IsString()
  type!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  tax_id?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

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
}
