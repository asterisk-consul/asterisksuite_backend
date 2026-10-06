import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequireAnyPermission, RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('warehouse/stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly service: StockService) {}

  @RequireAnyPermission('stock.read', 'sales.read', 'sales.orders.read', 'sales.quotes.read', 'sales.invoices.read')
  @Get('reports/availability')
  getCommercialAvailability(
    @Query('search') search?: string,
    @Query('days') days?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getCommercialAvailability({
      search,
      days: Number(days),
      page: Number(page),
      limit: Number(limit),
    });
  }

  @RequireAnyPermission('production.read', 'production.execute', 'stock.read')
  @Post('production/preview')
  previewProduction(@Body() body: { product_id: string; warehouse_id?: string; material_warehouse_id?: string; output_warehouse_id?: string; quantity: number }) {
    const materialWarehouseId = body.material_warehouse_id ?? body.warehouse_id!;
    const outputWarehouseId = body.output_warehouse_id ?? body.warehouse_id ?? materialWarehouseId;
    return this.service.previewProduction(body.product_id, materialWarehouseId, outputWarehouseId, Number(body.quantity));
  }

  @RequireAnyPermission('production.execute', 'stock.create')
  @Post('production/execute')
  executeProduction(@Body() body: { product_id: string; warehouse_id?: string; material_warehouse_id?: string; output_warehouse_id?: string; quantity: number }) {
    const materialWarehouseId = body.material_warehouse_id ?? body.warehouse_id!;
    const outputWarehouseId = body.output_warehouse_id ?? body.warehouse_id ?? materialWarehouseId;
    return this.service.executeProduction(body.product_id, materialWarehouseId, outputWarehouseId, Number(body.quantity));
  }

  @RequireAnyPermission('production.history', 'stock.movements')
  @Get('production/history')
  getProductionHistory(@Query('limit') limit?: string) {
    return this.service.getProductionHistory(Number(limit));
  }

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
