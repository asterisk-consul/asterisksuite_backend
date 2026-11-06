import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../auth/jwt/jwt-auth.guard';
import { SetPlatformAdminScopesDto } from './dto/platform-plans.dto';
import { SkipPlatformModuleCheck } from './platform-module.decorators';
import { PlatformAdministratorsService } from './platform-administrators.service';

@Controller('platform-admin/administrators')
@UseGuards(JwtAuthGuard)
@SkipPlatformModuleCheck()
export class PlatformAdministratorsController {
  constructor(private readonly administrators: PlatformAdministratorsService) {}

  @Get()
  list(@CurrentUser('id') actorId: string) {
    return this.administrators.list(actorId);
  }

  @Get('lookup')
  findExistingUser(@CurrentUser('id') actorId: string, @Query('email') email: string) {
    return this.administrators.findExistingUser(actorId, email);
  }

  @Put(':userId')
  setScopes(
    @CurrentUser('id') actorId: string,
    @Param('userId') userId: string,
    @Body() dto: SetPlatformAdminScopesDto,
  ) {
    return this.administrators.setScopes(actorId, userId, dto);
  }

  @Delete(':userId')
  revoke(@CurrentUser('id') actorId: string, @Param('userId') userId: string) {
    return this.administrators.revoke(actorId, userId);
  }
}
