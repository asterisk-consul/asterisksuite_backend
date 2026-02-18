import { IsOptional, IsString, IsUUID, IsInt } from 'class-validator';

export class CreateFileDto {
  @IsOptional()
  @IsString()
  storage_provider?: string;

  @IsString()
  file_path!: string;

  @IsOptional()
  @IsString()
  public_url?: string;

  @IsOptional()
  @IsString()
  file_name?: string;

  @IsOptional()
  @IsString()
  mime_type?: string;

  @IsOptional()
  @IsInt()
  file_size?: number;

  @IsOptional()
  @IsUUID()
  uploaded_by?: string;
}
