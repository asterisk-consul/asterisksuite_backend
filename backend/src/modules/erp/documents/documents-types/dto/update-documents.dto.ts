import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentsTypesDto } from './create-documentsTypes.dto';

export class UpdateDocumentsTypesDto extends PartialType(
  CreateDocumentsTypesDto,
) {}
