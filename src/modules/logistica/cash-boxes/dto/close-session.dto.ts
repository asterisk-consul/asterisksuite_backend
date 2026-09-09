import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CloseSessionDto {
  @IsNumber()
  @Min(0)
  actual_balance!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
