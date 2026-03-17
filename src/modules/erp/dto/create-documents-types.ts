import { IsUUID, IsNumber } from 'class-validator';

export class CreateDocumentTypeDto {
  @IsUUID()
  rate_id!: string;

  @IsNumber()
  value!: number;
}
