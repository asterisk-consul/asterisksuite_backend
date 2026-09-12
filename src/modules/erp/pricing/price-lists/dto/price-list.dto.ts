import { IsString, IsUUID, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreatePriceListDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsString()
  @MaxLength(20)
  type!: string;

  @IsUUID()
  currency_id!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdatePriceListDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  type?: string;

  @IsOptional()
  @IsUUID()
  currency_id?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
