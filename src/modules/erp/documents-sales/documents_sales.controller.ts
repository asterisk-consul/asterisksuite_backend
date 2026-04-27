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
import { DocumentsSalesService } from './documents_sales.services';
import { CreateSaleDocumentDto } from './dto/create-sale-document.dto';
import { UpdateSaleDocumentDto } from './dto/update-sale-document.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@Controller('documents/sales')
@UseGuards(JwtAuthGuard)
export class DocumentsSalesController {
  constructor(private readonly service: DocumentsSalesService) {}

  // ← PRIMERO las rutas estáticas
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

  // ← DESPUÉS las rutas dinámicas con :param
  @Post('generate-from-trip/:tripId')
  generateFromTrip(@Param('tripId') tripId: string) {
    return this.service.generateDraftsFromTrip(tripId);
  }

  @Post()
  create(@Body() dto: CreateSaleDocumentDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateSaleDocumentDto) {
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
