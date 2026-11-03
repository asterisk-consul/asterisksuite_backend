import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ArcaHomologationClient } from './arca-homologation.client';
import { ArcaSettingsController } from './arca-settings.controller';
import { ArcaSettingsService } from './arca-settings.service';

@Module({
  imports: [PrismaModule],
  controllers: [ArcaSettingsController],
  providers: [ArcaHomologationClient, ArcaSettingsService],
})
export class ArcaModule {}
