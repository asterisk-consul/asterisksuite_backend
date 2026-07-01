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
} from '@nestjs/common';
import { DeliveryNotesService } from './delivery-notes.service';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import { UpdateDeliveryNoteDto } from './dto/update-delivery-note.dto';
import { QueryDeliveryNoteDto } from './dto/query-delivery-note.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@Controller('delivery-notes')
@UseGuards(JwtAuthGuard)
export class DeliveryNotesController {
  constructor(private readonly service: DeliveryNotesService) {}

  // @RequirePermissions('delivery_notes.create')
  @Post()
  create(@Body() dto: CreateDeliveryNoteDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user.id);
  }

  // @RequirePermissions('delivery_notes.confirm')
  @Post(':id/confirm')
  confirm(@Param('id') id: string) {
    const userId = 'HARDCODE_USER_ID';
    return this.service.confirm(id, userId);
  }

  // @RequirePermissions('delivery_notes.read')
  @Get()
  findAll(@Query() query: QueryDeliveryNoteDto) {
    return this.service.findAll(query);
  }

  // @RequirePermissions('delivery_notes.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // @RequirePermissions('delivery_notes.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDeliveryNoteDto) {
    return this.service.update(id, dto);
  }

  // @RequirePermissions('delivery_notes.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
