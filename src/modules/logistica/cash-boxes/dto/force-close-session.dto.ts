import { IsNumber, IsString, Min } from 'class-validator';

export class ForceCloseSessionDto {
  @IsNumber()
  @Min(0)
  actual_balance!: number;

  @IsString()
  reason!: string;
}
