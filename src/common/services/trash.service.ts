import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TrashService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔥 1. TODA LA PAPELERA (multi-tabla)
  async findAllTrash(days?: number, table?: string) {
    const since = days
      ? new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      : null;

    const models = this.getModels();
    const filteredModels = models.filter((m) => !table || m === table);

    const queries = filteredModels.map((model) => {
      return this.prisma.getClientForCurrentContext()[model].findMany({
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

    const results = await Promise.all(queries);
    const items = results.flatMap((result, index) =>
      result.map((r) => ({
        id: r.id,
        table: filteredModels[index],
        deletedAt: r.deleted_at?.toISOString() ?? null,
        deletedBy: r.deleted_by ?? null,
      })),
    );

    const userIds = [...new Set(items.map((i) => i.deletedBy).filter(Boolean))] as string[];

    let userMap = new Map<string, string>();
    if (userIds.length > 0) {
      const publicPrisma = this.prisma.getDefaultClient();
      const users = await publicPrisma.users.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true },
      });
      userMap = new Map(users.map((u) => [u.id, u.name]));
    }

    return items.map((item) => ({
      ...item,
      deletedByName: item.deletedBy ? (userMap.get(item.deletedBy) ?? null) : null,
    }));
  }

  // 🗑️ soft delete
  softDelete(model: string, id: string, userId: string) {
    return this.prisma.getClientForCurrentContext()[model].update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }

  // ♻️ restore
  restore(model: string, id: string) {
    return this.prisma.getClientForCurrentContext()[model].update({
      where: { id },
      data: {
        deleted_at: null,
        deleted_by: null,
      },
    });
  }

  // 🗑️ soft delete BULK
  softDeleteMany(model: string, ids: string[], userId: string) {
    return this.prisma.getClientForCurrentContext()[model].updateMany({
      where: { id: { in: ids } },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }

  // ♻️ restore BULK
  restoreMany(model: string, ids: string[]) {
    return this.prisma.getClientForCurrentContext()[model].updateMany({
      where: { id: { in: ids } },
      data: {
        deleted_at: null,
        deleted_by: null,
      },
    });
  }

  // 💀 hard delete BULK (elimina físicamente)
  hardDeleteMany(model: string, ids: string[]) {
    return this.prisma.getClientForCurrentContext()[model].deleteMany({
      where: { id: { in: ids } },
    });
  }

  // 🧠 lista de modelos permitidos (todos los que tienen deleted_at)
  private getModels(): string[] {
    return [
      'users',
      'business_parties',
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
      'product_price',
      'accounts',
      'product_attribute_values',
      'attributes',
      'tags',
      'categories',
      'product_components',
      'product_variants',
      'units',
      'currency_rates',
      'currencies',
    ];
  }
}
