import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    return this.prisma.products.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.products.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.products.findUnique({
      where: { id },
    });

    if (!product) throw new NotFoundException('Product not found');

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
