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

@Controller('logistica/document-types')
@UseGuards(JwtAuthGuard)
export class DocumentTypesController {
  constructor(private readonly service: DocumentTypesService) {}

  @Post()
  create(@Body() dto: CreateDocumentTypeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('entity') entity?: 'VEHICLE' | 'DRIVER') {
    return this.service.findAll(entity);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateDocumentTypeDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.service.active(id);
  }
}
