import { IsString, IsUUID, IsOptional, IsEnum, MaxLength, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { InternationalExpenseType } from '@/generated/prisma/enums';

export class AssociateDocumentDto {
  @IsUUID()
  document_id: string;

  @IsOptional()
  @IsEnum(InternationalExpenseType)
  expense_type?: InternationalExpenseType;

  @IsOptional()
  @IsUUID()
  container_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  custom_expense_description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  exchange_rate?: number;
}
