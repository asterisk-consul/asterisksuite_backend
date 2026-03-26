import { IsString, IsIn } from 'class-validator';

export class CreateDocumentTypeDto {
  @IsString()
  name!: string;

  @IsIn(['VEHICLE', 'DRIVER'])
  entity!: 'VEHICLE' | 'DRIVER';
}
