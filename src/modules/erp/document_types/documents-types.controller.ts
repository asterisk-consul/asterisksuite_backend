// documents-types.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentsTypesService } from './documents-types.service';
import { CreateDocumentsTypeDto } from './dto/create-documents-type.dto';
import { UpdateDocumentsTypeDto } from './dto/update-documents-type.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@Controller('documents-types')
@UseGuards(JwtAuthGuard)
export class DocumentsTypesController {
  constructor(private readonly documentsTypesService: DocumentsTypesService) {}

  @Post()
  create(@Body() dto: CreateDocumentsTypeDto) {
    return this.documentsTypesService.create(dto);
  }

  @Get()
  findAll(@Query('company_id') companyId: string) {
    return this.documentsTypesService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentsTypeDto) {
    return this.documentsTypesService.update(id, dto);
  }
}
