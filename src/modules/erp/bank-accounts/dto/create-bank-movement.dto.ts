import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateBankMovementDto {
  @IsIn(['DEBIT', 'CREDIT'])
  nature!: 'DEBIT' | 'CREDIT';

  @IsUUID()
  bank_concept_id!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  base_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_amount?: number;

  @IsOptional()
  @IsString()
  currency_code?: string;

  @IsOptional()
  @IsNumber()
  exchange_rate?: number;

  @IsOptional()
  @IsString()
  rate_type?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  attachment_file_id?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  document_date?: string;

  @IsOptional()
  @IsString()
  effective_date?: string;

  @IsOptional()
  @IsBoolean()
  requires_receipt?: boolean;
}

export class CancelBankMovementDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
