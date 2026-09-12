import { IsArray, IsDateString, IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

export class CalculateWithholdingsDto {
  @IsUUID()
  party_id: string

  @IsOptional()
  @IsString()
  party_tax_id?: string

  @IsNumber()
  base_amount: number

  @IsOptional()
  @IsDateString()
  date?: string

  @IsOptional()
  @IsIn(['SALE', 'PURCHASE'])
  operation_type?: 'SALE' | 'PURCHASE'

  @IsOptional()
  @IsArray()
  @IsIn(['GANANCIAS', 'IIBB', 'SUSS'], { each: true })
  tax_types?: string[]

  @IsOptional()
  @IsUUID()
  withholding_concept_id?: string
}
