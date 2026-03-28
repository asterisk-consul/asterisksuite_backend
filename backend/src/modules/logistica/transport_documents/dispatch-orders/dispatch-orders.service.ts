import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateDispatchOrderDto,
  UpdateDispatchOrderDto,
} from './dto/dispatch-order.dto';

@Injectable()
export class DispatchOrdersService {
  constructor(private prisma: PrismaService) {}

  // service
  async create(dto: CreateDispatchOrderDto, userId: string) {
    return this.prisma.dispatch_orders.create({
      data: {
        order_number: dto.order_number,
        status: dto.status ?? 'pending',
        requires_stock: dto.requires_stock,
        customer_id: dto.customer_id,
        origin_location_id: dto.origin_location_id,
        destination_location_id: dto.destination_location_id,
        planned_date: dto.planned_date,
        created_by: userId, // ✅ viene del JWT, no del body
      },
    });
  }

  async findAll() {
    return this.prisma.dispatch_orders.findMany({
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
