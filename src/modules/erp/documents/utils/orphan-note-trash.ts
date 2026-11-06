import { BadRequestException } from '@nestjs/common';

const NOTE_CATEGORIES = new Set(['CREDIT_NOTE', 'DEBIT_NOTE']);

/**
 * Guards the one exceptional trash flow for confirmed legacy notes that lost
 * their invoice link. They are cancelled and hidden, while the fiscal record
 * remains recoverable in the trash. The current-account reversal is handled
 * by the caller in the same transaction.
 */
export async function assertCanTrashConfirmedOrphanNote(tx: any, document: any) {
  const category = document.document_types?.category;
  if (typeof category !== 'string' || !NOTE_CATEGORIES.has(category) || ![2, 3].includes(document.status)) {
    throw new BadRequestException('Solo se pueden enviar por este flujo notas de crédito/débito confirmadas o anuladas sin factura asociada.');
  }

  if (document.parent_document_id) {
    throw new BadRequestException('No se puede enviar a la papelera: la nota tiene una factura de origen asociada.');
  }

  if (Number(document.paid_amount ?? 0) > 0.01) {
    throw new BadRequestException('No se puede enviar a la papelera: la nota tiene pagos o cobros aplicados.');
  }

  const [related] = await tx.$queryRaw<Array<Record<string, boolean>>>`
    SELECT
      EXISTS (SELECT 1 FROM tenant.documents WHERE parent_document_id = ${document.id}::uuid) AS children,
      EXISTS (SELECT 1 FROM tenant.payment_documents WHERE document_id = ${document.id}::uuid) AS payment_links,
      EXISTS (SELECT 1 FROM tenant.warehouse_stock_movements WHERE reference_id = ${document.id}::uuid) AS stock_movements,
      EXISTS (SELECT 1 FROM tenant.bank_account_movements WHERE reference_id = ${document.id}::uuid) AS bank_movements,
      EXISTS (SELECT 1 FROM tenant.cash_box_movements WHERE reference_id = ${document.id}::uuid) AS cash_movements,
      EXISTS (SELECT 1 FROM tenant.treasury_obligations WHERE document_id = ${document.id}::uuid) AS obligations,
      EXISTS (SELECT 1 FROM tenant.withholding_allocations WHERE document_id = ${document.id}::uuid) AS withholding_allocations
  `;

  if (related.children || related.payment_links || document.commercial_operation_id || document.dispatch_order_id) {
    throw new BadRequestException('No se puede enviar a la papelera: la nota forma parte de una cadena o tiene documentos/pagos asociados.');
  }

  if (
    related.stock_movements || related.bank_movements || related.cash_movements
    || related.obligations || related.withholding_allocations
  ) {
    throw new BadRequestException('No se puede enviar a la papelera: la nota tiene movimientos operativos o financieros asociados.');
  }
}
