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
import { DocumentsSalesService } from './documents_purchases.service';
import { CreateDocumentDto } from '../documents/dto/create-document.dto';
import { UpdateDocumentDto } from '../documents/dto/update-document.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@Controller('documents/purchases-documents')
@UseGuards(JwtAuthGuard)
export class DocumentsSalesController {
  constructor(private readonly service: DocumentsSalesService) {}

  @Post()
  create(@Body() dto: CreateDocumentDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('documentTypeId') documentTypeId?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(
      documentTypeId,
      status !== undefined ? Number(status) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.service.confirm(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
