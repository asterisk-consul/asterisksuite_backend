import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { InternationalExpenseType } from '@/generated/prisma/enums';

export class ConvertQuoteDto {
  @IsUUID()
  document_type_id: string;

  @IsUUID()
  container_id: string;

  @IsEnum(InternationalExpenseType)
  expense_type: InternationalExpenseType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  custom_expense_description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.000001)
  exchange_rate?: number;

  @IsOptional()
  @IsBoolean()
  confirm?: boolean;
}
