import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Controller('warehouse/stock')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get(':warehouseId')
  getStock(@Param('warehouseId') warehouseId: string) {
    return this.service.getStockByWarehouse(warehouseId);
  }

  @Get(':warehouseId/movements')
  getMovements(@Param('warehouseId') warehouseId: string) {
    return this.service.getMovements(warehouseId);
  }

  @Post('movement')
  createMovement(@Body() dto: CreateStockMovementDto) {
    return this.service.createMovement(dto);
  }
}
