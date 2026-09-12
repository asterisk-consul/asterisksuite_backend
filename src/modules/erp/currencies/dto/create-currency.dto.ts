import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @MaxLength(10)
  code!: string;

  @IsString()
  @MaxLength(100)
  name!: string;

  @IsString()
  @MaxLength(10)
  symbol!: string;

  @IsOptional()
  @IsBoolean()
  is_base?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
