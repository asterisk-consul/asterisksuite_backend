import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsBoolean, IsOptional, IsUUID, ValidateNested } from 'class-validator';

class IntercompanyShareItemDto {
  @IsUUID()
  company_id!: string;

  @IsBoolean()
  allow_payments!: boolean;

  @IsBoolean()
  allow_collections!: boolean;

  @IsBoolean()
  allow_hr!: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateIntercompanySharesDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => IntercompanyShareItemDto)
  shares!: IntercompanyShareItemDto[];
}
