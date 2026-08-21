import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateVariantPriceDto } from './dto/create-variant-price.dto';

@Injectable()
export class VariantPricesService {
  constructor(private readonly db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateVariantPriceDto) {
    const variant = await this.prisma.product_variants.findUnique({
      where: { id: dto.variant_id },
    });
    if (!variant) throw new NotFoundException('Variante no encontrada');

    const currency = await this.prisma.currencies.findUnique({
      where: { id: dto.currency_id },
    });
    if (!currency) throw new NotFoundException('Moneda no encontrada');

    return this.prisma.product_variant_prices.create({
      data: {
        variant_id: dto.variant_id,
        currency_id: dto.currency_id,
        price: dto.price,
        price_list: dto.price_list,
        margin: dto.margin,
        active: dto.active ?? true,
      },
      include: { currency: true, product_variant: true },
    });
  }

  async findByVariant(variantId: string) {
    return this.prisma.product_variant_prices.findMany({
      where: { variant_id: variantId, deleted_at: null },
      include: { currency: true, product_variant: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByProduct(productId: string) {
    return this.prisma.product_variant_prices.findMany({
      where: {
        deleted_at: null,
        product_variant: { product_id: productId },
      },
      include: { currency: true, product_variant: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const price = await this.prisma.product_variant_prices.findFirst({
      where: { id, deleted_at: null },
      include: { currency: true, product_variant: true },
    });
    if (!price) throw new NotFoundException('Precio de variante no encontrado');
    return price;
  }

  async update(id: string, data: Partial<CreateVariantPriceDto>) {
    await this.findOne(id);

    return this.prisma.product_variant_prices.update({
      where: { id },
      data: {
        ...(data.price !== undefined && { price: data.price }),
        ...(data.price_list !== undefined && { price_list: data.price_list }),
        ...(data.margin !== undefined && { margin: data.margin }),
        ...(data.active !== undefined && { active: data.active }),
      },
      include: { currency: true, product_variant: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product_variant_prices.update({
      where: { id },
      data: { deleted_at: new Date(), active: false },
    });
  }
}
