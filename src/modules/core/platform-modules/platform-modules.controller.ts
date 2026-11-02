import { Controller, ForbiddenException, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt/jwt-auth.guard';
import { getCurrentCompanyId } from '../../../common/context/request-context.helpers';
import { SkipPlatformModuleCheck } from './platform-module.decorators';
import { PlatformModulesService } from './platform-modules.service';

@Controller('platform-modules')
@UseGuards(JwtAuthGuard)
export class PlatformModulesController {
  constructor(private readonly platformModules: PlatformModulesService) {}

  @Get('effective')
  @SkipPlatformModuleCheck()
  getEffectiveModules() {
    const companyId = getCurrentCompanyId();
    if (!companyId) {
      throw new ForbiddenException('No hay una empresa activa');
    }

    return this.platformModules.getEffectiveModules(companyId);
  }
}
