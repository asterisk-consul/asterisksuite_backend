import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { PermissionsService } from '../services/permissions.service';

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access-control/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @RequirePermissions('permissions.read')
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':code')
  @RequirePermissions('permissions.read')
  findByCode(@Param('code') code: string) {
    return this.permissionsService.findByCode(code);
  }
}
