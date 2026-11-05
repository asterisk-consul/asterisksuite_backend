import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, ValidateNested } from 'class-validator';

export class PartnerInvestmentInstallmentDto {
  @IsDateString()
  due_date!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;
}

export class CreatePartnerInvestmentPlanDto {
  @IsUUID()
  idempotency_key!: string;

  @IsString()
  @MaxLength(10)
  currency_code!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(120)
  @ValidateNested({ each: true })
  @Type(() => PartnerInvestmentInstallmentDto)
  installments!: PartnerInvestmentInstallmentDto[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}
