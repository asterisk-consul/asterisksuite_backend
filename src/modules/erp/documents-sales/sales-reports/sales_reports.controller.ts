// src/modules/erp/purchases/purchases.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { SalesService } from './sales_reports.service';
import {
  GlobalSalesSummaryResponseDto,
  ProductSalesDetailResponseDto,
  SalesMovementResponseDto,
  AvailableProductSalesResponseDto,
} from './dto';
import { QuerySalesDto } from './dto/query-sales.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { GlobalSalesDocumentsResponseDto } from './dto/global-sales-documents';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('sales-reports')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @RequirePermissions('sales-reports.read')
  @Get('summary')
  getSalesSummary(
    @Query() query: QuerySalesDto,
  ): Promise<GlobalSalesSummaryResponseDto> {
    return this.salesService.getSalesSummary(query);
  }

  @RequirePermissions('sales-reports.read')
  @Get('products/:id')
  getProductPurchaseDetail(
    @Param('id') id: string,
    @Query() query: QuerySalesDto,
  ): Promise<ProductSalesDetailResponseDto> {
    return this.salesService.getProductSalesDetail(id, query);
  }

  @RequirePermissions('sales-reports.read')
  @Get('movements')
  getSalesMovements(
    @Query() query: QuerySalesDto,
  ): Promise<SalesMovementResponseDto[]> {
    return this.salesService.getSalesMovements(query);
  }

  @RequirePermissions('sales-reports.read')
  @Get('sales-documents')
  getPurchaseDocuments(
    @Query() query: QuerySalesDto,
  ): Promise<GlobalSalesDocumentsResponseDto> {
    return this.salesService.getSalesDocuments(query);
  }

  @RequirePermissions('sales-reports.read')
  @Get('products')
  getAvailableProducts(): Promise<AvailableProductSalesResponseDto[]> {
    return this.salesService.getAvailableProducts();
  }
}
