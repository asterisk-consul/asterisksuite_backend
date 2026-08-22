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
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { DocumentsTypesService } from './documents-types.service';
import { CreateDocumentsTypeDto } from './dto/create-documents-type.dto';
import { UpdateDocumentsTypeDto } from './dto/update-documents-type.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@Controller('documents-types')
@UseGuards(JwtAuthGuard)
export class DocumentsTypesController {
  constructor(private readonly documentsTypesService: DocumentsTypesService) {}

  @RequirePermissions('document_types.create')
  @Post()
  create(@Body() createDocumentsTypeDto: CreateDocumentsTypeDto) {
    return this.documentsTypesService.create(createDocumentsTypeDto);
  }

  @RequirePermissions('document_types.read')
  @Get()
  findAll(
    @Query('company_id') companyId: string,
    @Query('direction') direction?: string,
    @Query('issuer_condition') issuerCondition?: string,
  ) {
    return this.documentsTypesService.findAll(
      companyId,
      direction ? Number(direction) : undefined,
      issuerCondition,
    );
  }

  @RequirePermissions('document_types.update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentsTypeDto: UpdateDocumentsTypeDto,
  ) {
    return this.documentsTypesService.update(id, updateDocumentsTypeDto);
  }
}
