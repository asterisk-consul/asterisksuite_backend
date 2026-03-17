import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePalletDto } from './dto/create-pallet.dto';
import { UpdatePalletDto } from './dto/update-pallet.dto';
@Injectable()
export class PalletsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePalletDto) {
    return this.prisma.pallets.create({
      data: dto,
    });
  }

  async findAll(companyId: string) {
    return this.prisma.pallets.findMany({
      where: {
        company_id: companyId,
        deleted_at: null,
      },
      include: {
        pallet_items: {
          include: { products: true },
        },
        warehouses: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const pallet = await this.prisma.pallets.findUnique({
      where: { id },
      include: {
        pallet_items: {
          include: { products: true },
        },
        warehouses: true,
      },
    });

    if (!pallet || pallet.deleted_at) {
      throw new NotFoundException('Pallet no encontrado');
    }

    return pallet;
  }

  async update(id: string, dto: UpdatePalletDto) {
    await this.findOne(id);

    return this.prisma.pallets.update({
      where: { id },
      data: dto,
    });
  }

  async softDelete(id: string) {
    await this.findOne(id);

    return this.prisma.pallets.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
