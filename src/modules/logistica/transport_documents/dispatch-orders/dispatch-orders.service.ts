import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateDispatchOrderDto,
  UpdateDispatchOrderDto,
} from './dto/dispatch-order.dto';
import { buildPrismaUpdate } from '@/common/utils/buildPrisma';
import { DispatchStatus, TripStatus } from '@/generated/prisma/enums'; // ← agregar TripStatus

@Injectable()
export class DispatchOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDispatchOrderDto, userId: string) {
    const order = await this.prisma.dispatch_orders.create({
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
        dispatch_rates: { include: { transfer_rates: true } },
      },
    });

    // 🔥 Hook: sincronizar precios solo si la orden quedó COMPLETED
    // (poco probable en create, pero se respeta la regla)
    if (dto.rates?.length && order.status === DispatchStatus.COMPLETED) {
      await this.syncProductPricesForRates(dto.rates.map((r) => r.rate_id));
    }

    return order;
  }

  async findAll() {
    return this.prisma.dispatch_orders.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        customers: true,
        origin_location: true,
        destination_location: true,
        tripStopOrders: {
          include: { trip_stop: { include: { trip: true } } },
        },
        dispatch_rates: { include: { transfer_rates: true } },
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
          include: { trip_stop: { include: { trip: true } } },
        },
        dispatch_rates: { include: { transfer_rates: true } },
        corridors: true,
      },
    });
    if (!order) throw new NotFoundException('Dispatch order not found');
    return order;
  }

  async update(id: string, dto: UpdateDispatchOrderDto) {
    const { rates, ...rest } = dto;

    const data = buildPrismaUpdate(rest);

    if (rates) {
      data.dispatch_rates = {
        deleteMany: {},
        create: rates.map((r) => ({
          rate_id: r.rate_id,
          value: r.value,
        })),
      };
    }

    const order = await this.prisma.dispatch_orders.update({
      where: { id },
      data,
      include: {
        tripStopOrders: {
          include: { trip_stop: { include: { trip: true } } },
        },
      },
    });

    // 🔥 Hook: sincronizar precios si la orden está COMPLETED
    // y tiene al menos un viaje COMPLETED asociado
    const hasCompletedTrip = order.tripStopOrders.some(
      (tso) => tso.trip_stop.trip.status === TripStatus.COMPLETED,
    );

    if (
      rates?.length &&
      order.status === DispatchStatus.COMPLETED &&
      hasCompletedTrip
    ) {
      await this.syncProductPricesForRates(rates.map((r) => r.rate_id));
    }

    return order;
  }

  async remove(id: string) {
    return this.prisma.dispatch_orders.delete({ where: { id } });
  }

  // ─── Privado ──────────────────────────────────────────────────────────────

  /**
   * Para cada rate_id:
   * 1. Busca el último dispatch_rate donde la orden está COMPLETED
   *    y el viaje asociado está COMPLETED
   * 2. Actualiza product_price de todos los productos con ese rate_id
   */
  private async syncProductPricesForRates(rateIds: string[]) {
    const uniqueRateIds = [...new Set(rateIds)];

    for (const rateId of uniqueRateIds) {
      const lastDispatchRate = await this.prisma.dispatch_rates.findFirst({
        where: {
          rate_id: rateId,
          dispatch_orders: {
            status: DispatchStatus.COMPLETED,
            tripStopOrders: {
              some: {
                trip_stop: {
                  trip: { status: TripStatus.COMPLETED },
                },
              },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      // Sin historial válido, no tocar el precio
      if (!lastDispatchRate) continue;

      const newPrice = Number(lastDispatchRate.value);

      const products = await this.prisma.products.findMany({
        where: { rate_id: rateId, is_rate_type: true },
        include: { product_price: true },
      });

      for (const product of products) {
        const existing = product.product_price[0] ?? null;

        if (existing) {
          await this.prisma.product_price.update({
            where: { id: existing.id },
            data: {
              price: newPrice,
              updated_at: new Date(),
            },
          });
        } else {
          await this.prisma.product_price.create({
            data: {
              product_id: product.id,
              price: newPrice,
              exemptionRate: 0,
            },
          });
        }
      }
    }
  }
  async syncPrices(rateIds: string[]) {
    await this.syncProductPricesForRates(rateIds);

    return {
      message: 'Precios sincronizados correctamente',
      rateIds,
    };
  }
}
