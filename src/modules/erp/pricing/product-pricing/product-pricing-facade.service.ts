import { Injectable } from '@nestjs/common';

import { ProductsService } from '../../../master-data/products/products.service';
import { PricingEngineService } from '../pricing-engine.service';
import { ExchangeService } from '../exchange/exchange.service';

@Injectable()
export class ProductPricingFacadeService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly pricingEngine: PricingEngineService,
    private readonly exchangeService: ExchangeService,
  ) {}

  // ─────────────────────────────────────────────
  // PRECIO UNITARIO SIMPLE (UI / LISTADOS)
  // ─────────────────────────────────────────────
  async getUnitPrice(productId: string, currency: string) {
    const product = await this.productsService.findOne(productId);

    if (!product.price_enabled && !product.is_rate_type) {
      return null;
    }

    const resolved = await this.pricingEngine.resolveProductPrice(
      productId,
      currency,
    );

    return {
      product_id: productId,
      currency,
      unit_price: resolved.converted_price,
      original_currency: resolved.original_currency,
      exchange_rate: resolved.exchange_rate,
    };
  }

  // ─────────────────────────────────────────────
  // PRECIO COMPLETO CON IMPUESTOS
  // ─────────────────────────────────────────────
  async getSellPrice(
    productId: string,
    quantity: number,
    currency: string,
    overrideUnitPrice?: number,
  ) {
    return this.pricingEngine.resolveItemWithTaxes(
      productId,
      quantity,
      currency,
      overrideUnitPrice,
    );
  }

  // ─────────────────────────────────────────────
  // CHECKOUT / DOCUMENTO COMPLETO
  // ─────────────────────────────────────────────
  async calculateCart(
    items: {
      productId: string;
      quantity: number;
    }[],
    currency: string,
  ) {
    const resolvedItems = await Promise.all(
      items.map((item) =>
        this.pricingEngine.resolveItemWithTaxes(
          item.productId,
          item.quantity,
          currency,
        ),
      ),
    );

    const total = resolvedItems.reduce((acc, item) => acc + item.total, 0);

    const totalTaxes = resolvedItems.reduce(
      (acc, item) => acc + item.total_taxes,
      0,
    );

    const subtotal = resolvedItems.reduce(
      (acc, item) => acc + item.taxable_base,
      0,
    );

    return {
      currency,
      items: resolvedItems,
      subtotal,
      total_taxes: totalTaxes,
      total,
    };
  }

  // ─────────────────────────────────────────────
  // CONVERSIÓN SIMPLE (helper externo)
  // ─────────────────────────────────────────────
  async convert(amount: number, from: string, to: string) {
    return this.exchangeService.convertAmount(amount, from, to);
  }
}
