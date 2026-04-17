import { Module } from '@nestjs/common';
import { ReporteChoferesController } from './dispatch_rates.controller';
import { ReporteChoferesService } from './dispatch_rates.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [ReporteChoferesController],
  providers: [ReporteChoferesService, PrismaService],
  exports: [ReporteChoferesService],
})
export class ReporteChoferesModule {}
