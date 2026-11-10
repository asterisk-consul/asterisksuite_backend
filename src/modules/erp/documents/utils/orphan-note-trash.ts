import { BadRequestException } from '@nestjs/common';

const NOTE_CATEGORIES = new Set(['CREDIT_NOTE', 'DEBIT_NOTE']);

/**
 * Guards trashing a cancelled note after its balance effects have been reversed.
 * Notes linked to an invoice may be purged only when they are manual and have
 * no fiscal authorization; otherwise the cancelled note stays in the chain.
 */
export async function assertCanTrashCancelledNote(tx: any, document: any) {
  const category = document.document_types?.category;
  if (typeof category !== 'string' || !NOTE_CATEGORIES.has(category) || document.status !== 3) {
    throw new BadRequestException('Primero anulá la nota de crédito/débito antes de enviarla a la papelera.');
  }

  if (document.parent_document_id) {
    const hasFiscalAuthorization = Boolean(
      document.fiscal_authorization_id
      || document.fiscal_authorization_type
      || document.fiscal_authorization_code
      || document.fiscal_authorization_expires_at
      || (document.fiscal_authorization_range_from !== null && document.fiscal_authorization_range_from !== undefined)
      || (document.fiscal_authorization_range_to !== null && document.fiscal_authorization_range_to !== undefined),
    );
    if (document.source !== 'manual' || hasFiscalAuthorization) {
      throw new BadRequestException('La nota anulada conserva su vínculo fiscal con la factura y debe permanecer en la cadena documental.');
    }
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
    throw new BadRequestException('No se puede enviar a la papelera: la nota tiene documentos hijos, pagos o una operación/despacho asociado.');
  }

  if (
    related.stock_movements || related.bank_movements || related.cash_movements
    || related.obligations || related.withholding_allocations
  ) {
    throw new BadRequestException('No se puede enviar a la papelera: la nota tiene movimientos operativos o financieros asociados.');
  }
}
