import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min, MinLength } from 'class-validator';

export enum BankChargeRuleTriggerDto {
  BANK_PAYMENT = 'BANK_PAYMENT',
  BANK_COLLECTION = 'BANK_COLLECTION',
  CARD_SETTLEMENT = 'CARD_SETTLEMENT',
  CHECK_DEPOSIT = 'CHECK_DEPOSIT',
  CHECK_REJECTION = 'CHECK_REJECTION',
  INVESTMENT_REDEMPTION = 'INVESTMENT_REDEMPTION',
  FIXED_TERM_EARLY_CANCEL = 'FIXED_TERM_EARLY_CANCEL',
}

export enum BankChargeCalculationTypeDto {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
  FIXED_PLUS_PERCENTAGE = 'FIXED_PLUS_PERCENTAGE',
}

export class CreateBankChargeRuleDto {
  @IsUUID() bank_concept_id!: string;
  @IsString() @MinLength(2) name!: string;
  @IsEnum(BankChargeRuleTriggerDto) trigger!: BankChargeRuleTriggerDto;
  @IsEnum(BankChargeCalculationTypeDto) calculation_type!: BankChargeCalculationTypeDto;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) fixed_amount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(100) percentage?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) minimum_amount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) maximum_amount?: number;
  @IsOptional() @IsString() currency_code?: string;
  @IsOptional() @IsDateString() valid_from?: string;
  @IsOptional() @IsDateString() valid_until?: string;
  @IsOptional() @Type(() => Number) @IsInt() priority?: number;
  @IsOptional() @IsBoolean() editable?: boolean;
  @IsOptional() @IsBoolean() active?: boolean;
}

export class UpdateBankChargeRuleDto extends CreateBankChargeRuleDto {}

export class SuggestedBankChargesQueryDto {
  @IsEnum(BankChargeRuleTriggerDto) trigger!: BankChargeRuleTriggerDto;
  @Transform(({ value }) => Number(value)) @IsNumber() @Min(0) amount!: number;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() currency_code?: string;
}
