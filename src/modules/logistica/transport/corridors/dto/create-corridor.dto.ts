import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { CorridorStopDto } from './corridor-stop.dto';

export class CreateCorridorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsUUID()
  origin_location_id!: string;

  @IsUUID()
  destination_location_id!: string;

  @IsOptional()
  @IsBoolean()
  is_template?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CorridorStopDto)
  stops!: CorridorStopDto[];
}
