import { IsIn, IsOptional, IsUUID } from 'class-validator';

export class DeleteCashBoxDto {
  @IsIn(['ELIMINAR'])
  confirmation!: string;

  @IsOptional()
  @IsUUID()
  target_cash_box_id?: string;
}
