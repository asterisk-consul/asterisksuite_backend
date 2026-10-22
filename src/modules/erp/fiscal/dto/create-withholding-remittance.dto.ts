import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNumber, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator'

export class CreateWithholdingRemittanceDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @IsUUID('4', { each: true })
  withholding_ids!: string[]

  @IsString()
  @Length(1, 100)
  vep_number!: string

  @IsNumber()
  @Min(0.01)
  vep_amount!: number

  @IsString()
  @Length(3, 10)
  currency_code!: string

  @IsOptional()
  @IsString()
  @Length(1, 30)
  tax_regime_code?: string

  @IsOptional()
  @IsDateString()
  due_date?: string

  @IsOptional()
  @IsString()
  notes?: string
}
