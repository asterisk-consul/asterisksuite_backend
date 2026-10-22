import { IsDateString, IsNumber, IsOptional, IsString, Matches, MaxLength, Min } from 'class-validator'

export class CreateWithholdingTaxApplicationDto {
  @IsString()
  @Matches(/^\d{4}(-(?:0[1-9]|1[0-2]))?$/)
  tax_period!: string

  @IsDateString()
  application_date!: string

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number

  @IsOptional()
  @IsString()
  @MaxLength(100)
  declaration_reference?: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string
}

export class ReverseWithholdingTaxApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string
}
