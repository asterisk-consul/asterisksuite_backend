import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryDeliveryNoteDto {
  @IsOptional()
  @IsUUID()
  company_id?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  number?: string;
}
