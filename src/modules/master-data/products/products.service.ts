import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    return this.prisma.products.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.products.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        product_price: {
          where: { deleted_at: null },
          include: { currencies: true },
        },
        product_variants: {
          include: {
            product_attribute_values: { include: { attributes: true } },
          },
        },
        product_categories: {
          include: { categories: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.products.findUnique({
      where: { id, deleted_at: null },
      include: {
        product_price: {
          where: { deleted_at: null },
          include: { currencies: true },
        },
        product_variants: {
          include: {
            product_attribute_values: { include: { attributes: true } },
          },
        },
        product_categories: {
          include: { categories: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.products.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.products.delete({
      where: { id },
    });
  }
}
