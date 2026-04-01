// src/modules/erp/purchases/purchases.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import {
  GlobalPurchaseSummaryResponseDto,
  ProductPurchaseDetailResponseDto,
  PurchaseMovementResponseDto,
  AvailableProductResponseDto,
} from './dto';
import { QueryPurchasesDto } from './dto/query-purchases.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get('summary')
  getPurchaseSummary(
    @Query() query: QueryPurchasesDto,
  ): Promise<GlobalPurchaseSummaryResponseDto> {
    return this.purchasesService.getPurchaseSummary(query);
  }

  @Get('products/:id')
  getProductPurchaseDetail(
    @Param('id') id: string,
    @Query() query: QueryPurchasesDto,
  ): Promise<ProductPurchaseDetailResponseDto> {
    return this.purchasesService.getProductPurchaseDetail(id, query);
  }

  @Get('movements')
  getPurchaseMovements(
    @Query() query: QueryPurchasesDto,
  ): Promise<PurchaseMovementResponseDto[]> {
    return this.purchasesService.getPurchaseMovements(query);
  }

  @Get('products')
  getAvailableProducts(): Promise<AvailableProductResponseDto[]> {
    return this.purchasesService.getAvailableProducts();
  }
}
