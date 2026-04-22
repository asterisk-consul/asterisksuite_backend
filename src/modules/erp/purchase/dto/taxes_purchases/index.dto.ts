import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class IndexTaxesPurchasesDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  // 👇 clave para tu lógica
  @IsOptional()
  @IsString()
  taxType?: string; // ejemplo: 'PURCHASE'

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
