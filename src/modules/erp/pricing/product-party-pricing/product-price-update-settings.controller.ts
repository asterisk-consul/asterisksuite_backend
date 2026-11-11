import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { ProductPartyPricingService } from './product-party-pricing.service';
import { UpdatePriceUpdateSettingsDto } from './dto/update-price-update-settings.dto';

@Controller('pricing/price-update-settings')
@UseGuards(JwtAuthGuard)
export class ProductPriceUpdateSettingsController {
  constructor(private readonly service: ProductPartyPricingService) {}

  @Get()
  @RequirePermissions('product-prices.read')
  getSettings() {
    return this.service.getPriceUpdateSettings();
  }

  @Patch()
  @RequirePermissions('product-prices.update')
  updateSettings(@Body() dto: UpdatePriceUpdateSettingsDto, @CurrentUser() user: AuthUser) {
    return this.service.updatePriceUpdateSettings(dto, user.id);
  }
}
