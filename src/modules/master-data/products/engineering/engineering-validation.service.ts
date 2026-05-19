import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EngineeringValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async validateNoCircularReference(
    parentProductId: string,
    childProductId: string,
  ) {
    if (parentProductId === childProductId) {
      throw new BadRequestException(
        'Un producto no puede referenciarse a sí mismo',
      );
    }

    const exists = await this.existsPath(childProductId, parentProductId);

    if (exists) {
      throw new BadRequestException('Se detectó una referencia circular');
    }
  }

  private async existsPath(
    currentProductId: string,
    targetProductId: string,
  ): Promise<boolean> {
    const children = await this.prisma.product_components.findMany({
      where: {
        parent_product_id: currentProductId,
        deleted_at: null,
      },
    });

    for (const child of children) {
      if (child.child_product_id === targetProductId) {
        return true;
      }

      const nested = await this.existsPath(
        child.child_product_id,
        targetProductId,
      );

      if (nested) {
        return true;
      }
      // ❌ removed: return false — was cutting the loop short after 1 child
    }

    return false; // ✅ moved here: only reached after all children are checked
  }
}
