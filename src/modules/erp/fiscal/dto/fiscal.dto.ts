import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

// ─── Perfil de sujeto pasible ──────────────────────────────

export class WithholdingProfileDto {
  @IsString()
  tax_type: string

  @IsBoolean()
  is_subject: boolean

  @IsOptional()
  @IsString()
  status?: string

  @IsOptional()
  @IsBoolean()
  is_pyme?: boolean

  @IsOptional()
  @IsString()
  observations?: string
}

export class PutWithholdingProfilesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WithholdingProfileDto)
  profiles: WithholdingProfileDto[]
}

// ─── Inscripciones IIBB ────────────────────────────────────

export class IibbRegistrationDto {
  @IsString()
  registration_type: string

  @IsOptional()
  @IsUUID()
  jurisdiction_id?: string | null

  @IsOptional()
  @IsString()
  registration_number?: string | null

  @IsOptional()
  @IsNumber()
  @Max(100)
  prorrate_percentage?: number | null

  @IsOptional()
  @IsBoolean()
  is_active?: boolean
}

export class PutIibbRegistrationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IibbRegistrationDto)
  registrations: IibbRegistrationDto[]
}

// ─── Empresa como agente ───────────────────────────────────

export class CompanyTaxJurisdictionDto {
  @IsUUID()
  jurisdiction_id: string

  @IsString()
  tax_type: string

  @IsBoolean()
  is_withholding_agent: boolean

  @IsBoolean()
  is_perception_agent: boolean

  @IsOptional()
  @IsString()
  registration_number?: string | null
}

export class PutCompanyTaxJurisdictionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompanyTaxJurisdictionDto)
  jurisdictions: CompanyTaxJurisdictionDto[]
}

// ─── Reglas fiscales ───────────────────────────────────────

export class TaxRuleBracketDto {
  @IsNumber()
  accumulated_from: number

  @IsOptional()
  @IsNumber()
  accumulated_to?: number | null

  @IsNumber()
  rate: number
}

export class CreateTaxRuleDto {
  @IsString()
  name: string

  @IsString()
  tax_type: string

  @IsOptional()
  @IsString()
  application_type?: string

  @IsOptional()
  @IsUUID()
  jurisdiction_id?: string | null

  @IsOptional()
  @IsUUID()
  withholding_concept_id?: string | null

  @IsOptional()
  @IsString()
  operation_type?: string | null

  @IsOptional()
  @IsString()
  cuit_suffix_group?: string | null

  @IsOptional()
  @IsString()
  base_type?: string

  @IsOptional()
  @IsString()
  calculation_method?: string

  @IsOptional()
  @IsNumber()
  rate?: number | null

  @IsOptional()
  @IsNumber()
  minimum_amount?: number | null

  @IsOptional()
  @IsDateString()
  valid_from?: string

  @IsOptional()
  @IsDateString()
  valid_to?: string | null

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxRuleBracketDto)
  brackets?: TaxRuleBracketDto[]
}

export class UpdateTaxRuleDto extends CreateTaxRuleDto {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean
}

