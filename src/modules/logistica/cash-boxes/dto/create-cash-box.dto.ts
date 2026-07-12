import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateCashBoxDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsEnum(['MAIN', 'FIXED', 'REGISTER'] as const)
  type?: string;

  @IsOptional()
  @IsUUID()
  responsible_id?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  opening_balance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  max_limit?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  is_main?: boolean;
}
