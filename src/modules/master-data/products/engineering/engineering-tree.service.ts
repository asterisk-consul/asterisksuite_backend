import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EngineeringTreeService {
  constructor(private readonly prisma: PrismaService) {}

  async buildTree(productId: string, level = 0) {
    const components = await this.prisma.product_components.findMany({
      where: {
        parent_product_id: productId,
        deleted_at: null,
      },
      include: {
        child_product: true,
        child_variant: true,
        units: true,
      },
    });

    return Promise.all(
      components.map(async (component) => ({
        ...component,
        level,
        children: await this.buildTree(component.child_product_id, level + 1),
      })),
    );
  }
}
