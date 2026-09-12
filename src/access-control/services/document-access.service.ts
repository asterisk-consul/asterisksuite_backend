import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PermissionContextBuilder } from '../authorization/permission-context.builder';

export type DocumentScope = 'sales' | 'purchases';
export type DocumentAction = 'read' | 'create' | 'update' | 'confirm' | 'cancel' | 'delete';

const CATEGORY_SLUG: Record<string, string> = {
  QUOTE: 'quotes',
  ORDER: 'orders',
  INVOICE: 'invoices',
  REMITO: 'delivery_notes',
  CREDIT_NOTE: 'credit_notes',
  DEBIT_NOTE: 'debit_notes',
  RECEIPT: 'receipts',
  OPENING_BALANCE: 'opening_balances',
};

@Injectable()
export class DocumentAccessService {
  constructor(
    private readonly db: PrismaService,
    private readonly contexts: PermissionContextBuilder,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private legacyPermissions(scope: DocumentScope, action: DocumentAction) {
    return scope === 'sales'
      ? [`sales.${action}`, `documents.${action}`]
      : [`purchases.${action}`, `documents-purchases.${action}`, `documents.${action}`];
  }

  private exactPermission(scope: DocumentScope, category: string, action: DocumentAction) {
    const slug = CATEGORY_SLUG[category];
    return slug ? `${scope}.${slug}.${action}` : null;
  }

  async can(userId: string, companyRole: string | undefined, scope: DocumentScope, category: string, action: DocumentAction) {
    if (companyRole === 'OWNER') return true;
    const context = await this.contexts.build(userId);
    if (this.legacyPermissions(scope, action).some(permission => context.can(permission))) return true;
    const exact = this.exactPermission(scope, category, action);
    return exact ? context.can(exact) : false;
  }

  async assertCategory(userId: string, companyRole: string | undefined, scope: DocumentScope, category: string, action: DocumentAction) {
    if (!await this.can(userId, companyRole, scope, category, action)) {
      throw new ForbiddenException(`No tenés permiso para ${action} documentos ${category} de ${scope === 'sales' ? 'ventas' : 'compras'}`);
    }
  }

  async assertDocumentType(userId: string, companyRole: string | undefined, scope: DocumentScope, documentTypeId: string, action: DocumentAction) {
    const type = await this.prisma.document_types.findFirst({
      where: { id: documentTypeId, active: true },
      select: { category: true, direction: true },
    });
    if (!type?.category) throw new NotFoundException('Tipo de documento no encontrado');
    const expectedDirection = scope === 'sales' ? 1 : -1;
    if (type.direction !== expectedDirection) throw new ForbiddenException('El tipo de documento no corresponde al circuito solicitado');
    await this.assertCategory(userId, companyRole, scope, type.category, action);
  }

  async assertDocument(userId: string, companyRole: string | undefined, scope: DocumentScope, documentId: string, action: DocumentAction) {
    const document = await this.prisma.documents.findFirst({
      where: { id: documentId, deleted_at: null },
      select: { document_types: { select: { category: true, direction: true } } },
    });
    if (!document?.document_types?.category) throw new NotFoundException('Documento no encontrado');
    const expectedDirection = scope === 'sales' ? 1 : -1;
    if (document.document_types.direction !== expectedDirection) throw new ForbiddenException('El documento no corresponde al circuito solicitado');
    await this.assertCategory(userId, companyRole, scope, document.document_types.category, action);
  }

  async assertAnyDocument(userId: string, companyRole: string | undefined, documentId: string, action: DocumentAction) {
    const document = await this.prisma.documents.findFirst({
      where: { id: documentId, deleted_at: null },
      select: { document_types: { select: { category: true, direction: true } } },
    });
    if (!document?.document_types?.category) throw new NotFoundException('Documento no encontrado');
    const scope: DocumentScope = document.document_types.direction === -1 ? 'purchases' : 'sales';
    await this.assertCategory(userId, companyRole, scope, document.document_types.category, action);
  }

  async allowedCategories(userId: string, companyRole: string | undefined, scope: DocumentScope, action: DocumentAction): Promise<string[] | undefined> {
    if (companyRole === 'OWNER') return undefined;
    const context = await this.contexts.build(userId);
    if (this.legacyPermissions(scope, action).some(permission => context.can(permission))) return undefined;
    return Object.entries(CATEGORY_SLUG)
      .filter(([, slug]) => context.can(`${scope}.${slug}.${action}`))
      .map(([category]) => category);
  }
}
