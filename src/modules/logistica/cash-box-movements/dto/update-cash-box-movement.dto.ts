import { IsString, IsOptional } from 'class-validator';

export class UpdateCashBoxMovementDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  reference_type?: string;

  @IsString()
  @IsOptional()
  reference_id?: string;

  @IsString()
  @IsOptional()
  payment_id?: string;
}
