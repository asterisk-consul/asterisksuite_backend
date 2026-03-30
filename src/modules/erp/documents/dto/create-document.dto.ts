// dto/create-document.dto.ts
import {
  IsDateString,
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateDocumentDto {
  @IsUUID()
  document_type_id: string;

  @IsOptional()
  @IsUUID()
  party_id?: string;

  @IsInt()
  number: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsInt()
  status?: number;

  @IsOptional()
  @IsDecimal()
  subtotal?: number;

  @IsOptional()
  @IsDecimal()
  total_taxes?: number;

  @IsOptional()
  @IsDecimal()
  total?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  descrip?: string;
}
