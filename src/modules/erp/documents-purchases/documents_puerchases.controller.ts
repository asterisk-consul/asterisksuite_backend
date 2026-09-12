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
import { DocumentAccessService } from '@/access-control/services/document-access.service';

@Controller('documents/purchases-documents')
@UseGuards(JwtAuthGuard)
export class DocumentsPurchasesController {
  constructor(private readonly service: DocumentsPurchasesService, private readonly documentAccess: DocumentAccessService) {}

  @Post()
  async create(@Body() dto: CreateDocumentDto, @CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertDocumentType(user.id, req['companyUserRole'] as string | undefined, 'purchases', dto.document_type_id, 'create');
    return this.service.create(dto, user.id);
  }

  @Get('pending')
  async findPending(
    @Query('party_id') partyId?: string,
    @CurrentUser() user?: AuthUser,
    @Req() req?: Request,
  ) {
    await this.documentAccess.assertCategory(user!.id, req?.['companyUserRole'] as string | undefined, 'purchases', 'INVOICE', 'read');
    return this.service.findPending(partyId);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @CurrentUser() user: AuthUser,
    @Query('documentTypeId') documentTypeId?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('direction') direction?: string,
  ) {
    const companyRole = req['companyUserRole'] as string | undefined;
    const allowedCategories = await this.documentAccess.allowedCategories(user.id, companyRole, 'purchases', 'read');
    if (category) await this.documentAccess.assertCategory(user.id, companyRole, 'purchases', category, 'read');
    return this.service.findAll(
      documentTypeId,
      status !== undefined ? Number(status) : undefined,
      category ?? allowedCategories,
      direction !== undefined ? Number(direction) : undefined,
      companyRole === 'USER' ? user.id : undefined,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertDocument(user.id, req['companyUserRole'] as string | undefined, 'purchases', id, 'read');
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDocumentDto, @CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertDocument(user.id, req['companyUserRole'] as string | undefined, 'purchases', id, 'update');
    return this.service.update(id, dto);
  }

  @Patch(':id/confirm')
  async confirm(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request, @Query() query?: ConfirmPurchaseDto) {
    await this.documentAccess.assertDocument(user.id, req['companyUserRole'] as string | undefined, 'purchases', id, 'confirm');
    return this.service.confirm(id, user.id, query);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertDocument(user.id, req['companyUserRole'] as string | undefined, 'purchases', id, 'cancel');
    return this.service.cancel(id, user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertDocument(user.id, req['companyUserRole'] as string | undefined, 'purchases', id, 'delete');
    return this.service.remove(id);
  }
}
