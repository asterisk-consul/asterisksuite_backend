import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { SalesCommercialFlowService } from './sales-commercial-flow.service';
import { UpdateSalesFlowSettingsDto } from './sales-flow-settings.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/sales-flow')
export class SalesCommercialFlowController {
  constructor(private readonly service: SalesCommercialFlowService) {}

  @Get('settings')
  @RequirePermissions('document_types.read')
  settings() { return this.service.getSettings(); }

  @Patch('settings')
  @RequirePermissions('document_types.update')
  updateSettings(@Body() dto: UpdateSalesFlowSettingsDto, @CurrentUser() user: AuthUser) {
    return this.service.updateSettings(dto, user.id);
  }

  @Get('delivery-queue')
  @RequirePermissions('sales.delivery_notes.read')
  queue() { return this.service.listDeliveryQueue(); }
}
