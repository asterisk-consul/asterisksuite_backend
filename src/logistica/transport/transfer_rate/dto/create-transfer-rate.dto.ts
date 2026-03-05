import { IsUUID, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTransferRateDto {
  @IsUUID()
  company_id!: string;

  @IsString()
  name!: string;

  @IsString()
  rate_type!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
