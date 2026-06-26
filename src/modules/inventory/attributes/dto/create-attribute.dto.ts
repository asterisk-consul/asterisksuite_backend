import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum AttributeType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
}

export class CreateAttributeDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsString()
  @MaxLength(100)
  code!: string;

  @IsEnum(AttributeType)
  type!: AttributeType;

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}
