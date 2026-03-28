import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateDispatchOrderDto,
  UpdateDispatchOrderDto,
} from './dto/dispatch-order.dto';

@Injectable()
export class DispatchOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDispatchOrderDto) {
    return this.prisma.dispatch_orders.create({
      data: {
        ...dto,
        status: dto.status ?? 'pending', // 👈 default controlado
      },
    });
  }

  async findAll(companyId?: string) {
    const where = companyId ? { company_id: companyId } : {};
    return this.prisma.dispatch_orders.findMany({
      where,
      include: {
        customers: true,
        origin_location: true,
        destination_location: true,
        trips: true,
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.dispatch_orders.findUnique({
      where: { id },
      include: {
        customers: true,
        origin_location: true,
        destination_location: true,
        trips: true,
      },
    });
    if (!order) throw new NotFoundException('Dispatch order not found');
    return order;
  }

  async update(id: string, dto: UpdateDispatchOrderDto) {
    return this.prisma.dispatch_orders.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.dispatch_orders.delete({
      where: { id },
    });
  }
}
