// dto/update-document-type.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentsTypeDto } from './create-documents-type.dto';

export class UpdateDocumentsTypeDto extends PartialType(
  CreateDocumentsTypeDto,
) {}
