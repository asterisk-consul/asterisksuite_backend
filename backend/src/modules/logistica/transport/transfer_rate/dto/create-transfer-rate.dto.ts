import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTransferRateDto {
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
