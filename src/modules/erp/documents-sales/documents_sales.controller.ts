import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { DocumentsSalesService } from './documents_sales.services';
import { CreateDocumentDto } from '../documents/dto/create-document.dto';
import { UpdateDocumentDto } from '../documents/dto/update-document.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { DocumentAccessService } from '@/access-control/services/document-access.service';
import { PermissionContextBuilder } from '@/access-control/authorization/permission-context.builder';

@UseGuards(JwtAuthGuard)
@Controller('documents/sales')
export class DocumentsSalesController {
  constructor(
    private readonly service: DocumentsSalesService,
    private readonly documentAccess: DocumentAccessService,
    private readonly permissionContextBuilder: PermissionContextBuilder,
  ) {}

  private async canViewOrderAmounts(userId: string, companyRole?: string) {
    if (companyRole === 'OWNER' || companyRole === 'ADMIN') return true;
    const context = await this.permissionContextBuilder.build(userId);
    return context.can('sales.orders.view_amounts');
  }

  @Post('generate-from-all-completed-trips')
  async generateFromAllCompletedTrips(@CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertCategory(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      'INVOICE',
      'create',
    );
    const tripIds = await this.service.getAllCompletedTripIds();
    const results: { tripId: string; created: number; skipped: number }[] = [];

    for (const tripId of tripIds) {
      const result = await this.service.generateDraftsFromTrip(tripId);
      results.push({
        tripId,
        created: result.created,
        skipped: result.skipped,
      });
    }

    return { total_trips: tripIds.length, results };
  }

  @Post('generate-from-trip/:tripId')
  async generateFromTrip(@Param('tripId') tripId: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertCategory(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      'INVOICE',
      'create',
    );
    return this.service.generateDraftsFromTrip(tripId);
  }

  @Post('generate-from-trips')
  async generateFromTrips(
    @Body() body: { tripIds: string[]; documentTypeId: string },
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    await this.documentAccess.assertDocumentType(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      body.documentTypeId,
      'create',
    );
    return this.service.generateFromSelectedTrips(body.tripIds, body.documentTypeId);
  }

  @Get('completed-trips-pending')
  async getCompletedTripsPending(@CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertCategory(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      'INVOICE',
      'create',
    );
    return this.service.getCompletedTripsPending();
  }

  @Post()
  async create(@Body() dto: CreateDocumentDto, @CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertDocumentType(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      dto.document_type_id,
      'create',
    );
    return this.service.create(dto, user.id);
  }

  @Post(':id/create-dispatch')
  @RequirePermissions('dispatch_orders.create')
  async createDispatch(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertDocument(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      id,
      'update',
    );
    return this.service.createDispatchFromDocument(id, user.id);
  }

  @Post('dispatch/:dispatchId/create-remito')
  async createRemitoFromDispatch(
    @Param('dispatchId') dispatchId: string,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    await this.documentAccess.assertCategory(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      'REMITO',
      'create',
    );
    return this.service.createRemitoFromDispatch(dispatchId, user.id);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @CurrentUser() user: AuthUser,
    @Query('documentTypeId') documentTypeId?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('categories') categories?: string,
    @Query('direction') direction?: string,
    @Query('party_id') partyId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('excludeCancelled') excludeCancelled?: string,
  ) {
    const companyRole = req['companyUserRole'] as string | undefined;
    const allowedCategories = await this.documentAccess.allowedCategories(user.id, companyRole, 'sales', 'read');
    if (category) await this.documentAccess.assertCategory(user.id, companyRole, 'sales', category, 'read');
    const requestedCategories = category ?? (categories ? categories.split(',').filter(Boolean) : allowedCategories);
    if (Array.isArray(requestedCategories)) {
      for (const requestedCategory of requestedCategories) {
        await this.documentAccess.assertCategory(user.id, companyRole, 'sales', requestedCategory, 'read');
      }
    }
    const documents = await this.service.findAll(
      documentTypeId,
      status !== undefined ? Number(status) : undefined,
      requestedCategories,
      direction !== undefined ? Number(direction) : undefined,
      partyId ? undefined : companyRole === 'USER' ? user.id : undefined,
      partyId,
      companyRole === 'OWNER' || companyRole === 'ADMIN',
      page !== undefined ? Number(page) : undefined,
      pageSize !== undefined ? Number(pageSize) : undefined,
      search,
      sort,
      order,
      excludeCancelled === 'true',
    );
    const canViewAmounts = await this.canViewOrderAmounts(user.id, companyRole);
    if (Array.isArray(documents)) {
      return documents.map((document) => this.service.applyOrderAmountVisibility(document, canViewAmounts));
    }
    return {
      ...documents,
      items: documents.items.map((document) => this.service.applyOrderAmountVisibility(document, canViewAmounts)),
    };
  }

