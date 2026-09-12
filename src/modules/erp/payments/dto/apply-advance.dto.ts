import { IsString, IsNumber, Min } from 'class-validator';

export class ApplyAdvanceDto {
  @IsString()
  document_id!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;
}
