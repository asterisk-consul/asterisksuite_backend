import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';

import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { UpdateRolePermissionsDto } from '../dto/update-role-permissions.dto';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access-control/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermissions('roles.read')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RequirePermissions('roles.read')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @RequirePermissions('roles.create')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('roles.update')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Put(':id/permissions')
  @RequirePermissions('roles.manage_permissions')
  updatePermissions(@Param('id') id: string, @Body() dto: UpdateRolePermissionsDto) {
    return this.rolesService.updatePermissions(id, dto.permissions);
  }

  @Delete(':id')
  @RequirePermissions('roles.delete')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
