import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { DeliveryNotesService } from './delivery-notes.service';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import { UpdateDeliveryNoteDto } from './dto/update-delivery-note.dto';
import { QueryDeliveryNoteDto } from './dto/query-delivery-note.dto';

@Controller('delivery-notes')
export class DeliveryNotesController {
  constructor(private readonly service: DeliveryNotesService) {}

  @Post()
  create(@Body() dto: CreateDeliveryNoteDto) {
    const userId = 'HARDCODE_USER_ID'; // después lo sacamos del JWT
    return this.service.create(dto, userId);
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

  @Get(':id')
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
