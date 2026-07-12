import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
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

export class CreateBusinessPartyDto {
  @IsBoolean()
  active: boolean;

  @IsEnum(PartyType)
  type!: PartyType;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  tax_id?: string;

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
  exemption_rate?: number;
}
