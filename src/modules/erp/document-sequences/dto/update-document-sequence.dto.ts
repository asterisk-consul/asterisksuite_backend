import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentSequenceDto } from './create-document-sequence.dto';

export class UpdateDocumentSequenceDto extends PartialType(CreateDocumentSequenceDto) {}
