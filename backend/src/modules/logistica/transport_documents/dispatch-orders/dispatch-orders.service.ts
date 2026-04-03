import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateDispatchOrderDto,
  UpdateDispatchOrderDto,
} from './dto/dispatch-order.dto';
import { buildPrismaUpdate } from '@/common/utils/buildPrisma';
import { DispatchStatus } from '@/generated/prisma/enums';

@Injectable()
export class DispatchOrdersService {
  constructor(private prisma: PrismaService) {}

  // service
  async create(dto: CreateDispatchOrderDto, userId: string) {
    return this.prisma.dispatch_orders.create({
      data: {
        order_number: dto.order_number,
        status: dto.status ?? DispatchStatus.PENDING,
        requires_stock: dto.requires_stock ?? false,

        customer_id: dto.customer_id,
        origin_location_id: dto.origin_location_id,
        destination_location_id: dto.destination_location_id,
        corridor_id: dto.corridor_id,

        planned_date: dto.planned_date ? new Date(dto.planned_date) : undefined,

        created_by: userId,

        // 🔥 rates
        dispatch_rates: dto.rates?.length
          ? {
              create: dto.rates.map((r) => ({
                rate_id: r.rate_id,
                value: r.value,
              })),
            }
          : undefined,
      },

      include: {
        customers: true,
        origin_location: true,
        destination_location: true,
        corridors: true,

        dispatch_rates: {
          include: {
            transfer_rates: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.dispatch_orders.findMany({
      include: {
        customers: true,
        origin_location: true,
        destination_location: true,

        tripStopOrders: {
          include: {
            trip_stop: {
              include: {
                trip: true,
              },
            },
          },
        },

        dispatch_rates: true,
        corridors: true,
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

        tripStopOrders: {
          include: {
            trip_stop: {
              include: {
                trip: true,
              },
            },
          },
        },
        dispatch_rates: true,
        corridors: true,
      },
    });
    if (!order) throw new NotFoundException('Dispatch order not found');
    return order;
  }

  async update(id: string, dto: UpdateDispatchOrderDto) {
    const { rates, ...rest } = dto;

    const data = buildPrismaUpdate(rest);

    // 🔥 manejar relación manualmente
    if (rates) {
      data.dispatch_rates = {
        deleteMany: {}, // limpia existentes
        create: rates.map((r) => ({
          rate_id: r.rate_id,
          value: r.value,
        })),
      };
    }

    return this.prisma.dispatch_orders.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.dispatch_orders.delete({
      where: { id },
    });
  }
}
