import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentWithholdingDto } from './create-payment.dto';

export class UpdatePaymentFinancialDetailsDto {
  @IsOptional()
  @IsBoolean()
  rate_only?: boolean;

  @IsNumber()
  @Min(0.000001)
  @IsOptional()
  exchange_rate?: number | null;

  @IsString()
  @IsOptional()
  rate_type?: string | null;

  @IsUUID()
  @IsOptional()
  account_id?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentWithholdingDto)
  @IsOptional()
  withholdings?: PaymentWithholdingDto[];

  @IsUUID()
  @IsOptional()
  party_id?: string | null;
}
