import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductSupplierDto, UpdateProductSupplierDto } from './dto/product-supplier.dto';

@Injectable()
export class ProductSuppliersService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findAll(productId?: string) {
    const where: any = { deleted_at: null };
    if (productId) where.product_id = productId;

    return this.prisma.product_suppliers.findMany({
      where,
      include: {
        products: { select: { id: true, name: true, sku: true } },
        business_parties: { select: { id: true, name: true, tax_id: true } },
        currencies: { select: { id: true, code: true, symbol: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const supplier = await this.prisma.product_suppliers.findUnique({
      where: { id },
      include: {
        products: { select: { id: true, name: true, sku: true } },
        business_parties: { select: { id: true, name: true, tax_id: true } },
        currencies: { select: { id: true, code: true, symbol: true } },
      },
    });

    if (!supplier) throw new NotFoundException('Proveedor de producto no encontrado');
    return supplier;
  }

  async create(dto: CreateProductSupplierDto) {
    // Verificar que no exista la relación
    const existing = await this.prisma.product_suppliers.findUnique({
      where: {
        product_id_supplier_id: {
          product_id: dto.product_id,
          supplier_id: dto.supplier_id,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Este proveedor ya está asociado a este producto');
    }

    // Si es primary, desactivar otros primaries
    if (dto.is_primary) {
      await this.prisma.product_suppliers.updateMany({
        where: { product_id: dto.product_id, is_primary: true, deleted_at: null },
        data: { is_primary: false },
      });
    }

    return this.prisma.product_suppliers.create({
      data: {
        product_id: dto.product_id,
        supplier_id: dto.supplier_id,
        purchase_price: dto.purchase_price,
        currency_id: dto.currency_id,
        lead_time_days: dto.lead_time_days,
        min_order_quantity: dto.min_order_quantity,
        is_primary: dto.is_primary ?? false,
        active: dto.active ?? true,
      },
      include: {
        products: { select: { id: true, name: true, sku: true } },
        business_parties: { select: { id: true, name: true, tax_id: true } },
        currencies: { select: { id: true, code: true, symbol: true } },
      },
    });
  }

  async update(id: string, dto: UpdateProductSupplierDto) {
    await this.findOne(id);

    // Si es primary, desactivar otros primaries
    if (dto.is_primary) {
      const current = await this.prisma.product_suppliers.findUnique({ where: { id } });
      if (current) {
        await this.prisma.product_suppliers.updateMany({
          where: {
            product_id: current.product_id,
            is_primary: true,
            id: { not: id },
            deleted_at: null,
          },
          data: { is_primary: false },
        });
      }
    }

    return this.prisma.product_suppliers.update({
      where: { id },
      data: dto,
      include: {
        products: { select: { id: true, name: true, sku: true } },
        business_parties: { select: { id: true, name: true, tax_id: true } },
        currencies: { select: { id: true, code: true, symbol: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product_suppliers.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
