import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDocumentDto } from './create-sale-document.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateSaleDocumentDto extends PartialType(CreateSaleDocumentDto) {
  // status: 0 = borrador, 1 = confirmado, 2 = anulado
  @IsInt()
  @IsOptional()
  status?: number;
}
