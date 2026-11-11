type CreditNoteBalanceRow = {
  parent_document_id?: string | null;
  commercial_operation_id?: string | null;
  _sum: { total: unknown };
};

async function groupCreditNotes(
  client: any,
  key: 'parent_document_id' | 'commercial_operation_id',
  ids: string[],
  direction = 1,
): Promise<Map<string, number>> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (!uniqueIds.length) return new Map();

  const rows: CreditNoteBalanceRow[] = await client.documents.groupBy({
    by: [key],
    where: {
      [key]: { in: uniqueIds },
      status: 2,
      deleted_at: null,
      document_types: { category: 'CREDIT_NOTE', direction },
    },
    _sum: { total: true },
  });

  return new Map(
    rows
      .filter((row) => typeof row[key] === 'string')
      .map((row) => [row[key] as string, Number(row._sum.total ?? 0)]),
  );
}

/** Total de NC de venta confirmadas y activas agrupadas por factura. */
export function getSalesCreditNoteTotalsByInvoice(client: any, invoiceIds: string[]) {
  return groupCreditNotes(client, 'parent_document_id', invoiceIds);
}

/** Total de NC de venta confirmadas y activas agrupadas por operación comercial. */
export function getSalesCreditNoteTotalsByOperation(client: any, operationIds: string[]) {
  return groupCreditNotes(client, 'commercial_operation_id', operationIds);
}

/** Total de NC de compra confirmadas y activas agrupadas por factura. */
export function getPurchaseCreditNoteTotalsByInvoice(client: any, invoiceIds: string[]) {
  return groupCreditNotes(client, 'parent_document_id', invoiceIds, -1);
}
