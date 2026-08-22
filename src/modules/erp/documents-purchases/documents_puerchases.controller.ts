import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { DocumentsPurchasesService } from './documents_purchases.service';
import { CreateDocumentDto } from '../documents/dto/create-document.dto';
import { UpdateDocumentDto } from '../documents/dto/update-document.dto';
import { ConfirmPurchaseDto } from './dto/confirm-purchase.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('documents/purchases-documents')
@UseGuards(JwtAuthGuard)
export class DocumentsPurchasesController {
  constructor(private readonly service: DocumentsPurchasesService) {}

  @RequirePermissions('documents-purchases.create')
  @Post()
  create(@Body() dto: CreateDocumentDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user.id);
  }

  @Get('pending')
  @RequirePermissions('documents-purchases.read')
  findPending(
    @Query('party_id') partyId?: string,
  ) {
    return this.service.findPending(partyId);
  }

  @RequirePermissions('documents-purchases.read')
  @Get()
  findAll(
    @Req() req: Request,
    @CurrentUser() user: AuthUser,
    @Query('documentTypeId') documentTypeId?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('direction') direction?: string,
  ) {
    const companyRole = req['companyUserRole'] as string | undefined;
    return this.service.findAll(
      documentTypeId,
      status !== undefined ? Number(status) : undefined,
      category,
      direction !== undefined ? Number(direction) : undefined,
      companyRole === 'USER' ? user.id : undefined,
    );
  }

  @RequirePermissions('documents-purchases.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @RequirePermissions('documents-purchases.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.service.update(id, dto);
  }

  @RequirePermissions('documents-purchases.confirm')
  @Patch(':id/confirm')
  confirm(@Param('id') id: string, @CurrentUser() user: AuthUser, @Query() query?: ConfirmPurchaseDto) {
    return this.service.confirm(id, user.id, query);
  }

  @RequirePermissions('documents-purchases.cancel')
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.cancel(id, user.id);
  }

  @RequirePermissions('documents-purchases.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
