import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DocumentsPurchasesService } from './documents_purchases.service';
import { CreateDocumentDto } from '../documents/dto/create-document.dto';
import { UpdateDocumentDto } from '../documents/dto/update-document.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@Controller('documents/purchases-documents')
@UseGuards(JwtAuthGuard)
export class DocumentsPurchasesController {
  constructor(private readonly service: DocumentsPurchasesService) {}

  // @RequirePermissions('documents-purchases.create')
  @Post()
  create(@Body() dto: CreateDocumentDto) {
    return this.service.create(dto);
  }

  @Get('pending')
  // @RequirePermissions('documents-purchases.read')
  findPending(@Query('party_id') partyId?: string) {
    return this.service.findPending(partyId);
  }

  // @RequirePermissions('documents-purchases.read')
  @Get()
  findAll(@Query('documentTypeId') documentTypeId?: string, @Query('status') status?: string) {
    return this.service.findAll(documentTypeId, status !== undefined ? Number(status) : undefined);
  }

  // @RequirePermissions('documents-purchases.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // @RequirePermissions('documents-purchases.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.service.update(id, dto);
  }

  // @RequirePermissions('documents-purchases.confirm')
  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.service.confirm(id);
  }

  // @RequirePermissions('documents-purchases.cancel')
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }

  // @RequirePermissions('documents-purchases.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
