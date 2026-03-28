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
  create(@Body() createDocumentsTypeDto: CreateDocumentsTypeDto) {
    return this.documentsTypesService.create(createDocumentsTypeDto);
  }

  @Get()
  findAll(@Query('company_id') companyId: string) {
    return this.documentsTypesService.findAll(companyId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentsTypeDto: UpdateDocumentsTypeDto,
  ) {
    return this.documentsTypesService.update(id, updateDocumentsTypeDto);
  }
}
