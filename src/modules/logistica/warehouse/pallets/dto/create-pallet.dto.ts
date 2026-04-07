import { IsUUID, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreatePalletDto {
  @IsString()
  @MaxLength(100)
  code!: string;

  @IsOptional()
  @IsUUID()
  warehouse_id?: string;

  @IsString()
  @MaxLength(20)
  status!: string;

  @IsOptional()
  @IsUUID()
  created_by?: string;
}
