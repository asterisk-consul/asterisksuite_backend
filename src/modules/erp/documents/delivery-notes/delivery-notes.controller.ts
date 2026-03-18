import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Res, // ← agregado
} from '@nestjs/common';
import type { Response } from 'express';
import { DeliveryNotesService } from './delivery-notes.service';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import { UpdateDeliveryNoteDto } from './dto/update-delivery-note.dto';
import { QueryDeliveryNoteDto } from './dto/query-delivery-note.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';

@Controller('delivery-notes')
@UseGuards(JwtAuthGuard)
export class DeliveryNotesController {
  constructor(private readonly service: DeliveryNotesService) {}

  @Post()
  create(@Body() dto: CreateDeliveryNoteDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user.id);
  }

  @Post(':id/confirm')
  confirm(@Param('id') id: string) {
    const userId = 'HARDCODE_USER_ID';
    return this.service.confirm(id, userId);
  }

  @Get()
  findAll(@Query() query: QueryDeliveryNoteDto) {
    return this.service.findAll(query);
  }

  @Get(':id/pdf') // ← tiene que ir ANTES de :id
  async downloadPdf(
    @Param('id') id: string,
    @Res() res: Response, // ← Res importado de @nestjs/common
  ) {
    const buffer = await this.service.generatePdf(id); // ← this.service no this.deliveryNotesService

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="remito-${id}.pdf"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Get(':id') // ← tiene que ir DESPUÉS de :id/pdf
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDeliveryNoteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
