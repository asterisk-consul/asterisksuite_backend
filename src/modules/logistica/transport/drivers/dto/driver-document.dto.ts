import { IsUUID, IsOptional, IsDateString } from 'class-validator';

export class DriverDocumentDto {
  @IsUUID()
  document_type_id!: string;

  @IsOptional()
  @IsDateString()
  expiration_date?: string;
}
