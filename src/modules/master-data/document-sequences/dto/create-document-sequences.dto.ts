import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateDocumentSequenceDto {
  @IsUUID()
  company_id!: string;

  @IsString()
  @MaxLength(50)
  name!: string;

  @IsString()
  @MaxLength(10)
  point_of_sale!: string;

  @IsBoolean()
  automatic!: boolean;

  // Solo requeridos cuando automatic=false (el usuario define el rango)
  @ValidateIf((o) => o.automatic === false)
  @IsInt()
  @Min(0)
  range_start!: number;

  @ValidateIf((o) => o.automatic === false)
  @IsInt()
  @Min(1)
  range_end!: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  prefix?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
