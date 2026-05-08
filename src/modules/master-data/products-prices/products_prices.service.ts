// product-price.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductPriceDto } from './dto/create-product-price.dto';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';

// ─── Tipos exportados ─────────────────────────────────────────────────────────

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
  unit_price: number;
  /** quantity * unit_price */
  price: number;
  /** price * (exemptionRate / 100) */
  exempt_amount: number;
  /** price - exempt_amount */
  taxable_base: number;
  taxes: ResolvedItemTax[];
}

@Injectable()
export class ProductPriceService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  async create(dto: CreateProductPriceDto) {
    const product = await this.prisma.products.findUnique({
      where: { id: dto.product_id },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (!product.price_enabled) {
      throw new BadRequestException(
        'El producto no tiene habilitada la gestión de precios',
      );
    }

    return this.prisma.product_price.create({
      data: {
        product_id: dto.product_id,
        price: dto.price,
        exemptionRate: dto.exemptionRate ?? 0,
      },
    });
  }

  // ─────────────────────────────────────────────
  // FIND ALL (por producto)
  // ─────────────────────────────────────────────
  async findByProduct(productId: string) {
    if (!productId || productId === 'undefined') {
      throw new BadRequestException('ID de producto inválido');
    }

    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return this.prisma.product_price.findMany({
      where: { product_id: productId, deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
  }

  // ─────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────
  async findOne(id: string) {
    if (!id || id === 'undefined') {
      throw new BadRequestException('ID inválido');
    }

    const price = await this.prisma.product_price.findFirst({
      where: { id, deleted_at: null },
      include: {
        products: {
          select: { id: true, name: true, sku: true, price_enabled: true },
        },
      },
    });

    if (!price) throw new NotFoundException('Precio no encontrado');

    return price;
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  async update(id: string, dto: UpdateProductPriceDto) {
    await this.findOne(id);

    return this.prisma.product_price.update({
      where: { id },
      data: {
        price: dto.price,
        exemptionRate: dto.exemptionRate,
        updated_by: dto.updated_by ?? null,
      },
    });
  }

  // ─────────────────────────────────────────────
  // SOFT DELETE
  // ─────────────────────────────────────────────
  async remove(id: string, deletedBy?: string) {
    await this.findOne(id);

    return this.prisma.product_price.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: deletedBy ?? null },
    });
  }

  // ─────────────────────────────────────────────
  // RESOLVE PRICE (uso interno simple)
  // ─────────────────────────────────────────────
  async resolvePrice(productId: string): Promise<{
    price: number;
    exemptionRate: number;
  } | null> {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product || product.is_rate_type) return null;

    if (product.price_enabled) {
      const latestPrice = await this.prisma.product_price.findFirst({
        where: { product_id: productId, deleted_at: null },
        orderBy: { created_at: 'desc' },
      });

      if (!latestPrice) return null;

      return {
        price: Number(latestPrice.price),
        exemptionRate: Number(latestPrice.exemptionRate),
      };
    }

    return null;
  }

  // ─────────────────────────────────────────────
  // RESOLVE ITEM WITH TAXES
  //
  // Flujo:
  //   1. Carga el producto con sus product_taxes activos → taxes
  //   2. Resuelve unit_price y exemptionRate desde product_price
  //      (o usa el override si lo manda el frontend)
  //   3. Calcula:
  //        price        = unit_price * quantity
  //        exempt       = price * (exemptionRate / 100)
  //        taxable_base = price - exempt
  //   4. Para cada tax activo del producto:
  //        - Si calculation_level = 'line'     → tax_amount = taxable_base * (rate/100)
  //        - Si calculation_level = 'document' → tax_amount = 0 (se calcula sobre
  //          el subtotal total en DocumentsSalesService.calculateTotals)
  //   5. Si is_included_in_price = true el impuesto ya está dentro del precio,
  //      se informa pero no se suma al total nuevamente.
  // ─────────────────────────────────────────────
  async resolveItemWithTaxes(
    productId: string,
    quantity: number,
    overrideUnitPrice?: number,
  ): Promise<ResolvedItem | null> {
    // 1. Producto + taxes via product_taxes (tabla intermedia)
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        product_taxes: {
          where: { active: true, deleted_at: null },
          include: {
            taxes: true, // product_taxes.tax_id → taxes
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    console.log(product.product_taxes);

    // 2. Resolver unit_price y exemptionRate
    let unitPrice = overrideUnitPrice ?? 0;
    let exemptionRate = 0;

    if (overrideUnitPrice === undefined) {
      // Tarifas logísticas: el precio debe venir siempre como override
      if (product.is_rate_type) return null;

      if (product.price_enabled) {
        const latestPrice = await this.prisma.product_price.findFirst({
          where: { product_id: productId, deleted_at: null },
          orderBy: { created_at: 'desc' },
        });

        if (!latestPrice) return null;

        unitPrice = Number(latestPrice.price);
        exemptionRate = Number(latestPrice.exemptionRate);
      }
    }

    // 3. Calcular importes base
    const price = round2(unitPrice * quantity);
    const exemptAmount = round2(price * (exemptionRate / 100));
    const taxableBase = round2(price - exemptAmount);

    // 4. Calcular impuestos por ítem
    const taxes: ResolvedItemTax[] = product.product_taxes.map((pt) => {
      const tax = pt.taxes;
      const taxRate = Number(tax.rate);
      const calculationLevel = tax.calculation_level; // 'line' | 'document'
      const isIncluded = pt.is_included_in_price;

      // Incluido en precio o nivel documento → no se calcula monto acá
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

    return {
      product_id: productId,
      quantity,
      unit_price: unitPrice,
      price,
      exempt_amount: exemptAmount,
      taxable_base: taxableBase,
      taxes,
    };
  }
}

// ─── Utilidad ─────────────────────────────────────────────────────────────────
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
