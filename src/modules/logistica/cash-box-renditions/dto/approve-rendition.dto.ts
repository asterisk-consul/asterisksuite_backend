import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ApproveRenditionDto {
  @IsNumber()
  @IsOptional()
  actual_balance?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
