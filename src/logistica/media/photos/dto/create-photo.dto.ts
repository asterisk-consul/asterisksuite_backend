import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  entity_type!: string;

  @IsUUID()
  entity_id!: string;

  @IsUUID()
  file_id!: string;

  @IsOptional()
  @IsString()
  photo_type?: string;
}
