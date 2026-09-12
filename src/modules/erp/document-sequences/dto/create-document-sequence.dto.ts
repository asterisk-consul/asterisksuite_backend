import { IsString, IsOptional, IsBoolean, IsInt, MaxLength, IsArray, IsUUID } from 'class-validator';

export class CreateDocumentSequenceDto {
  @IsString()
  @MaxLength(50)
  name!: string;

  @IsString()
  @MaxLength(10)
  point_of_sale!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  prefix?: string;

  @IsOptional()
  @IsInt()
  range_start?: number;

  @IsOptional()
  @IsInt()
  range_end?: number;

  @IsOptional()
  @IsBoolean()
  automatic?: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  document_type_ids?: string[];
}
