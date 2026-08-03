import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DocumentsSalesService } from './documents_sales.services';
import { CreateDocumentDto } from '../documents/dto/create-document.dto';
import { UpdateDocumentDto } from '../documents/dto/update-document.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('documents/sales')
export class DocumentsSalesController {
  constructor(private readonly service: DocumentsSalesService) {}

  @Post('generate-from-all-completed-trips')
  async generateFromAllCompletedTrips() {
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
  generateFromTrip(@Param('tripId') tripId: string) {
    return this.service.generateDraftsFromTrip(tripId);
  }

  @Post('generate-from-trips')
  async generateFromTrips(
    @Body() body: { tripIds: string[]; documentTypeId: string },
  ) {
    return this.service.generateFromSelectedTrips(body.tripIds, body.documentTypeId);
  }

  @Get('completed-trips-pending')
  async getCompletedTripsPending() {
    return this.service.getCompletedTripsPending();
  }

  @Post()
  // @RequirePermissions('documents.create')
  create(@Body() dto: CreateDocumentDto) {
    return this.service.create(dto);
  }

  @Get()
  // @RequirePermissions('documents.read')
  findAll(
    @Query('documentTypeId') documentTypeId?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.service.findAll(documentTypeId, status !== undefined ? Number(status) : undefined, category);
  }

  @Get('pending')
  // @RequirePermissions('documents.read')
  findPending(@Query('party_id') partyId?: string) {
    return this.service.findPending(partyId);
  }

  @Get(':id')
  // @RequirePermissions('documents.read')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  // @RequirePermissions('documents.update')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/confirm')
  // @RequirePermissions('documents.confirm')
  confirm(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.confirm(id, user.id);
  }

  @Patch(':id/cancel')
  // @RequirePermissions('documents.cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.cancel(id, user.id);
  }

  @Patch(':id/accept')
  // @RequirePermissions('documents.update')
  accept(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.accept(id, user.id);
  }

  @Patch(':id/deliver')
  // @RequirePermissions('documents.update')
  deliver(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.deliver(id, user.id);
  }

  @Patch(':id/partial-deliver')
  // @RequirePermissions('documents.update')
  partialDeliver(
    @Param('id') id: string,
    @Body() body: { items: { document_item_id: string; quantity: number }[] },
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.partialDeliver(id, body.items, user.id);
  }

  @Patch(':id/partial-invoice')
  // @RequirePermissions('documents.update')
  partialInvoice(
    @Param('id') id: string,
    @Body() body: { items: { document_item_id: string; quantity: number }[] },
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.partialInvoice(id, body.items, user.id);
  }

  @Patch(':id/status')
  // @RequirePermissions('documents.update')
  changeStatus(
    @Param('id') id: string,
    @Body() body: { status: number },
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.changeStatus(id, body.status, user.id);
  }

  @Delete(':id')
  // @RequirePermissions('documents.delete')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
