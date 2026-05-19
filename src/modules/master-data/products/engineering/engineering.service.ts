import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { EngineeringTreeService } from './engineering-tree.service';
import { EngineeringCalculationService } from './engineering-calculation.service';
import { EngineeringValidationService } from './engineering-validation.service';

import { CreateEngineeringComponentDto } from './dto/create-engineering-component.dto';

@Injectable()
export class EngineeringService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engineeringTreeService: EngineeringTreeService,
    private readonly engineeringCalculationService: EngineeringCalculationService,
    private readonly engineeringValidationService: EngineeringValidationService,
  ) {}

  async createComponent(dto: CreateEngineeringComponentDto) {
    await this.engineeringValidationService.validateNoCircularReference(
      dto.parent_product_id,
      dto.child_product_id,
    );

    return this.prisma.product_components.create({
      data: {
        ...dto,
      },
    });
  }

  async getEngineeringTree(productId: string) {
    return this.engineeringTreeService.buildTree(productId);
  }

  async calculate(productId: string) {
    const product = await this.prisma.products.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const tree = await this.engineeringTreeService.buildTree(productId);

    return this.engineeringCalculationService.calculateTree(tree);
  }
}
