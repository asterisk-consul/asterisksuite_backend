import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductAttributeValueDto } from './dto/create-product-attribute-value.dto';
import { UpdateProductAttributeValueDto } from './dto/update-product-attribute-value.dto';

@Injectable()
export class ProductAttributeValuesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductAttributeValueDto) {
    const attribute = await this.prisma.attributes.findUnique({
      where: {
        id: data.attribute_id,
      },
    });

    if (!attribute) {
      throw new NotFoundException('Atributo no encontrado');
    }

    this.validateAttributeValue(attribute.type, data);

    return this.prisma.product_attribute_values.create({
      data,
      include: {
        attributes: true,
        products: true,
        product_variants: true,
      },
    });
  }

  async findAll() {
    return this.prisma.product_attribute_values.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        attributes: true,
        products: true,
        product_variants: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const value = await this.prisma.product_attribute_values.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        attributes: true,
        products: true,
        product_variants: true,
      },
    });

    if (!value) {
      throw new NotFoundException('Valor de atributo no encontrado');
    }

    return value;
  }

  async update(id: string, data: UpdateProductAttributeValueDto) {
    const existing = await this.findOne(id);

    const attributeId = data.attribute_id ?? existing.attribute_id;

    const attribute = await this.prisma.attributes.findUnique({
      where: {
        id: attributeId,
      },
    });

    if (!attribute) {
      throw new NotFoundException('Atributo no encontrado');
    }

    this.validateAttributeValue(attribute.type, data);

    return this.prisma.product_attribute_values.update({
      where: {
        id,
      },
      data,
      include: {
        attributes: true,
        products: true,
        product_variants: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product_attribute_values.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  // ─────────────────────────────

  private validateAttributeValue(
    type: string,
    data: {
      text_value?: string;
      number_value?: number;
      boolean_value?: boolean;
    },
  ) {
    if (type === 'TEXT' && !data.text_value) {
      throw new BadRequestException('Este atributo requiere text_value');
    }

    if (type === 'NUMBER' && data.number_value === undefined) {
      throw new BadRequestException('Este atributo requiere number_value');
    }

    if (type === 'BOOLEAN' && data.boolean_value === undefined) {
      throw new BadRequestException('Este atributo requiere boolean_value');
    }
  }
}
