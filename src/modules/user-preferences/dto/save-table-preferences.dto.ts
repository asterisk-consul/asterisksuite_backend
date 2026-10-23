import { ArrayMaxSize, IsArray, IsNotEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class SaveTablePreferencesDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  tableKey!: string;

  @IsArray()
  @ArrayMaxSize(250)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(200, { each: true })
  columnOrder!: string[];

  @IsObject()
  columnVisibility!: Record<string, boolean>;
}
