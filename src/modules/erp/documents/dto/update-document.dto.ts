import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  // status: 0 = borrador, 1 = confirmado, 2 = anulado
  @IsInt()
  @IsOptional()
  status?: number;
}
