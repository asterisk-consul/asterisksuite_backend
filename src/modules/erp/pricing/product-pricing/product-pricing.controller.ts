import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { ProductPricingFacadeService } from './product-pricing-facade.service';

@Controller('pricing')
export class ProductPricingController {
  constructor(private readonly pricingFacade: ProductPricingFacadeService) {}

  // ─────────────────────────────────────────────
  // PRECIO UNITARIO (LISTADOS / UI)
  // GET /pricing/unit/:productId?currency=ARS
  // ─────────────────────────────────────────────
  @Get('unit/:productId')
  async getUnitPrice(
    @Param('productId') productId: string,
    @Query('currency') currency: string,
  ) {
    return this.pricingFacade.getUnitPrice(productId, currency);
  }

  // ─────────────────────────────────────────────
  // PRECIO DE VENTA (CON IMPUESTOS)
  // GET /pricing/sell/:productId?qty=2&currency=USD
  // ─────────────────────────────────────────────
  @Get('sell/:productId')
  async getSellPrice(
    @Param('productId') productId: string,

    @Query('qty') qty: string,

    @Query('currency') currency: string,

    @Query('unitPrice') unitPrice?: string,
  ) {
    console.log('UNIT PRICE =>', unitPrice);

    return this.pricingFacade.getSellPrice(
      productId,
      Number(qty ?? 1),
      currency,
      unitPrice ? Number(unitPrice) : undefined,
    );
  }

  // ─────────────────────────────────────────────
  // CALCULAR CARRITO / DOCUMENTO
  // POST /pricing/cart
  // ─────────────────────────────────────────────
  @Post('cart')
  async calculateCart(
    @Body()
    body: {
      currency: string;
      items: {
        productId: string;
        quantity: number;
      }[];
    },
  ) {
    return this.pricingFacade.calculateCart(body.items, body.currency);
  }

  // ─────────────────────────────────────────────
  // CONVERSIÓN SIMPLE (debug / admin)
  // GET /pricing/convert?amount=100&from=USD&to=ARS
  // ─────────────────────────────────────────────
  @Get('convert')
  async convert(
    @Query('amount') amount: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.pricingFacade.convert(Number(amount), from, to);
  }
}
