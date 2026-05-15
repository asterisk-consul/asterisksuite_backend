import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductPriceDto } from './dto/create-product-price.dto';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';

import { ExchangeService } from '../exchange/exchange.service';

@Injectable()
export class ProductPriceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exchangeService: ExchangeService,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  async create(dto: CreateProductPriceDto) {
    const product = await this.prisma.products.findUnique({
      where: {
        id: dto.product_id,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const currency = await this.prisma.currencies.findUnique({
      where: {
        id: dto.currency_id,
      },
    });

    if (!currency) {
      throw new NotFoundException('Moneda no encontrada');
    }

    const existing = await this.prisma.product_price.findFirst({
      where: {
        product_id: dto.product_id,
        currency_id: dto.currency_id,
        deleted_at: null,
      },
    });

    if (existing) {
      throw new BadRequestException('Ya existe un precio para esta moneda');
    }

    return this.prisma.product_price.create({
      data: {
        product_id: dto.product_id,
        currency_id: dto.currency_id,
        price: dto.price,
        exemption_rate: dto.exemption_rate ?? 0,
      },
      include: {
        currencies: true,
      },
    });
  }

  // =========================================================
  // FIND BY PRODUCT
  // =========================================================

  async findByProduct(productId: string) {
    return this.prisma.product_price.findMany({
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
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  async findOne(id: string) {
    const price = await this.prisma.product_price.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        currencies: true,
        products: true,
      },
    });

    if (!price) {
      throw new NotFoundException('Precio no encontrado');
    }

    return price;
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(id: string, dto: UpdateProductPriceDto) {
    await this.findOne(id);

    return this.prisma.product_price.update({
      where: {
        id,
      },
      data: {
        price: dto.price,
        exemption_rate: dto.exemption_rate,
        updated_by: dto.updated_by,
      },
    });
  }

  // =========================================================
  // DELETE
  // =========================================================

  async remove(id: string, deletedBy?: string) {
    await this.findOne(id);

    return this.prisma.product_price.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
        deleted_by: deletedBy ?? null,
      },
    });
  }

  // =========================================================
  // RESOLVE PRICE
  // =========================================================

  async resolvePrice(productId: string, currencyCode: string) {
    const currency = await this.prisma.currencies.findFirst({
      where: {
        code: currencyCode,
      },
    });

    if (!currency) {
      throw new NotFoundException('Moneda no encontrada');
    }

    const directPrice = await this.prisma.product_price.findFirst({
      where: {
        product_id: productId,
        currency_id: currency.id,
        deleted_at: null,
      },
      include: {
        currencies: true,
      },
    });

    // Existe precio directo
    if (directPrice) {
      return {
        currency_code: currency.code,
        price: Number(directPrice.price),
        exemption_rate: Number(directPrice.exemption_rate),
      };
    }

    // Buscar cualquier precio base
    const basePrice = await this.prisma.product_price.findFirst({
      where: {
        product_id: productId,
        deleted_at: null,
      },
      include: {
        currencies: true,
      },
    });

    if (!basePrice) {
      return null;
    }

    // Convertir
    const converted = await this.exchangeService.convertAmount(
      Number(basePrice.price),
      basePrice.currencies.code,
      currencyCode,
    );

    return {
      currency_code: currencyCode,
      price: converted.converted_amount,
      exemption_rate: Number(basePrice.exemption_rate),
    };
  }

  // =========================================================
  // RESOLVE ITEM WITH TAXES
  // =========================================================

  async resolveItemWithTaxes(
    productId: string,
    quantity: number,
    currencyCode: string,
    overrideUnitPrice?: number,
  ) {
    const product = await this.prisma.products.findUnique({
      where: {
        id: productId,
      },
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
      return null;
    }

    let unitPrice = overrideUnitPrice ?? 0;

    let exemptionRate = 0;

    if (overrideUnitPrice === undefined) {
      const resolvedPrice = await this.resolvePrice(productId, currencyCode);

      if (!resolvedPrice) {
        return null;
      }

      unitPrice = resolvedPrice.price;

      exemptionRate = resolvedPrice.exemption_rate;
    }

    const price = round2(unitPrice * quantity);

    const exemptAmount = round2(price * (exemptionRate / 100));

    const taxableBase = round2(price - exemptAmount);

    const taxes = product.product_taxes.map((pt) => {
      const tax = pt.taxes;

      const taxRate = Number(tax.rate);

      let taxAmount = 0;

      if (
        !pt.is_included_in_price &&
        taxableBase > 0 &&
        tax.calculation_level === 'line'
      ) {
        taxAmount = round2(taxableBase * (taxRate / 100));
      }

      return {
        tax_id: tax.id,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        calculation_level: tax.calculation_level,
        is_included_in_price: pt.is_included_in_price,
      };
    });

    return {
      product_id: productId,

      currency_code: currencyCode,

      quantity,

      unit_price: unitPrice,

      price,

      exempt_amount: exemptAmount,

      taxable_base: taxableBase,

      taxes,
    };
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
