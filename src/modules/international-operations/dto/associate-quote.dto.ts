import { IsUUID } from 'class-validator';

export class AssociateQuoteDto {
  @IsUUID()
  document_id: string;
}
