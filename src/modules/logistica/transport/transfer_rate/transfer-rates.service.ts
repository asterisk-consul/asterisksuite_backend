import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTransferRateDto } from './dto/create-transfer-rate.dto';
import { UpdateTransferRateDto } from './dto/update-transfer-rate.dto';

@Injectable()
export class TransferRatesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateTransferRateDto) {
    return this.prisma.transfer_rates.create({
      data,
    });
  }

  findAll() {
    return this.prisma.transfer_rates.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const rate = await this.prisma.transfer_rates.findUnique({
      where: { id },
    });

    if (!rate) throw new NotFoundException('Rate not found');

    return rate;
  }

  async update(id: string, data: UpdateTransferRateDto) {
    await this.findOne(id);

    return this.prisma.transfer_rates.update({
      where: { id },
      data,
    });
  }

  async deactivate(id: string) {
    return this.prisma.transfer_rates.update({
      where: { id },
      data: { active: false },
    });
  }

  async active(id: string) {
    return this.prisma.transfer_rates.update({
      where: { id },
      data: { active: true },
    });
  }
}
