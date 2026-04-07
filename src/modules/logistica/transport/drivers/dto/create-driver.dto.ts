import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DriverDocumentDto } from './driver-document.dto';

export class CreateDriverDto {
  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DriverDocumentDto)
  documents?: DriverDocumentDto[];
}
