import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsIn, IsUUID, Min, Max, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

class TaxContextItemDto {
  @IsOptional()
  @IsString()
  productId?: string

  @IsNumber()
  quantity: number

  @IsNumber()
  unitPrice: number
}

class CommercialAdjustmentDto {
  @IsString()
  @MinLength(1)
  concept: string

  @IsString()
  @IsIn(['PERCENTAGE', 'AMOUNT'])
  value_type: 'PERCENTAGE' | 'AMOUNT'

  @IsString()
  @IsIn(['NET', 'GROSS'])
  basis: 'NET' | 'GROSS'

  @IsNumber()
  @Min(0.01)
  @Max(1000000000000)
  value: number
}

export class TaxContextDto {
  @IsString()
  issuerCompanyId: string

  @IsOptional()
  @IsString()
  issuerVatCondition?: string

  @IsOptional()
  @IsString()
  partnerId?: string

  @IsOptional()
  @IsString()
  partnerVatCondition?: string

  @IsString()
  documentTypeId: string

  @IsOptional()
  @IsUUID('4')
  documentSequenceId?: string

  @IsOptional()
  @IsString()
  documentLetterType?: string

  @IsString()
  currency: string

  @IsString()
  date: string

  @IsOptional()
  @IsString()
  warehouseId?: string

  @IsOptional()
  @IsString()
  jurisdictionId?: string

  @IsString()
  @IsIn(['SALE', 'PURCHASE'])
  operationType: 'SALE' | 'PURCHASE'

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxContextItemDto)
  items: TaxContextItemDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommercialAdjustmentDto)
  commercial_adjustments?: CommercialAdjustmentDto[]
}
