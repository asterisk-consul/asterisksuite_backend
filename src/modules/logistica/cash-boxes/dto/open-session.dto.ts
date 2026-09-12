import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class OpenSessionDto {
  @IsNumber()
  @Min(0)
  opening_balance!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
