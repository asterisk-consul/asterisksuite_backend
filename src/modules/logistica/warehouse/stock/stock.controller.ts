import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('warehouse/stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly service: StockService) {}

  @RequirePermissions('stock.read')
  @Get('product/:productId')
  getStockByProduct(@Param('productId') productId: string) {
    return this.service.getStockByProduct(productId);
  }

  @RequirePermissions('stock.read')
  @Get(':warehouseId')
  getStock(@Param('warehouseId') warehouseId: string) {
    return this.service.getStockByWarehouse(warehouseId);
  }

  @RequirePermissions('stock.movements')
  @Get(':warehouseId/movements')
  getMovements(@Param('warehouseId') warehouseId: string) {
    return this.service.getMovements(warehouseId);
  }

  @RequirePermissions('stock.create')
  @Post('movement')
  createMovement(@Body() dto: CreateStockMovementDto) {
    return this.service.createMovement(dto);
  }

  @RequirePermissions('stock.transfer')
  @Post('transfer')
  transferStock(@Body() dto: TransferStockDto) {
    return this.service.transferStock(dto);
  }

  @RequirePermissions('stock.delete')
  @Delete(':warehouseId/:productId')
  removeStock(
    @Param('warehouseId') warehouseId: string,
    @Param('productId') productId: string,
  ) {
    return this.service.removeStock(warehouseId, productId);
  }
}
