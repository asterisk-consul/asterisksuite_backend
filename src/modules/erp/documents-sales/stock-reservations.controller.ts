import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { StockReservationsService } from './stock-reservations.service';

@Controller('warehouse/stock-reservations')
@UseGuards(JwtAuthGuard)
export class StockReservationsController {
  constructor(private readonly reservations: StockReservationsService) {}

  @Get()
  @RequirePermissions('stock.read')
  list(@Query('warehouse_id') warehouseId?: string) {
    return this.reservations.list(warehouseId);
  }

  @Post()
  @RequirePermissions('stock.create')
  create(
    @Body() body: { warehouse_id: string; product_id: string; quantity: number; reason: string; expires_at?: string; party_id?: string },
    @CurrentUser() user: AuthUser,
  ) {
    return this.reservations.createManual(body, user.id);
  }

  @Patch(':id/release')
  @RequirePermissions('stock.create')
  release(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.reservations.releaseManual(id, user.id);
  }
}
