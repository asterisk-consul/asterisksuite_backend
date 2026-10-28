import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TrashService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly softDeleteProtectedModels = new Set(['documents', 'payments']);
  private readonly permanentlyProtectedModels = new Set(['payments']);

  // 🔥 1. TODA LA PAPELERA (multi-tabla)
  async findAllTrash(days?: number, table?: string) {
    const since = days
      ? new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      : null;

    const models = this.getModels();
    const filteredModels = models.filter((m) => !table || m === table);

    const client = this.prisma.getClientForCurrentContext();
    const queries = filteredModels.map((model) => {
      const where = { deleted_at: since ? { gte: since } : { not: null } };
      if (model === 'documents') {
        return client.documents.findMany({
          where,
          select: {
            id: true,
            deleted_at: true,
            deleted_by: true,
            number: true,
            status: true,
            ref: true,
            descrip: true,
            document_types: { select: { category: true, description: true, direction: true } },
          },
        });
      }
      return client[model].findMany({
        where,
        select: { id: true, deleted_at: true, deleted_by: true },
      });
    });

    const results = await Promise.all(queries);
    const items = results.flatMap((result, index) =>
      result.map((r) => ({
        id: r.id,
        table: filteredModels[index],
        deletedAt: r.deleted_at?.toISOString() ?? null,
        deletedBy: r.deleted_by ?? null,
        ...(filteredModels[index] === 'documents'
          ? {
              documentNumber: r.number,
              documentStatus: r.status,
              documentReference: r.ref,
              documentDescription: r.descrip,
              documentCategory: r.document_types?.category ?? null,
              documentTypeName: r.document_types?.description ?? null,
              documentDirection: r.document_types?.direction ?? null,
            }
          : {}),
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
    if (this.softDeleteProtectedModels.has(model)) {
      throw new BadRequestException('El registro debe enviarse a la papelera desde su módulo para validar sus efectos');
    }
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
    if (this.softDeleteProtectedModels.has(model)) {
      throw new BadRequestException('Los documentos y pagos deben enviarse a la papelera desde su módulo');
    }
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
  async hardDeleteMany(model: string, ids: string[]) {
    if (model === 'documents') {
      return this.hardDeleteDocuments(ids);
    }
    if (this.permanentlyProtectedModels.has(model)) {
      throw new BadRequestException('Los pagos y cobros conservan efectos de tesorería y no admiten eliminación definitiva');
    }

    try {
      return await this.prisma.getClientForCurrentContext()[model].deleteMany({
        where: { id: { in: ids } },
      });
    } catch (error) {
      const code = (error as { code?: string })?.code;
      if (code === 'P2003') {
        const message = model === 'business_parties'
          ? 'No se puede eliminar definitivamente esta parte interesada porque tiene documentos u otros registros vinculados. Reasigná esas relaciones a la ficha que vas a conservar antes de eliminarla.'
          : 'No se puede eliminar definitivamente este registro porque tiene otros datos vinculados.';
        throw new BadRequestException(message);
      }
      throw error;
    }
  }

  private async hardDeleteDocuments(ids: string[]) {
    if (!ids.length) return { count: 0 };

    const db = this.prisma.getClientForCurrentContext();
    return db.$transaction(async (tx) => {
      const documents = await tx.documents.findMany({
        where: { id: { in: ids }, deleted_at: { not: null } },
        select: {
          id: true,
          number: true,
          status: true,
          source: true,
          deleted_at: true,
          paid_amount: true,
          parent_document_id: true,
          commercial_operation_id: true,
          dispatch_order_id: true,
          fiscal_authorization_id: true,
          fiscal_authorization_type: true,
          fiscal_authorization_code: true,
          fiscal_authorization_range_from: true,
          fiscal_authorization_range_to: true,
          document_types: {
            select: {
              category: true,
              direction: true,
              affects_stock: true,
              affects_accounting: true,
              affects_tax_book: true,
              affects_payment: true,
              requires_cae: true,
              is_electronic: true,
              afip_code: true,
            },
          },
          rooted_commercial_operation: { select: { id: true } },
          _count: {
            select: {
              payment_documents: true,
              child_documents: true,
              source_dispatch_orders: true,
              hr_vale_commission_details: true,
              sales_commission_assignments: true,
              international_operation_docs: true,
              international_operation_quotes: true,
              withholding_allocations: true,
              maintenance_services: true,
              purchase_tires: true,
            },
          },
        },
      });

      if (documents.length !== new Set(ids).size) {
        throw new BadRequestException('Todos los comprobantes deben estar en la papelera para eliminarlos definitivamente.');
      }

      const documentIds = documents.map((document) => document.id);
      const [stockMovements, stockReservations, reservationSources, accountEntries, allAccountEntries, bankMovements, cashMovements, obligations, attachments, intakeCaptures] = await Promise.all([
        tx.warehouse_stock_movements.groupBy({
          by: ['reference_id'], where: { reference_id: { in: documentIds } }, _count: { _all: true },
        }),
        tx.stock_reservation_allocations.groupBy({
          by: ['document_id'], where: { document_id: { in: documentIds } }, _count: { _all: true },
        }),
        tx.stock_reservations.groupBy({
          by: ['source_id'], where: { source_id: { in: documentIds } }, _count: { _all: true },
        }),
        tx.current_account_entries.groupBy({
          by: ['reference_id'], where: { reference_id: { in: documentIds }, deleted_at: null }, _count: { _all: true },
        }),
        tx.current_account_entries.groupBy({
          by: ['reference_id'], where: { reference_id: { in: documentIds } }, _count: { _all: true },
        }),
        tx.bank_account_movements.groupBy({
          by: ['reference_id'], where: { reference_id: { in: documentIds } }, _count: { _all: true },
        }),
        tx.cash_box_movements.groupBy({
          by: ['reference_id'], where: { reference_id: { in: documentIds } }, _count: { _all: true },
        }),
        tx.treasury_obligations.groupBy({
          by: ['document_id'], where: { document_id: { in: documentIds } }, _count: { _all: true },
        }),
        tx.entity_photos.groupBy({
          by: ['entity_id'], where: { entity_type: 'document', entity_id: { in: documentIds } }, _count: { _all: true },
        }),
        tx.intake_records.groupBy({
          by: ['target_id'],
          where: { target_id: { in: documentIds }, target_type: { in: ['PURCHASE_DOCUMENT', 'SALES_DOCUMENT'] } },
          _count: { _all: true },
        }),
      ]);

      const openingBalanceDocuments = documents.filter(
        (document) => document.document_types.category === 'OPENING_BALANCE'
          && document.source === 'opening_balance'
          && document.status === 2,
      );
      const deletedOpeningBalanceEntries = openingBalanceDocuments.length
        ? await tx.current_account_entries.findMany({
            where: {
              reference_type: 'document',
              reference_id: { in: openingBalanceDocuments.map((document) => document.id) },
              type: 'OPENING_BALANCE',
              deleted_at: { not: null },
            },
            select: { reference_id: true },
          })
        : [];
      const safelyRemovedOpeningBalanceIds = new Set(
        deletedOpeningBalanceEntries
          .map((entry) => entry.reference_id)
          .filter((id): id is string => Boolean(id)),
      );

      const linkedIds = new Set<string>();
      const accountEntryIds = new Set<string>();
      for (const group of allAccountEntries) if (group.reference_id) accountEntryIds.add(group.reference_id);
      for (const group of stockMovements) if (group.reference_id) linkedIds.add(group.reference_id);
      for (const group of stockReservations) linkedIds.add(group.document_id);
      for (const group of reservationSources) if (group.source_id) linkedIds.add(group.source_id);
      for (const group of accountEntries) if (group.reference_id) linkedIds.add(group.reference_id);
      for (const group of bankMovements) if (group.reference_id) linkedIds.add(group.reference_id);
      for (const group of cashMovements) if (group.reference_id) linkedIds.add(group.reference_id);
      for (const group of obligations) if (group.document_id) linkedIds.add(group.document_id);
      for (const group of attachments) linkedIds.add(group.entity_id);
      for (const group of intakeCaptures) if (group.target_id) linkedIds.add(group.target_id);

      const blocked = documents.flatMap((document) => {
        const category = document.document_types.category;
        const isSafelyRemovedOpeningBalance = category === 'OPENING_BALANCE'
          && document.source === 'opening_balance'
          && document.status === 2
          && safelyRemovedOpeningBalanceIds.has(document.id);
        const isCancelledInvoice = category === 'INVOICE' && document.status === 3;
        const cancelledStatus = category === 'QUOTE'
          ? 6
          : category === 'ORDER'
            ? document.document_types.direction === -1 ? 3 : 8
            : 3;
        let reason: string | null = null;

        if (!isSafelyRemovedOpeningBalance && document.status !== cancelledStatus) {
          reason = 'no está anulado';
        } else if (!isSafelyRemovedOpeningBalance && !['QUOTE', 'ORDER', 'INVOICE'].includes(category ?? '')) {
          reason = 'su tipo de comprobante debe conservarse por trazabilidad fiscal u operativa';
        } else if (isCancelledInvoice && accountEntryIds.has(document.id)) {
          reason = 'conserva asientos de cuenta corriente, incluso si fueron revertidos';
        } else if (
          document.document_types.affects_stock
          || (document.document_types.affects_accounting && !isSafelyRemovedOpeningBalance && !isCancelledInvoice)
          || document.document_types.affects_tax_book
          || (document.document_types.affects_payment && !isSafelyRemovedOpeningBalance && !isCancelledInvoice)
          || document.document_types.requires_cae
          || document.document_types.is_electronic
          || document.document_types.afip_code
          || document.fiscal_authorization_id
          || document.fiscal_authorization_type
          || document.fiscal_authorization_code
          || document.fiscal_authorization_range_from !== null
          || document.fiscal_authorization_range_to !== null
        ) {
          reason = 'tiene configuración o datos fiscales/contables que deben conservarse';
        } else if (Number(document.paid_amount) > 0 || document._count.payment_documents > 0) {
          reason = 'tiene pagos o cobros asociados';
        } else if (document.parent_document_id || document._count.child_documents > 0) {
          reason = 'forma parte de una cadena de documentos';
        } else if (document.commercial_operation_id || document.rooted_commercial_operation) {
          reason = 'está vinculado a una operación comercial';
        } else if (document.dispatch_order_id || document._count.source_dispatch_orders > 0) {
          reason = 'está vinculado a una orden de despacho';
        } else if (
          document._count.hr_vale_commission_details > 0
          || document._count.sales_commission_assignments > 0
          || document._count.international_operation_docs > 0
          || document._count.international_operation_quotes > 0
          || document._count.withholding_allocations > 0
          || document._count.maintenance_services > 0
          || document._count.purchase_tires > 0
        ) {
          reason = 'tiene movimientos o relaciones operativas asociadas';
        } else if (linkedIds.has(document.id)) {
          reason = 'tiene movimientos de stock, cuenta corriente, caja, banco u obligaciones asociadas';
        }

        return reason ? [{ number: document.number, reason }] : [];
      });

      if (blocked.length > 0) {
        const examples = blocked.slice(0, 3).map((item) => `#${item.number}: ${item.reason}`).join('; ');
        const more = blocked.length > 3 ? ` y ${blocked.length - 3} más` : '';
        throw new BadRequestException(`No se pueden eliminar definitivamente estos comprobantes. ${examples}${more}.`);
      }

      const safelyRemovedOpeningBalanceIdsToDelete = documents
        .filter((document) => safelyRemovedOpeningBalanceIds.has(document.id))
        .map((document) => document.id);
      if (safelyRemovedOpeningBalanceIdsToDelete.length) {
        await tx.current_account_entries.deleteMany({
          where: {
            reference_type: 'document',
            reference_id: { in: safelyRemovedOpeningBalanceIdsToDelete },
            type: 'OPENING_BALANCE',
            deleted_at: { not: null },
          },
        });
      }

      return tx.documents.deleteMany({
        where: { id: { in: documentIds }, deleted_at: { not: null } },
      });
    }).catch((error) => {
      const code = (error as { code?: string })?.code;
      if (code === 'P2003') {
        throw new BadRequestException('El comprobante conserva relaciones registradas y no se puede eliminar definitivamente.');
      }
      throw error;
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
      'payments',
      'bank_accounts',
      'bank_account_movements',
      'bank_concepts',
      'payment_bank_charges',
    ];
  }
}
