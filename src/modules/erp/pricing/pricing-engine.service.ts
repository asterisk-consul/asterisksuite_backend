// pricing-engine.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { ExchangeService } from '@/modules/erp/pricing/exchange/exchange.service';

export interface ResolvedItemTax {
  tax_id: string;
  tax_rate: number;
  tax_amount: number;
  calculation_level: string;
  is_included_in_price: boolean;
}

export interface ResolvedItem {
  product_id: string;

  quantity: number;

  currency: string;

  original_currency: string;

  original_unit_price: number;

  unit_price: number;

  converted_unit_price: number;

  exchange_rate: number;

  price: number;

  exempt_amount: number;

  taxable_base: number;

  taxes: ResolvedItemTax[];

  total_taxes: number;

  total: number;
}

@Injectable()
export class PricingEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exchangeService: ExchangeService,
  ) {}

  // ─────────────────────────────────────────────
  // RESOLVE PRODUCT PRICE
  // ─────────────────────────────────────────────
  async resolveProductPrice(productId: string, targetCurrencyCode: string) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (!product.price_enabled) {
      throw new BadRequestException('El producto no tiene precios habilitados');
    }

    const productPrice = await this.prisma.product_price.findFirst({
      where: {
        product_id: productId,
        deleted_at: null,
      },
      include: {
        currencies: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!productPrice) {
      throw new NotFoundException('El producto no tiene precios configurados');
    }

    const sourceCurrency = productPrice.currencies.code;

    const originalPrice = Number(productPrice.price);

    let convertedPrice = originalPrice;
    let exchangeRate = 1;
    if (sourceCurrency !== targetCurrencyCode) {
      const conversion = await this.exchangeService.convertAmount(
        originalPrice,
        sourceCurrency,
        targetCurrencyCode,
      );

      exchangeRate = conversion.rate;

      convertedPrice = conversion.converted_amount;
    }
    return {
      product_id: product.id,
      currency: targetCurrencyCode,

      original_currency: sourceCurrency,
      original_price: round2(originalPrice),

      exchange_rate: round6(exchangeRate),

      converted_price: round2(convertedPrice),

      exemption_rate: Number(productPrice.exemption_rate),
    };
  }

  // ─────────────────────────────────────────────
  // RESOLVE ITEM WITH TAXES
  // ─────────────────────────────────────────────
  async resolveItemWithTaxes(
    productId: string,
    quantity: number,
    targetCurrencyCode: string,
    overrideUnitPrice?: number,
  ): Promise<ResolvedItem> {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        product_taxes: {
          where: {
            active: true,
            deleted_at: null,
          },
          include: {
            taxes: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    let unitPrice = overrideUnitPrice ?? 0;

    let originalUnitPrice = overrideUnitPrice ?? 0;

    let originalCurrency = targetCurrencyCode;

    let exemptionRate = 0;

    let currency = targetCurrencyCode;

    let exchangeRate = 1;

    // ─────────────────────────────────────────
    // PRECIO AUTOMÁTICO
    // ─────────────────────────────────────────
    if (overrideUnitPrice === undefined) {
      if (product.is_rate_type) {
        throw new BadRequestException(
          'Productos rate_type requieren overrideUnitPrice',
        );
      }

      const resolved = await this.resolveProductPrice(
        productId,
        targetCurrencyCode,
      );

      unitPrice = resolved.converted_price;

      exemptionRate = resolved.exemption_rate;

      currency = resolved.currency;

      exchangeRate = resolved.exchange_rate;
      originalUnitPrice = resolved.original_price;

      originalCurrency = resolved.original_currency;
    }

    // ─────────────────────────────────────────
    // BASES
    // ─────────────────────────────────────────
    const price = round2(unitPrice * quantity);

    const exemptAmount = round2(price * (exemptionRate / 100));

    const taxableBase = round2(price - exemptAmount);

    // ─────────────────────────────────────────
    // TAXES
    // ─────────────────────────────────────────
    const taxes: ResolvedItemTax[] = product.product_taxes.map((pt) => {
      const tax = pt.taxes;

      const taxRate = Number(tax.rate);

      const calculationLevel = tax.calculation_level;

      const isIncluded = pt.is_included_in_price;

      let taxAmount = 0;

      if (!isIncluded && taxableBase > 0 && calculationLevel === 'line') {
        taxAmount = round2(taxableBase * (taxRate / 100));
      }

      return {
        tax_id: tax.id,

        tax_rate: taxRate,

        tax_amount: taxAmount,

        calculation_level: calculationLevel,

        is_included_in_price: isIncluded,
      };
    });

    const totalTaxes = round2(
      taxes.reduce((acc, tax) => acc + tax.tax_amount, 0),
    );

    const total = round2(taxableBase + totalTaxes);

    return {
      product_id: productId,

      quantity,

      currency,

      unit_price: round2(unitPrice),

      converted_unit_price: round2(unitPrice),

      exchange_rate: round6(exchangeRate),

      price,

      original_unit_price: round2(unitPrice),

      original_currency: currency,

      exempt_amount: exemptAmount,

      taxable_base: taxableBase,

      taxes,

      total_taxes: totalTaxes,

      total,
    };
  }
}

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}
