import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class BankAccountTransferDto {
  @IsString()
  destination_bank_account_id!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  date!: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
