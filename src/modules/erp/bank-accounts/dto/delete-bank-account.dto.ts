import { IsIn, IsOptional, IsUUID } from 'class-validator';

export class DeleteBankAccountDto {
  @IsIn(['ELIMINAR'])
  confirmation!: string;

  @IsOptional()
  @IsUUID()
  target_bank_account_id?: string;
}
