import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentTypesService } from './document-types.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@Controller('logistica/document-types')
@UseGuards(JwtAuthGuard)
export class DocumentTypesController {
  constructor(private readonly service: DocumentTypesService) {}

  // @RequirePermissions('transport_document_types.create')
  @Post()
  create(@Body() dto: CreateDocumentTypeDto) {
    return this.service.create(dto);
  }

  // @RequirePermissions('transport_document_types.read')
  @Get()
  findAll(@Query('entity') entity?: 'VEHICLE' | 'DRIVER') {
    return this.service.findAll(entity);
  }

  // @RequirePermissions('transport_document_types.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentTypeDto) {
    return this.service.update(id, dto);
  }

  // @RequirePermissions('transport_document_types.update')
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }

  // @RequirePermissions('transport_document_types.update')
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.service.active(id);
  }
}
