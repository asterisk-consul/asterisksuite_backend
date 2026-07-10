import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DocumentsSalesService } from './documents_sales.services';
import { CreateDocumentDto } from '../documents/dto/create-document.dto';
import { UpdateDocumentDto } from '../documents/dto/update-document.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
// import { PermissionsGuard } from '@/access-control/guards/permissions.guard';
// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('documents/sales')
export class DocumentsSalesController {
  constructor(private readonly service: DocumentsSalesService) {}

  @Post('generate-from-all-completed-trips')
  // @RequirePermissions('documents.create')
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
  // @RequirePermissions('documents.create')
  generateFromTrip(@Param('tripId') tripId: string) {
    return this.service.generateDraftsFromTrip(tripId);
  }

  @Post()
  // @RequirePermissions('documents.create')
  create(@Body() dto: CreateDocumentDto) {
    return this.service.create(dto);
  }

  @Get()
  // @RequirePermissions('documents.read')
  findAll(@Query('documentTypeId') documentTypeId?: string, @Query('status') status?: string) {
    return this.service.findAll(documentTypeId, status !== undefined ? Number(status) : undefined);
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
  confirm(@Param('id') id: string) {
    return this.service.confirm(id);
  }

  @Patch(':id/cancel')
  // @RequirePermissions('documents.cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }

  @Delete(':id')
  // @RequirePermissions('documents.delete')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
