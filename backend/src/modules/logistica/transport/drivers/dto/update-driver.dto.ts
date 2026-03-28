import { PartialType } from '@nestjs/mapped-types';
import { CreateDriverDto } from './create-driver.dto';
import { IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { DriverDocumentDto } from './driver-document.dto';

export class UpdateDriverDto extends PartialType(CreateDriverDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DriverDocumentDto)
  documents?: DriverDocumentDto[];
}
