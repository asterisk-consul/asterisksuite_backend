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
import { BusinessPartiesService } from './business-parties.service';
import { CreateBusinessPartyDto } from './dto/create-business-party.dto';
import { UpdateBusinessPartyDto } from './dto/update-business-party.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
@Controller('master-data/business-parties')
@UseGuards(JwtAuthGuard)
export class BusinessPartiesController {
  constructor(private readonly service: BusinessPartiesService) {}

  @Post()
  create(@Body() dto: CreateBusinessPartyDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('company_id') companyId: string) {
    return this.service.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBusinessPartyDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
