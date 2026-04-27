import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { DispatchStatus, TripStatus } from '@/generated/prisma/enums';

@Injectable()
export class RatePriceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Último precio cobrado para una tarifa a un cliente específico
   * en despachos y viajes COMPLETED
   */
  async resolveByCustomer(
    rateId: string,
    customerId: string,
  ): Promise<{
    price: number;
    found: boolean;
    last_dispatch: { id: string; order_number: string } | null;
  }> {
    const lastRate = await this.prisma.dispatch_rates.findFirst({
      where: {
        rate_id: rateId,
        dispatch_orders: {
          customer_id: customerId,
          status: DispatchStatus.COMPLETED,
          tripStopOrders: {
            some: {
              trip_stop: { trip: { status: TripStatus.COMPLETED } },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      include: {
        dispatch_orders: { select: { id: true, order_number: true } },
      },
    });

    return {
      price: lastRate ? Number(lastRate.value) : 0,
      found: !!lastRate,
      last_dispatch: lastRate
        ? {
            id: lastRate.dispatch_orders.id,
            order_number: lastRate.dispatch_orders.order_number,
          }
        : null,
    };
  }

  /**
   * Último precio general para una tarifa sin importar cliente
   */
  async resolveGeneral(rateId: string): Promise<number> {
    const lastRate = await this.prisma.dispatch_rates.findFirst({
      where: {
        rate_id: rateId,
        dispatch_orders: {
          status: DispatchStatus.COMPLETED,
          tripStopOrders: {
            some: {
              trip_stop: { trip: { status: TripStatus.COMPLETED } },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return lastRate ? Number(lastRate.value) : 0;
  }
}
