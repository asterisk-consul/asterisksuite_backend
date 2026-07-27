import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsIn } from 'class-validator'
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
  @IsString()
  documentLetterType?: string

  @IsString()
  currency: string

  @IsString()
  date: string

  @IsOptional()
  @IsString()
  warehouseId?: string

  @IsString()
  @IsIn(['SALE', 'PURCHASE'])
  operationType: 'SALE' | 'PURCHASE'

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxContextItemDto)
  items: TaxContextItemDto[]
}
