import {
  IsUUID,
  IsString,
  IsOptional,
  IsDecimal,
  MaxLength,
} from 'class-validator';

export class CreateStockMovementDto {
  @IsUUID()
  warehouse_id!: string;

  @IsUUID()
  product_id!: string;

  @IsString()
  @MaxLength(20)
  movement_type!: string;

  @IsString()
  @MaxLength(3)
  direction!: 'IN' | 'OUT';

  @IsDecimal()
  quantity!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  reference_type?: string;

  @IsOptional()
  @IsUUID()
  reference_id?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  created_by?: string;
}
