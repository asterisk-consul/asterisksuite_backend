import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePriceListDto, UpdatePriceListDto } from './dto/price-list.dto';

@Injectable()
export class PriceListsService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findAll(type?: string) {
    const where: any = { deleted_at: null };
    if (type) where.type = type;

    return this.prisma.price_lists.findMany({
      where,
      include: {
        currencies: { select: { id: true, code: true, symbol: true } },
        _count: { select: { product_list_prices: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const list = await this.prisma.price_lists.findUnique({
      where: { id },
      include: {
        currencies: { select: { id: true, code: true, symbol: true } },
        product_list_prices: {
          where: { deleted_at: null },
          include: {
            products: { select: { id: true, name: true, sku: true } },
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!list) throw new NotFoundException('Lista de precios no encontrada');
    return list;
  }

  async create(dto: CreatePriceListDto) {
    return this.prisma.price_lists.create({
      data: {
        name: dto.name,
        type: dto.type,
        currency_id: dto.currency_id,
        description: dto.description,
        active: dto.active ?? true,
      },
      include: {
        currencies: { select: { id: true, code: true, symbol: true } },
      },
    });
  }

  async update(id: string, dto: UpdatePriceListDto) {
    await this.findOne(id);
    return this.prisma.price_lists.update({
      where: { id },
      data: dto,
      include: {
        currencies: { select: { id: true, code: true, symbol: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.price_lists.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
