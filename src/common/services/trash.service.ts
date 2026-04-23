import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TrashService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔥 1. TODA LA PAPELERA (multi-tabla)
  findAllTrash(days?: number, table?: string) {
    const since = days
      ? new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      : null;

    const models = this.getModels();

    const queries = models
      .filter((m) => !table || m === table)
      .map((model) => {
        return this.prisma[model].findMany({
          where: {
            deleted_at: since ? { gte: since } : { not: null },
          },
          select: {
            id: true,
            deleted_at: true,
            deleted_by: true,
          },
        });
      });

    return Promise.all(queries).then((results) =>
      results.flat().map((r) => ({
        ...r,
        table: table || 'mixed',
      })),
    );
  }

  // 🗑️ soft delete
  softDelete(model: string, id: string, userId: string) {
    return this.prisma[model].update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }

  // ♻️ restore
  restore(model: string, id: string) {
    return this.prisma[model].update({
      where: { id },
      data: {
        deleted_at: null,
        deleted_by: null,
      },
    });
  }

  // 🧠 lista de modelos permitidos (todos los que tienen deleted_at)
  private getModels(): string[] {
    return [
      'users',
      'business_parties',
      'cargo_transfers',
      'companies',
      'delivery_notes',
      'drivers',
      'entity_photos',
      'files',
      'locations',
      'pallets',
      'party_locations',
      'party_contacts',
      'picking_orders',
      'products',
      'trips',
      'trip_stops',
      'trip_stop_orders',
      'corridors',
      'corridor_stops',
      'vehicles',
      'vehicle_combinations',
      'warehouses',
      'document_sequences',
      'transport_document_types',
      'documents_vehicle',
      'documents_driver',
      'transfer_rates',
      'dispatch_rates',
      'document_item_taxes',
      'document_items',
      'document_taxes',
      'document_types',
      'documents',
      'product_taxes',
      'taxes',
    ];
  }
}
