import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { PartyContactsService } from './contacts.service';
import { CreatePartyContactDto } from './dto/create-party-contact.dto';
import { UpdatePartyContactDto } from './dto/update-party-contact.dto';

@Controller('party-contacts')
export class PartyContactsController {
  constructor(private readonly partyContactsService: PartyContactsService) {}

  @RequirePermissions('contacts.create')
  @Post()
  create(@Body() dto: CreatePartyContactDto) {
    return this.partyContactsService.create(dto);
  }

  /**
   * GET /party-contacts?party_id=uuid  → filtra por empresa
   * GET /party-contacts                → devuelve todos
   */
  @RequirePermissions('contacts.read')
  @Get()
  findAll(@Query('party_id') party_id?: string) {
    return this.partyContactsService.findAll(party_id);
  }

  @RequirePermissions('contacts.read')
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.partyContactsService.findOne(id);
  }

  @RequirePermissions('contacts.update')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePartyContactDto,
  ) {
    return this.partyContactsService.update(id, dto);
  }

  @RequirePermissions('contacts.delete')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.partyContactsService.remove(id);
  }
}
