import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateVariantCostDto } from './dto/create-variant-cost.dto';

import { UpdateVariantCostDto } from './dto/update-variant-cost.dto';

@Injectable()
export class VariantCostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVariantCostDto) {
    return this.prisma.product_variant_costs.create({
      data,
      include: {
        currency: true,
        product_variant: true,
      },
    });
  }

  async findAll() {
    return this.prisma.product_variant_costs.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        currency: true,
        product_variant: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const cost = await this.prisma.product_variant_costs.findUnique({
      where: {
        id,
      },
      include: {
        currency: true,
        product_variant: true,
      },
    });

    if (!cost) {
      throw new NotFoundException('Costo de variante no encontrado');
    }

    return cost;
  }

  async update(id: string, data: UpdateVariantCostDto) {
    await this.findOne(id);

    return this.prisma.product_variant_costs.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product_variant_costs.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
