import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentWithholdingDto } from './create-payment.dto';

export class UpdatePaymentFinancialDetailsDto {
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
