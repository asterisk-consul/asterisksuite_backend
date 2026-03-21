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
import { PartyContactsService } from './contacts.service';
import { CreatePartyContactDto } from './dto/create-party-contact.dto';
import { UpdatePartyContactDto } from './dto/update-party-contact.dto';

@Controller('party-contacts')
export class PartyContactsController {
  constructor(private readonly partyContactsService: PartyContactsService) {}

  @Post()
  create(@Body() dto: CreatePartyContactDto) {
    return this.partyContactsService.create(dto);
  }

  /**
   * GET /party-contacts?party_id=uuid  → filtra por empresa
   * GET /party-contacts                → devuelve todos
   */
  @Get()
  findAll(@Query('party_id') party_id?: string) {
    return this.partyContactsService.findAll(party_id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.partyContactsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePartyContactDto,
  ) {
    return this.partyContactsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.partyContactsService.remove(id);
  }
}
