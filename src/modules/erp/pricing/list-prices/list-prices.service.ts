import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateListPriceDto, UpdateListPriceDto } from './dto/list-price.dto';

@Injectable()
export class ListPricesService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findAll(priceListId?: string, productId?: string) {
    const where: any = { deleted_at: null };
    if (priceListId) where.price_list_id = priceListId;
    if (productId) where.product_id = productId;

    return this.prisma.product_list_prices.findMany({
      where,
      include: {
        price_lists: { select: { id: true, name: true, type: true, currencies: { select: { code: true, symbol: true } } } },
        products: { select: { id: true, name: true, sku: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.product_list_prices.findUnique({
      where: { id },
      include: {
        price_lists: { select: { id: true, name: true, type: true } },
        products: { select: { id: true, name: true, sku: true } },
      },
    });

    if (!item) throw new NotFoundException('Precio de lista no encontrado');
    return item;
  }

  async create(dto: CreateListPriceDto) {
    // Verificar que no exista
    const existing = await this.prisma.product_list_prices.findUnique({
      where: {
        price_list_id_product_id: {
          price_list_id: dto.price_list_id,
          product_id: dto.product_id,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Este producto ya tiene un precio en esta lista');
    }

    return this.prisma.product_list_prices.create({
      data: {
        price_list_id: dto.price_list_id,
        product_id: dto.product_id,
        price: dto.price,
        margin_percentage: dto.margin_percentage,
        active: dto.active ?? true,
      },
      include: {
        price_lists: { select: { id: true, name: true, type: true, currencies: { select: { code: true, symbol: true } } } },
        products: { select: { id: true, name: true, sku: true } },
      },
    });
  }

  async update(id: string, dto: UpdateListPriceDto) {
    await this.findOne(id);
    return this.prisma.product_list_prices.update({
      where: { id },
      data: dto,
      include: {
        price_lists: { select: { id: true, name: true, type: true, currencies: { select: { code: true, symbol: true } } } },
        products: { select: { id: true, name: true, sku: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product_list_prices.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
