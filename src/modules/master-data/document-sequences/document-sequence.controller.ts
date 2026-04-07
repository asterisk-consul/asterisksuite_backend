import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentSequencesService } from './document-sequences.service';
import { CreateDocumentSequenceDto } from './dto/create-document-sequences.dto';
import { UpdateDocumentSequenceDto } from './dto/update-document-sequences.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
@Controller('document-sequence')
@UseGuards(JwtAuthGuard)
export class DocumentSequenceController {
  constructor(private readonly service: DocumentSequencesService) {}

  @Post()
  create(@Body() dto: CreateDocumentSequenceDto) {
    return this.service.create(dto);
  }
}
