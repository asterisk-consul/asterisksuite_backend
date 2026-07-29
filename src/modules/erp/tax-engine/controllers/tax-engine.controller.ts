import { Body, Controller, Post } from '@nestjs/common'
import { TaxResolutionService } from '../services/tax-resolution.service'
import { TaxCalculationService } from '../services/tax-calculation.service'
import { TaxContextDto } from '../dto/tax-context.dto'

@Controller('tax-engine')
export class TaxEngineController {
  constructor(
    private readonly resolution: TaxResolutionService,
    private readonly calculation: TaxCalculationService,
  ) {}

  @Post('calculate-preview')
  async calculatePreview(@Body() dto: TaxContextDto) {
    const resolution = await this.resolution.resolve(dto)
    const result = this.calculation.calculate(resolution, dto.items)
    return result
  }
}
