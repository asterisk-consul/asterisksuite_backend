import { Body, Controller, Get, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { AllowCompanyAdmins } from '@/access-control/decorators/allow-company-admins.decorator';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { ArcaSettingsService } from './arca-settings.service';

type ArcaCredentialFiles = {
  certificate?: Express.Multer.File[];
  private_key?: Express.Multer.File[];
};

@UseGuards(JwtAuthGuard)
@AllowCompanyAdmins()
@RequirePermissions('companies.update')
@Controller('erp/arca/settings')
export class ArcaSettingsController {
  constructor(private readonly service: ArcaSettingsService) {}

  @Get()
  getSettings(@CurrentUser() user: AuthUser) {
    return this.service.getSettings(user.id);
  }

  @Post('credentials')
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: 'certificate', maxCount: 1 },
      { name: 'private_key', maxCount: 1 },
    ],
    { limits: { files: 2, fileSize: 64 * 1024, fields: 1, parts: 3 } },
  ))
  saveCredentials(
    @CurrentUser() user: AuthUser,
    @Body('issuer_cuit') issuerCuit: string,
    @UploadedFiles() files: ArcaCredentialFiles,
  ) {
    return this.service.saveCredentials(
      user.id,
      issuerCuit,
      files?.certificate?.[0],
      files?.private_key?.[0],
    );
  }

  @Post('test')
  testConnection(@CurrentUser() user: AuthUser) {
    return this.service.testConnection(user.id);
  }

  @Post('simulate-test')
  simulateConnection(@CurrentUser() user: AuthUser) {
    return this.service.simulateConnection(user.id);
  }

  @Patch('point-of-sale')
  selectPointOfSale(@CurrentUser() user: AuthUser, @Body('point_of_sale') pointOfSale?: number | null) {
    return this.service.selectPointOfSale(user.id, pointOfSale ?? null);
  }
}
