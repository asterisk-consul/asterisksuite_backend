import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { getCancelledDocumentStatus } from '@/modules/erp/documents/types/document-statuses';

const DOCUMENT_ACCOUNT_ENTRY_REFERENCE_TYPES = new Set([
  'document',
  'document_reversal',
  'order_invoice_replacement',
  'order_invoice_replacement_reversal',
]);
const NOTE_CATEGORIES = new Set(['CREDIT_NOTE', 'DEBIT_NOTE']);

const TRASH_DISPLAY_CONFIG: Record<string, { fields: string[]; primary: string[]; secondary?: string[] }> = {
  users: { fields: ['name', 'email'], primary: ['name'], secondary: ['email'] },
  business_parties: { fields: ['name', 'tax_id', 'type'], primary: ['name'], secondary: ['tax_id', 'type'] },
  companies: { fields: ['name', 'subdomain'], primary: ['name'], secondary: ['subdomain'] },
  products: { fields: ['name', 'sku'], primary: ['name'], secondary: ['sku'] },
  drivers: { fields: ['first_name', 'last_name', 'document'], primary: ['first_name', 'last_name'], secondary: ['document'] },
  vehicles: { fields: ['plate', 'brand', 'model'], primary: ['plate'], secondary: ['brand', 'model'] },
  trips: { fields: ['reference_number', 'status', 'departure_time'], primary: ['reference_number', 'status'], secondary: ['departure_time'] },
  delivery_notes: { fields: ['number', 'type', 'status'], primary: ['type', 'number'], secondary: ['status'] },
  pallets: { fields: ['code', 'status'], primary: ['code'], secondary: ['status'] },
  locations: { fields: ['address', 'city', 'province', 'country'], primary: ['city', 'province'], secondary: ['address', 'country'] },
  warehouses: { fields: ['name', 'code'], primary: ['name'], secondary: ['code'] },
  picking_orders: { fields: ['status', 'delivery_note_id'], primary: ['status'], secondary: ['delivery_note_id'] },
  corridors: { fields: ['name', 'description'], primary: ['name'], secondary: ['description'] },
  transfer_rates: { fields: ['name', 'rate_type', 'description'], primary: ['name'], secondary: ['rate_type', 'description'] },
  dispatch_rates: { fields: ['value', 'currency_code', 'rate_id'], primary: ['value', 'currency_code'], secondary: ['rate_id'] },
  document_sequences: { fields: ['name', 'point_of_sale', 'prefix'], primary: ['name'], secondary: ['point_of_sale', 'prefix'] },
  document_types: { fields: ['description', 'code', 'category', 'direction'], primary: ['description'], secondary: ['code', 'category'] },
  accounts: { fields: ['code', 'name'], primary: ['name'], secondary: ['code'] },
  tags: { fields: ['name'], primary: ['name'] },
  categories: { fields: ['name', 'slug'], primary: ['name'], secondary: ['slug'] },
  attributes: { fields: ['name', 'code'], primary: ['name'], secondary: ['code'] },
  units: { fields: ['name', 'symbol'], primary: ['name'], secondary: ['symbol'] },
  currencies: { fields: ['code', 'name'], primary: ['name'], secondary: ['code'] },
  bank_accounts: { fields: ['name', 'bank_name', 'account_number'], primary: ['name'], secondary: ['bank_name', 'account_number'] },
  bank_account_movements: { fields: ['type', 'date', 'description', 'reference', 'amount', 'currency_code'], primary: ['type', 'reference', 'description'], secondary: ['date', 'amount', 'currency_code'] },
  payments: { fields: ['number', 'type', 'date', 'amount', 'currency_code', 'reference'], primary: ['type', 'number'], secondary: ['date', 'amount', 'currency_code', 'reference'] },
};

