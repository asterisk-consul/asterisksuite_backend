import { IsBoolean, IsIn, IsOptional, IsUUID } from 'class-validator';

export type BankAccountDeleteMode = 'TRANSFER' | 'DISCARD';

export class DeleteBankAccountDto {
  @IsIn(['ELIMINAR'])
  confirmation!: string;

  @IsOptional()
  @IsIn(['TRANSFER', 'DISCARD'])
  mode?: BankAccountDeleteMode;

  @IsOptional()
  @IsBoolean()
  delete_movements?: boolean;

  @IsOptional()
  @IsUUID()
  target_bank_account_id?: string;
}
