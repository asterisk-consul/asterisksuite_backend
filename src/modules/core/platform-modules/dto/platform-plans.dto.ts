import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreatePlatformPlanDto {
  @IsString() @MaxLength(50) code!: string;
  @IsString() @MaxLength(120) name!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class UpdatePlatformPlanDto {
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class PlatformPlanModuleDto {
  @IsString() moduleCode!: string;
  @IsBoolean() enabled!: boolean;
  @IsOptional() @IsObject() limits?: Record<string, unknown>;
}

export class SetPlatformPlanModulesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlatformPlanModuleDto)
  modules!: PlatformPlanModuleDto[];
}

export class SetCompanySubscriptionDto {
  @IsUUID() planId!: string;
  @IsOptional()
  @IsIn(['TRIAL', 'ACTIVE', 'PAST_DUE', 'SUSPENDED', 'CANCELLED'])
  status?: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'SUSPENDED' | 'CANCELLED';
  @IsOptional() @IsDateString() trialEndsAt?: string | null;
  @IsOptional() @IsDateString() renewsAt?: string | null;
}

export class CreatePlatformCompanyDto {
  @IsString() @MaxLength(150)
  name!: string;

  @IsOptional() @IsString() @MaxLength(20)
  taxId?: string;

  @IsOptional() @IsIn(['RESPONSABLE_INSCRIPTO', 'MONOTRIBUTO', 'EXENTO'])
  vat_condition?: string;

  @IsOptional() @IsString() @MaxLength(250)
  address?: string;

  @IsOptional() @IsString() @MaxLength(20)
  phone?: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsString()
  @Matches(/^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])$/, {
    message: 'El subdominio debe tener entre 3 y 50 caracteres, en minúsculas, números o guiones.',
  })
  subdomain!: string;

  @IsEmail()
  ownerEmail!: string;

  @IsUUID()
  planId!: string;

  @IsOptional()
  @IsIn(['TRIAL', 'ACTIVE', 'PAST_DUE', 'SUSPENDED', 'CANCELLED'])
  status?: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'SUSPENDED' | 'CANCELLED';

  @IsOptional()
  @IsDateString()
  trialEndsAt?: string | null;
}

export class SetCompanyModuleOverrideDto {
  @IsIn(['ENABLED', 'READ_ONLY', 'DISABLED']) state!: 'ENABLED' | 'READ_ONLY' | 'DISABLED';
  @IsOptional() @IsString() @MaxLength(500) reason?: string;
  @IsOptional() @IsDateString() expiresAt?: string | null;
}

export class SetPlatformAdminScopesDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Asigná al menos una empresa al administrador.' })
  @ArrayUnique({ message: 'No repitas empresas en el alcance del administrador.' })
  @IsUUID('4', { each: true })
  companyIds!: string[];
}
