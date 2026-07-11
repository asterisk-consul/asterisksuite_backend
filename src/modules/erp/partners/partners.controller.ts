import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { LinkUserDto } from './dto/link-user.dto';
// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('erp/partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  // @RequirePermissions('partners.create')
  @Post()
  create(@Body() dto: CreatePartnerDto, @CurrentUser() user: AuthUser) {
    return this.partnersService.create(dto, user.id);
  }

  // @RequirePermissions('partners.read')
  @Get()
  findAll() {
    return this.partnersService.findAll();
  }

  // @RequirePermissions('partners.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnersService.findOne(id);
  }

  // @RequirePermissions('partners.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePartnerDto, @CurrentUser() user: AuthUser) {
    return this.partnersService.update(id, dto, user.id);
  }

  // @RequirePermissions('partners.update')
  @Patch(':id/link-user')
  linkUser(@Param('id') id: string, @Body() dto: LinkUserDto) {
    return this.partnersService.linkUser(id, dto.user_id);
  }

  // @RequirePermissions('partners.update')
  @Patch(':id/unlink-user')
  unlinkUser(@Param('id') id: string) {
    return this.partnersService.unlinkUser(id);
  }

  // @RequirePermissions('partners.delete')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.partnersService.remove(id, user.id);
  }
}
