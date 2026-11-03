import { Module } from '@nestjs/common';
import { PlatformModulesModule } from '@/modules/core/platform-modules/platform-modules.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ArcaHomologationClient } from './arca-homologation.client';
import { ArcaSettingsController } from './arca-settings.controller';
import { ArcaSettingsService } from './arca-settings.service';

@Module({
  imports: [PrismaModule, PlatformModulesModule],
  controllers: [ArcaSettingsController],
  providers: [ArcaHomologationClient, ArcaSettingsService],
})
export class ArcaModule {}
