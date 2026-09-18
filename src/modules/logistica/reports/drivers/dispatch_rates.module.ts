import { Module } from '@nestjs/common';
import { ReporteChoferesController } from './dispatch_rates.controller';
import { ReporteChoferesService } from './dispatch_rates.service';

@Module({
  controllers: [ReporteChoferesController],
  providers: [ReporteChoferesService],
  exports: [ReporteChoferesService],
})
export class ReporteChoferesModule {}