  @Get('pending')
  async findPending(@Query('party_id') partyId?: string, @CurrentUser() user?: AuthUser, @Req() req?: Request) {
    await this.documentAccess.assertCategory(
      user!.id,
      req?.['companyUserRole'] as string | undefined,
      'sales',
      'INVOICE',
      'read',
    );
    return this.service.findPending(partyId);
  }

  @Get(':id/stock-availability')
  async getStockAvailability(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertDocument(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      id,
      'read',
    );
    return this.service.getSalesOrderAvailability(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    const companyRole = req['companyUserRole'] as string | undefined;
    await this.documentAccess.assertDocument(user.id, companyRole, 'sales', id, 'read');
    const document = await this.service.findOne(id);
    const canViewAmounts = await this.canViewOrderAmounts(user.id, companyRole);
    return this.service.applyOrderAmountVisibility(document, canViewAmounts);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentDto,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    const companyRole = req['companyUserRole'] as string | undefined;
    await this.documentAccess.assertDocument(user.id, companyRole, 'sales', id, 'update');
    const currentDocument = await this.service.findOne(id);
    const canViewAmounts = await this.canViewOrderAmounts(user.id, companyRole);
    const visibleDocument = this.service.applyOrderAmountVisibility(currentDocument, canViewAmounts);
    if (visibleDocument?.amounts_visible === false) {
      throw new ForbiddenException('No tenés permiso para editar importes de esta orden en su estado actual');
    }
    return this.service.update(id, dto);
  }

  @Patch(':id/confirm')
  async confirm(
    @Param('id') id: string,
    @Body() body: { assigned_to?: string | null },
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    await this.documentAccess.assertDocument(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      id,
      'confirm',
    );
    return this.service.confirm(id, user.id, body?.assigned_to);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertDocument(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      id,
      'cancel',
    );
    return this.service.cancel(id, user.id);
  }

  @Patch(':id/accept')
  async accept(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    const role = req['companyUserRole'] as string | undefined;
    await this.documentAccess.assertDocument(user.id, role, 'sales', id, 'update');
    await this.documentAccess.assertCategory(user.id, role, 'sales', 'ORDER', 'create');
    return this.service.accept(id, user.id);
  }

  @Patch(':id/deliver')
  async deliver(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    const role = req['companyUserRole'] as string | undefined;
    await this.documentAccess.assertDocument(user.id, role, 'sales', id, 'update');
    await this.documentAccess.assertCategory(user.id, role, 'sales', 'REMITO', 'create');
    return this.service.deliver(id, user.id);
  }

  @Patch(':id/partial-deliver')
  async partialDeliver(
    @Param('id') id: string,
    @Body() body: { items: { document_item_id: string; quantity: number }[] },
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    const role = req['companyUserRole'] as string | undefined;
    await this.documentAccess.assertDocument(user.id, role, 'sales', id, 'update');
    await this.documentAccess.assertCategory(user.id, role, 'sales', 'REMITO', 'create');
    return this.service.partialDeliver(id, body.items, user.id);
  }

  @Patch(':id/partial-invoice')
  async partialInvoice(
    @Param('id') id: string,
    @Body() body: { items: { document_item_id: string; quantity: number }[] },
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    const role = req['companyUserRole'] as string | undefined;
    await this.documentAccess.assertDocument(user.id, role, 'sales', id, 'update');
    await this.documentAccess.assertCategory(user.id, role, 'sales', 'INVOICE', 'create');
    return this.service.partialInvoice(id, body.items, user.id);
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body() body: { status: number },
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    await this.documentAccess.assertDocument(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      id,
      'update',
    );
    return this.service.changeStatus(id, body.status, user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    await this.documentAccess.assertDocument(
      user.id,
      req['companyUserRole'] as string | undefined,
      'sales',
      id,
      'delete',
    );
    return this.service.remove(id, user.id);
  }
}