function displayFieldText(record: Record<string, unknown>, fields: string[] = []) {
  return fields
    .map((field) => record[field])
    .filter((value) => value !== null && value !== undefined && String(value).trim().length > 0)
    .map((value) => String(value).trim())
    .join(' · ');
}

function getTrashDisplayData(model: string, record: Record<string, unknown>) {
  const config = TRASH_DISPLAY_CONFIG[model];
  if (!config) return {};
  return {
    displayName: displayFieldText(record, config.primary) || null,
    displayDetail: displayFieldText(record, config.secondary) || null,
  };
}

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
      const displaySelect = Object.fromEntries(
        (TRASH_DISPLAY_CONFIG[model]?.fields ?? []).map((field) => [field, true]),
      );
      if (model === 'documents') {
        return client.documents.findMany({
          where,
          select: {
            id: true,
            deleted_at: true,
            deleted_by: true,
            source: true,
            party_id: true,
            number: true,
            status: true,
            paid_amount: true,
            ref: true,
            descrip: true,
            document_types: { select: { category: true, description: true, direction: true } },
          },
        });
      }
      return client[model].findMany({
        where,
        select: { id: true, deleted_at: true, deleted_by: true, ...displaySelect },
      });
    });

    const results = await Promise.all(queries);
    const items = results.flatMap((result, index) =>
      result.map((r) => ({
        id: r.id,
        table: filteredModels[index],
        deletedAt: r.deleted_at?.toISOString() ?? null,
        deletedBy: r.deleted_by ?? null,
        ...getTrashDisplayData(filteredModels[index]!, r),
        ...(filteredModels[index] === 'documents'
          ? {
              documentNumber: r.number,
              documentStatus: r.status,
              documentPaidAmount: Number(r.paid_amount ?? 0),
              documentSource: r.source,
              documentPartyId: r.party_id,
              documentReference: r.ref,
              documentDescription: r.descrip,
              documentCategory: r.document_types?.category ?? null,
              documentTypeName: r.document_types?.description ?? null,
              documentDirection: r.document_types?.direction ?? null,
            }
          : {}),
      })),
    );

    const trashedValeDocuments = items.filter((item: any) =>
      item.table === 'documents'
      && item.documentCategory === 'VALE'
      && item.documentSource === 'manual'
      && item.documentPartyId
      && /^Vale #\d+$/i.test(item.documentDescription?.trim() ?? ''),
    ) as any[];
    if (trashedValeDocuments.length) {
      const valeRefs = trashedValeDocuments.map((document) => ({
        document,
        number: Number(/^Vale #(\d+)$/i.exec(document.documentDescription.trim())?.[1]),
      }));
      const relatedVales = await client.hr_vales.findMany({
        where: {
          status: 'CANCELLED',
          party_id: { in: [...new Set(trashedValeDocuments.map((document) => document.documentPartyId))] },
          number: { in: [...new Set(valeRefs.map((reference) => reference.number))] },
        },
        select: { id: true, party_id: true, number: true, party_type: true },
      });
      const valeByKey = new Map<string, (typeof relatedVales)[number]>(
        relatedVales.map((vale) => [`${vale.party_id}:${vale.number}`, vale] as const),
      );
      const linkedVales = valeRefs.flatMap(({ document, number }) => {
        const vale = valeByKey.get(`${document.documentPartyId}:${number}`);
        return vale ? [{ document, vale }] : [];
      });
      const linkedDocumentIds = linkedVales.map(({ document }) => document.id);
      const partnerValeIds = linkedVales
        .filter(({ vale }) => vale.party_type === 'PARTNER')
        .map(({ vale }) => vale.id);
      if (linkedDocumentIds.length) {
        const [activeAccountEntries, activePayments, cashMovements, bankMovements, cashCancellations, bankCancellations] = await Promise.all([
          client.current_account_entries.findMany({
            where: {
              reference_id: { in: linkedDocumentIds },
              reference_type: { in: [...DOCUMENT_ACCOUNT_ENTRY_REFERENCE_TYPES] },
              deleted_at: null,
            },
            select: { reference_id: true },
          }),
          client.payment_documents.findMany({
            where: {
              document_id: { in: linkedDocumentIds },
              deleted_at: null,
              payment: { deleted_at: null, status: { notIn: ['CANCELLED', 'REVERSED'] } },
            },
            select: { document_id: true },
          }),
          partnerValeIds.length
            ? client.cash_box_movements.findMany({
                where: { reference_type: 'hr_vale', reference_id: { in: partnerValeIds }, deleted_at: null },
                select: { reference_id: true },
              })
            : Promise.resolve([]),
          partnerValeIds.length
            ? client.bank_account_movements.findMany({
                where: { reference_type: 'hr_vale', reference_id: { in: partnerValeIds }, deleted_at: null },
                select: { reference_id: true },
              })
            : Promise.resolve([]),
          partnerValeIds.length
            ? client.cash_box_movements.findMany({
                where: { reference_type: 'hr_vale_cancellation', reference_id: { in: partnerValeIds }, deleted_at: null },
                select: { reference_id: true },
              })
            : Promise.resolve([]),
          partnerValeIds.length
            ? client.bank_account_movements.findMany({
                where: { reference_type: 'hr_vale_cancellation', reference_id: { in: partnerValeIds }, deleted_at: null },
                select: { reference_id: true },
              })
            : Promise.resolve([]),
        ]);
        const documentsWithActiveEntries = new Set(activeAccountEntries.map((entry) => entry.reference_id).filter(Boolean));
        const documentsWithActivePayments = new Set(activePayments.map((payment) => payment.document_id));
        const valeIdsWithCash = new Set(cashMovements.map((movement) => movement.reference_id).filter(Boolean));
        const valeIdsWithBank = new Set(bankMovements.map((movement) => movement.reference_id).filter(Boolean));
        const valeIdsWithCashReversal = new Set(cashCancellations.map((movement) => movement.reference_id).filter(Boolean));
        const valeIdsWithBankReversal = new Set(bankCancellations.map((movement) => movement.reference_id).filter(Boolean));

        for (const { document, vale } of linkedVales) {
          const documentStatusNeedsReconciliation = Number(document.documentStatus) !== 3;
          const documentPaidAmountNeedsReconciliation = Number(document.documentPaidAmount) !== 0;
          const documentAccountEntriesNeedReconciliation = documentsWithActiveEntries.has(document.id);
          const documentNeedsReconciliation = documentStatusNeedsReconciliation
            || documentPaidAmountNeedsReconciliation
            || documentAccountEntriesNeedReconciliation;
          const treasuryNeedsReconciliation = vale.party_type === 'PARTNER'
            && (valeIdsWithCash.has(vale.id)
              ? !valeIdsWithCashReversal.has(vale.id)
              : valeIdsWithBank.has(vale.id) && !valeIdsWithBankReversal.has(vale.id));
          document.hrValeId = vale.id;
          document.hrValeDocumentNeedsReconciliation = documentNeedsReconciliation;
          document.hrValeDocumentStatusNeedsReconciliation = documentStatusNeedsReconciliation;
          document.hrValePaidAmountNeedsReconciliation = documentPaidAmountNeedsReconciliation;
          document.hrValeAccountEntriesNeedReconciliation = documentAccountEntriesNeedReconciliation;
          document.hrValeTreasuryNeedsReconciliation = treasuryNeedsReconciliation;
          document.hrValeNeedsReconciliation = documentNeedsReconciliation || treasuryNeedsReconciliation;
          document.hrValeReconciliationBlocked = documentsWithActivePayments.has(document.id);
        }
      }
    }

    const visibleItems = items.map((item: any) => {
      const {
        documentPaidAmount: _documentPaidAmount,
        documentPartyId: _documentPartyId,
        documentSource: _documentSource,
        ...visibleItem
      } = item;
      return visibleItem;
    });

    const userIds = [...new Set(visibleItems.map((i) => i.deletedBy).filter(Boolean))] as string[];

    let userMap = new Map<string, string>();
    if (userIds.length > 0) {
      const publicPrisma = this.prisma.getDefaultClient();
      const users = await publicPrisma.users.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true },
      });
      userMap = new Map(users.map((u) => [u.id, u.name]));
    }

    return visibleItems.map((item) => ({
      ...item,
      deletedByName: item.deletedBy ? (userMap.get(item.deletedBy) ?? null) : null,
    }));
  }

  async getTrashedValeTreasuryImpacts(documentId: string) {
    const client = this.prisma.getClientForCurrentContext();
    const document = await client.documents.findFirst({
      where: {
        id: documentId,
        deleted_at: { not: null },
        document_types: { category: 'VALE' },
      },
      select: { id: true, party_id: true, descrip: true },
    });
    if (!document) throw new NotFoundException('Comprobante VALE no encontrado en la Papelera.');

    const valeNumber = /^Vale #(\d+)$/i.exec(document.descrip?.trim() ?? '')?.[1];
    if (!document.party_id || !valeNumber) return { impacts: [] };

    const vale = await client.hr_vales.findFirst({
      where: { party_id: document.party_id, number: Number(valeNumber) },
      select: { id: true },
    });
    if (!vale) return { impacts: [] };

    const [cashMovements, bankMovements, paymentLinks] = await Promise.all([
      client.cash_box_movements.findMany({
        where: {
          reference_type: { in: ['hr_vale', 'hr_vale_cancellation'] },
          reference_id: vale.id,
          deleted_at: null,
        },
        select: {
          id: true,
          type: true,
          currency_code: true,
          balance_before: true,
          balance_after: true,
          date: true,
          description: true,
          reference_type: true,
          cash_box: { select: { name: true } },
        },
      }),
      client.bank_account_movements.findMany({
        where: {
          reference_type: { in: ['hr_vale', 'hr_vale_cancellation'] },
          reference_id: vale.id,
          deleted_at: null,
        },
        select: {
          id: true,
          type: true,
          currency_code: true,
          balance_before: true,
          balance_after: true,
          date: true,
          description: true,
          reference_type: true,
          bank_account: { select: { name: true, bank_name: true } },
        },
      }),
      client.payment_documents.findMany({
        where: { document_id: document.id },
        select: {
          payment: {
            select: {
              cash_box_movements: {
                where: { deleted_at: null },
                select: {
                  id: true,
                  type: true,
                  currency_code: true,
                  balance_before: true,
                  balance_after: true,
                  date: true,
                  description: true,
                  reference_type: true,
                  cash_box: { select: { name: true } },
                },
              },
              bank_account_movements: {
                where: { deleted_at: null },
                select: {
                  id: true,
                  type: true,
                  currency_code: true,
                  balance_before: true,
                  balance_after: true,
                  date: true,
                  description: true,
                  reference_type: true,
                  bank_account: { select: { name: true, bank_name: true } },
                },
              },
            },
          },
        },
      }),
    ]);

    const impacts = new Map<string, {
      id: string;
      accountLabel: string;
      movementLabel: string;
      amount: number;
      currencyCode: string;
      date: string;
      isReversal: boolean;
    }>();
    const addImpact = (movement: any, accountLabel: string) => {
      const movementType = String(movement.type ?? '').toUpperCase();
      const description = String(movement.description ?? '').toLowerCase();
      const referenceType = String(movement.reference_type ?? '').toLowerCase();
      const isReversal = referenceType === 'hr_vale_cancellation'
        || referenceType.includes('reversal')
        || description.startsWith('reversión');
      const movementLabel = movementType === 'PAYMENT'
        ? 'Pago / débito'
        : movementType === 'COLLECTION'
          ? 'Cobro / crédito'
          : movementType === 'ADJUSTMENT'
            ? 'Ajuste'
            : movementType || 'Movimiento';
      impacts.set(movement.id, {
        id: movement.id,
        accountLabel,
        movementLabel: isReversal ? `Reversión · ${movementLabel}` : movementLabel,
        amount: Number(movement.balance_after) - Number(movement.balance_before),
        currencyCode: movement.currency_code,
        date: movement.date.toISOString(),
        isReversal,
      });
    };

    for (const movement of cashMovements) addImpact(movement, `Caja · ${movement.cash_box.name}`);
    for (const movement of bankMovements) {
      const bankName = [movement.bank_account.bank_name, movement.bank_account.name].filter(Boolean).join(' · ');
      addImpact(movement, `Banco · ${bankName}`);
    }
    for (const { payment } of paymentLinks) {
      for (const movement of payment.cash_box_movements) addImpact(movement, `Caja · ${movement.cash_box.name}`);
      for (const movement of payment.bank_account_movements) {
        const bankName = [movement.bank_account.bank_name, movement.bank_account.name].filter(Boolean).join(' · ');
        addImpact(movement, `Banco · ${bankName}`);
      }
    }

    return {
      impacts: [...impacts.values()].sort((a, b) => a.date.localeCompare(b.date)),
    };
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
  async hardDeleteMany(model: string, ids: string[], confirmAccidentalDocuments = false) {
    if (model === 'documents') {
      if (!confirmAccidentalDocuments) {
        throw new BadRequestException('Confirmá que los comprobantes seleccionados se cargaron por error y no representan documentos reales emitidos o recibidos.');
      }
      return this.hardDeleteDocuments(ids);
    }
    if (model === 'business_parties') {
      return this.hardDeleteBusinessParties(ids);
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

  private async hardDeleteBusinessParties(ids: string[]) {
    if (!ids.length) return { count: 0 };

    const db = this.prisma.getClientForCurrentContext();
    return db.$transaction(async (tx) => {
      const parties = await tx.business_parties.findMany({
        where: { id: { in: ids }, deleted_at: { not: null } },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              delivery_notes: true,
              dispatch_orders: true,
              documents: true,
              party_bank_accounts: true,
              employees: true,
              partners: true,
              payments: true,
              credit_cards: true,
              current_accounts: true,
              commercial_operations: true,
              hr_accounts: true,
              hr_vales: true,
              product_suppliers: true,
              product_party_prices: true,
              product_party_price_history: true,
              international_operations: true,
              withholding_profiles: true,
              iibb_registrations: true,
              withholdings: true,
              maintenance_orders_as_supplier: true,
              maintenance_services_as_supplier: true,
              tires_as_supplier: true,
            },
          },
        },
      });

      if (parties.length !== new Set(ids).size) {
        throw new BadRequestException('Todas las partes interesadas deben estar en la papelera para eliminarlas definitivamente.');
      }

      const withHistory = parties.filter((party) =>
        Object.values(party._count as Record<string, number>).some((count) => count > 0),
      );
      if (withHistory.length) {
        const examples = withHistory.slice(0, 3).map((party) => party.name).join(', ');
        const more = withHistory.length > 3 ? ` y ${withHistory.length - 3} más` : '';
        throw new BadRequestException(
          `No se pueden eliminar partes interesadas con documentos, pagos, movimientos u otros datos asociados: ${examples}${more}. Reasigná la historia a la ficha que vas a conservar.`,
        );
      }

      return tx.business_parties.deleteMany({
        where: { id: { in: ids }, deleted_at: { not: null } },
      });
    }).catch((error) => {
      const code = (error as { code?: string })?.code;
      if (code === 'P2003') {
        throw new BadRequestException('No se puede eliminar definitivamente esta parte interesada porque todavía tiene datos vinculados.');
      }
      throw error;
    });
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
          descrip: true,
          party_id: true,
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
          fiscal_authorization_expires_at: true,
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

      const trashedValeRefs = documents.flatMap((document) => {
        if (document.document_types.category !== 'VALE' || document.source !== 'manual' || !document.party_id) return [];
        const match = /^Vale #(\d+)$/i.exec(document.descrip?.trim() ?? '');
        return match ? [{ documentId: document.id, partyId: document.party_id, number: Number(match[1]) }] : [];
      });
      const relatedCancelledVales = trashedValeRefs.length
        ? await tx.hr_vales.findMany({
            where: {
              status: 'CANCELLED',
              party_id: { in: [...new Set(trashedValeRefs.map((reference) => reference.partyId))] },
              number: { in: [...new Set(trashedValeRefs.map((reference) => reference.number))] },
            },
            select: { id: true, party_id: true, number: true },
          })
        : [];
      const cancelledValeDocumentIds = new Set(
        trashedValeRefs
          .filter((reference) => relatedCancelledVales.some(
            (vale) => vale.party_id === reference.partyId && vale.number === reference.number,
          ))
          .map((reference) => reference.documentId),
      );

      const documentIds = documents.map((document) => document.id);
      const manuallyTrashedDocumentIds = documents
        .filter((document) => Boolean(document.document_types.category)
          && document.document_types.category !== 'OPENING_BALANCE'
          && document.source === 'manual')
        .map((document) => document.id);
      const manuallyTrashedDocumentIdSet = new Set(manuallyTrashedDocumentIds);
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

      const manuallyTrashedDocumentAccountEntries = manuallyTrashedDocumentIds.length
        ? await tx.current_account_entries.findMany({
            where: { reference_id: { in: manuallyTrashedDocumentIds } },
            select: { id: true, reference_id: true, reference_type: true, payment_id: true, deleted_at: true },
          })
        : [];
      const manuallyTrashedDocumentAccountEntriesByDocument = new Map<string, typeof manuallyTrashedDocumentAccountEntries>();
      for (const entry of manuallyTrashedDocumentAccountEntries) {
        if (!entry.reference_id) continue;
        const entries = manuallyTrashedDocumentAccountEntriesByDocument.get(entry.reference_id) ?? [];
        entries.push(entry);
        manuallyTrashedDocumentAccountEntriesByDocument.set(entry.reference_id, entries);
      }

      const openingBalanceDocuments = documents.filter(
        (document) => document.document_types.category === 'OPENING_BALANCE'
          && document.source === 'opening_balance'
          && [2, 3].includes(document.status),
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
          && [2, 3].includes(document.status)
          && safelyRemovedOpeningBalanceIds.has(document.id);
        const isCancelledInvoice = category === 'INVOICE' && document.status === 3;
        const cancelledStatus = getCancelledDocumentStatus(category ?? '', document.document_types.direction);
        // For manual records, entry into the trash is the cancellation gate for permanent
        // deletion, but a confirmed document must already carry its category's cancelled
        // status. Drafts remain eligible because they were never confirmed.
        const isManualTrashedDocument = Boolean(category)
          && category !== 'OPENING_BALANCE'
          && document.source === 'manual'
          && document.deleted_at !== null
          && (document.status === 0 || document.status === cancelledStatus);
        const documentAccountEntries = manuallyTrashedDocumentAccountEntriesByDocument.get(document.id) ?? [];
        const hasFiscalAuthorization = Boolean(
          document.fiscal_authorization_id
          || document.fiscal_authorization_type
          || document.fiscal_authorization_code
          || document.fiscal_authorization_expires_at
          || (document.fiscal_authorization_range_from !== null && document.fiscal_authorization_range_from !== undefined)
          || (document.fiscal_authorization_range_to !== null && document.fiscal_authorization_range_to !== undefined),
        );
        const canPurgeManualTrashedDocument = isManualTrashedDocument
          && !hasFiscalAuthorization
          && documentAccountEntries.every((entry) => entry.deleted_at !== null
            && !entry.payment_id
            && DOCUMENT_ACCOUNT_ENTRY_REFERENCE_TYPES.has(entry.reference_type ?? ''));
        const canPurgeLinkedManualNote = canPurgeManualTrashedDocument
          && NOTE_CATEGORIES.has(category ?? '')
          && (document.status === 0 || document.status === cancelledStatus);
        let reason: string | null = null;

        if (!isSafelyRemovedOpeningBalance && !isManualTrashedDocument && document.status !== cancelledStatus) {
          reason = cancelledValeDocumentIds.has(document.id)
            ? 'el vale RRHH asociado está anulado, pero su comprobante interno requiere regularización antes de purgarse'
            : 'no está anulado';
        } else if (
          isManualTrashedDocument
          && !canPurgeManualTrashedDocument
        ) {
          reason = hasFiscalAuthorization
            ? 'tiene autorización fiscal asociada y debe conservarse'
            : 'conserva asientos de cuenta corriente o relaciones de pago que deben preservarse';
        } else if (
          !isSafelyRemovedOpeningBalance
          && !['QUOTE', 'ORDER', 'INVOICE'].includes(category ?? '')
          && !canPurgeManualTrashedDocument
        ) {
          reason = 'su tipo de comprobante debe conservarse por trazabilidad fiscal u operativa';
        } else if (isCancelledInvoice && accountEntryIds.has(document.id) && !canPurgeManualTrashedDocument) {
          reason = 'conserva asientos de cuenta corriente, incluso si fueron revertidos';
        } else if (
          (document.document_types.affects_stock && !canPurgeManualTrashedDocument)
          || (
            document.document_types.affects_accounting
            && !isSafelyRemovedOpeningBalance
            && !isCancelledInvoice
            && !canPurgeManualTrashedDocument
          )
          || (document.document_types.affects_tax_book && !canPurgeManualTrashedDocument)
          || (
            document.document_types.affects_payment
            && !isSafelyRemovedOpeningBalance
            && !isCancelledInvoice
            && !canPurgeManualTrashedDocument
          )
          || (document.document_types.requires_cae && !canPurgeManualTrashedDocument)
          || (document.document_types.is_electronic && !canPurgeManualTrashedDocument)
          || (document.document_types.afip_code && !canPurgeManualTrashedDocument)
          || document.fiscal_authorization_id
          || document.fiscal_authorization_type
          || document.fiscal_authorization_code
          || document.fiscal_authorization_expires_at
          || (document.fiscal_authorization_range_from !== null && document.fiscal_authorization_range_from !== undefined)
          || (document.fiscal_authorization_range_to !== null && document.fiscal_authorization_range_to !== undefined)
        ) {
          reason = 'tiene configuración o datos fiscales/contables que deben conservarse';
        } else if (Number(document.paid_amount) > 0 || document._count.payment_documents > 0) {
          reason = 'tiene pagos o cobros asociados';
        } else if ((document.parent_document_id && !canPurgeLinkedManualNote) || document._count.child_documents > 0) {
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

      const safelyRemovedCancelledDocumentEntries = manuallyTrashedDocumentAccountEntries
        .filter((entry) => entry.reference_id
          && manuallyTrashedDocumentIdSet.has(entry.reference_id)
          && entry.deleted_at !== null
          && !entry.payment_id
          && DOCUMENT_ACCOUNT_ENTRY_REFERENCE_TYPES.has(entry.reference_type ?? ''))
        .map((entry) => entry.id);
      if (safelyRemovedCancelledDocumentEntries.length) {
        // These entries were already reversed and excluded from the ledger when the document
        // entered the trash. Purging them must not apply a second balance adjustment.
        await tx.current_account_entries.deleteMany({
          where: { id: { in: safelyRemovedCancelledDocumentEntries }, deleted_at: { not: null } },
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
