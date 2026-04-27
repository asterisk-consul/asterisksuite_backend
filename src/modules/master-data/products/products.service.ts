import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    const { price, exemptionRate, ...productData } = data;

    const product = await this.prisma.products.create({
      data: productData,
    });
    // tarifa
    if (data.is_rate_type && data.rate_id) {
      // Tipo tarifa: precio referencial desde el último dispatch_rate válido
      await this.upsertPriceFromRate(product.id, data.rate_id);
    } else if (data.price_enabled && price !== undefined) {
      // Precio manual
      await this.upsertProductPrice(
        product.id,
        price,
        data.taxId ?? null,
        exemptionRate ?? 0,
      );
    }

    return product;
  }

  async findAll() {
    return this.prisma.products.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        product_taxes: { include: { taxes: true } },
        product_price: true,
        transfer_rate: true, // ← tarifa asociada
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        product_taxes: { include: { taxes: true } },
        product_price: true,
        transfer_rate: true, // ← tarifa asociada
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    await this.findOne(id);

    const { price, exemptionRate, ...productData } = data;

    const product = await this.prisma.products.update({
      where: { id },
      data: productData,
    });

    if (data.is_rate_type && data.rate_id) {
      // Cambió a tipo tarifa o cambió la tarifa asociada
      await this.upsertPriceFromRate(id, data.rate_id);
    } else if (!data.is_rate_type) {
      // Volvió a precio manual
      if (data.price_enabled && price !== undefined) {
        await this.upsertProductPrice(
          id,
          price,
          data.taxId ?? null,
          exemptionRate ?? 0,
        );
      }
      if (data.price_enabled === false) {
        await this.prisma.product_price.deleteMany({
          where: { product_id: id },
        });
      }
    }

    return product;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.products.delete({ where: { id } });
  }

  async updatePrice(
    productId: string,
    basePrice: number,
    exemptionRate: number,
    taxId: string | null,
  ) {
    await this.findOne(productId);
    await this.upsertProductPrice(productId, basePrice, taxId, exemptionRate);
    return this.findOne(productId);
  }

  // ─── Privado ──────────────────────────────────────────────────────────────

  /**
   * Toma el último valor de dispatch_rates para esta tarifa
   * donde la orden está COMPLETED y el viaje asociado también COMPLETED.
   * Si no hay historial válido, guarda 0 como precio referencial.
   */
  private async upsertPriceFromRate(productId: string, rateId: string) {
    const rate = await this.prisma.transfer_rates.findUnique({
      where: { id: rateId },
    });
    if (!rate) throw new NotFoundException(`Tarifa ${rateId} no encontrada`);

    const lastDispatchRate = await this.prisma.dispatch_rates.findFirst({
      where: {
        rate_id: rateId,
        dispatch_orders: {
          status: 'COMPLETED',
          tripStopOrders: {
            some: {
              trip_stop: {
                trip: { status: 'COMPLETED' },
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const referentialPrice = lastDispatchRate
      ? Number(lastDispatchRate.value)
      : 0;

    const existing = await this.prisma.product_price.findFirst({
      where: { product_id: productId },
    });

    if (existing) {
      await this.prisma.product_price.update({
        where: { id: existing.id },
        data: {
          price: referentialPrice,
          exemptionRate: 0,
          updated_at: new Date(),
        },
      });
    } else {
      await this.prisma.product_price.create({
        data: {
          product_id: productId,
          price: referentialPrice,
          exemptionRate: 0,
        },
      });
    }
  }

  private async upsertProductPrice(
    productId: string,
    basePrice: number,
    taxId: string | null,
    exemptionRate: number = 0,
  ) {
    let finalPrice = basePrice;

    if (taxId) {
      const tax = await this.prisma.taxes.findUnique({ where: { id: taxId } });

      if (tax) {
        const existingTax = await this.prisma.product_taxes.findFirst({
          where: { product_id: productId, tax_id: taxId },
        });

        if (!existingTax) {
          await this.prisma.product_taxes.create({
            data: {
              product_id: productId,
              tax_id: taxId,
              is_included_in_price: true,
              active: true,
            },
          });
        } else {
          await this.prisma.product_taxes.update({
            where: { id: existingTax.id },
            data: { active: true },
          });
        }

        const rate = Number(tax.rate);
        if (tax.is_percentage) {
          const taxableBase = basePrice * (1 - exemptionRate / 100);
          finalPrice = basePrice + taxableBase * (rate / 100);
        } else {
          finalPrice = basePrice + rate;
        }
      }
    }

    const existing = await this.prisma.product_price.findFirst({
      where: { product_id: productId },
    });

    if (existing) {
      await this.prisma.product_price.update({
        where: { id: existing.id },
        data: { price: finalPrice, exemptionRate, updated_at: new Date() },
      });
    } else {
      await this.prisma.product_price.create({
        data: { product_id: productId, price: finalPrice, exemptionRate },
      });
    }
  }
}
