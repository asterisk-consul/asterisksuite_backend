import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GetTablePreferencesDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  tableKey!: string;
}
