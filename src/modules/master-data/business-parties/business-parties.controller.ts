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
// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { BusinessPartiesService } from './business-parties.service';
import { CreateBusinessPartyDto } from './dto/create-business-party.dto';
import { UpdateBusinessPartyDto } from './dto/update-business-party.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
@Controller('master-data/business-parties')
@UseGuards(JwtAuthGuard)
export class BusinessPartiesController {
  constructor(private readonly service: BusinessPartiesService) {}

  // @RequirePermissions('business_parties.create')
  @Post()
  create(@Body() dto: CreateBusinessPartyDto) {
    return this.service.create(dto);
  }

  // @RequirePermissions('business_parties.read')
  @Get()
  findAll(@Query('type') type?: string) {
    return this.service.findAll(type);
  }

  // @RequirePermissions('business_parties.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // @RequirePermissions('business_parties.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBusinessPartyDto) {
    return this.service.update(id, dto);
  }

  // @RequirePermissions('business_parties.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
