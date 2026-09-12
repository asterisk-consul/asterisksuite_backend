import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { DocumentSequencesService } from './document-sequences.service';
import { CreateDocumentSequenceDto } from './dto/create-document-sequence.dto';
import { UpdateDocumentSequenceDto } from './dto/update-document-sequence.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/document-sequences')
export class DocumentSequencesController {
  constructor(private readonly service: DocumentSequencesService) {}

  @Post()
  create(@Body() dto: CreateDocumentSequenceDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentSequenceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
