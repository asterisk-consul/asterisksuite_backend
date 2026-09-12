import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { Prisma } from '@/generated/prisma/client';

import { EngineeringTreeService } from '../engineering/engineering-tree.service';

@Injectable()
export class ProductStructureVersionService {
  constructor(private readonly db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async createVersion(productId: string) {
    const snapshot = await this.buildSnapshot(productId);

    const count = await this.prisma.product_structure_versions.count({
      where: {
        product_id: productId,
      },
    });

    return this.prisma.product_structure_versions.create({
      data: {
        product_id: productId,
        version: count + 1,
        snapshot: snapshot as Prisma.InputJsonValue,
      },
    });
  }

  private async buildSnapshot(productId: string, level = 0): Promise<any[]> {
    const components = await this.prisma.product_components.findMany({
      where: {
        parent_product_id: productId,
        deleted_at: null,
        active: true,
      },
      select: {
        id: true,
        parent_product_id: true,
        child_product_id: true,
        child_variant_id: true,
        quantity: true,
        unit_id: true,
        length_mm: true,
        width_mm: true,
        height_mm: true,
        waste_percentage: true,
        order: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return Promise.all(
      components.map(async (component) => ({
        ...component,
        level,
        children: await this.buildSnapshot(component.child_product_id, level + 1),
      })),
    );
  }

  async getVersions(productId: string) {
    return this.prisma.product_structure_versions.findMany({
      where: {
        product_id: productId,
      },
      orderBy: {
        version: 'desc',
      },
    });
  }

  async getVersion(id: string) {
    return this.prisma.product_structure_versions.findUnique({
      where: { id },
    });
  }
}
