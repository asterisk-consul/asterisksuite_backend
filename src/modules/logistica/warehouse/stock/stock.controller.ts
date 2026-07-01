import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@Controller('warehouse/stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly service: StockService) {}

  // @RequirePermissions('stock.read')
  @Get(':warehouseId')
  getStock(@Param('warehouseId') warehouseId: string) {
    return this.service.getStockByWarehouse(warehouseId);
  }

  // @RequirePermissions('stock.movements')
  @Get(':warehouseId/movements')
  getMovements(@Param('warehouseId') warehouseId: string) {
    return this.service.getMovements(warehouseId);
  }

  // @RequirePermissions('stock.create')
  @Post('movement')
  createMovement(@Body() dto: CreateStockMovementDto) {
    return this.service.createMovement(dto);
  }
}
