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
    console.log('[TaxEngine] calculate-preview called')
    console.log('[TaxEngine] dto:', JSON.stringify(dto, null, 2))

    console.log('[TaxEngine] Starting resolution...')
    const resolution = await this.resolution.resolve(dto)

    console.log('[TaxEngine] Starting calculation...')
    const result = this.calculation.calculate(resolution, dto.items)

    console.log('[TaxEngine] Final result:', JSON.stringify(result, null, 2))
    return result
  }
}
