import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReporteChoferesService } from './dispatch_rates.service';
import {
  ReporteChoferesQueryDto,
  ReporteChoferesResponseDto,
} from './dto/dispatch_rates_drivers';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // descomenta si usás guards

@Controller('reportes/choferes')
// @UseGuards(JwtAuthGuard)
export class ReporteChoferesController {
  constructor(
    private readonly reporteChoferesService: ReporteChoferesService,
  ) {}

  /**
   * GET /reportes/choferes
   *
   * Query params opcionales:
   *  - fechaDesde  : string ISO  (2024-01-01)
   *  - fechaHasta  : string ISO  (2024-12-31)
   *  - choferId    : UUID
   *  - mes         : string      (2024-03)
   *  - cliente     : string
   *  - corredor    : string
   *  - page        : number (default 1)
   *  - limit       : number (default 50, máx 500)
   */
  @Get()
  findAll(
    @Query() query: ReporteChoferesQueryDto,
  ): Promise<ReporteChoferesResponseDto> {
    return this.reporteChoferesService.findAll(query);
  }
}
