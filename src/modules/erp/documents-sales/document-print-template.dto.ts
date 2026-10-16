import { IsBoolean, IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class SaveDocumentPrintTemplateDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsIn(['QUOTE', 'ORDER'])
  category!: 'QUOTE' | 'ORDER';

  @IsString()
  @MaxLength(120)
  title!: string;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsObject()
  config!: Record<string, unknown>;
}
