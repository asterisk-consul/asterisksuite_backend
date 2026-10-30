import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod/v4';
import { readFile, stat } from 'node:fs/promises';
import { PrismaService } from '@/prisma/prisma.service';
import { PermissionContextBuilder } from '@/access-control/authorization/permission-context.builder';
import { DocumentAccessService } from '@/access-control/services/document-access.service';
import { DocumentsPurchasesService } from '@/modules/erp/documents-purchases/documents_purchases.service';
import { FilesService } from '@/modules/logistica/media/files/files.service';
import type { McpIdentity } from './mcp-oauth.provider';

const MAX_MCP_FILE_BYTES = 5 * 1024 * 1024;
const MAX_CONCURRENT_MCP_FILE_READS = 3;

@Injectable()
export class McpToolsService {
  private activeFileReads = 0;

  constructor(
    private readonly db: PrismaService,
    private readonly permissions: PermissionContextBuilder,
    private readonly documentAccess: DocumentAccessService,
    private readonly purchases: DocumentsPurchasesService,
    private readonly files: FilesService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async createServer(identity: McpIdentity) {
    const server = new McpServer(
      { name: 'asterisk-suite', version: '1.0.0' },
      {
        capabilities: { tools: {}, resources: {} },
        instructions: 'Esta conexión representa a un usuario dentro de una sola empresa. Consultá los datos usando las herramientas disponibles. Para facturas, leé el original de Capturas y creá solo un borrador; una persona debe revisarlo y confirmarlo en Asterisk Suite.',
        maxToolInputElements: 500,
      },
    );

    const context = identity.companyRole === 'OWNER'
      ? null
      : await this.permissions.build(identity.userId);
    const can = (permission: string) => identity.companyRole === 'OWNER' || Boolean(context?.can(permission));
    const textResult = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });

    if (identity.scopes.includes('erp:read')) server.registerTool('get_company', {
      title: 'Ver empresa conectada',
      description: 'Devuelve el nombre e identificador de la empresa que el usuario autorizó para esta conexión.',
      _meta: { 'openai/profile': true },
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    }, async () => {
      const company = await this.db.getDefaultClient().companies.findFirst({
        where: { id: identity.companyId, deleted_at: null },
        select: { id: true, name: true, subdomain: true },
      });
      if (!company) throw new NotFoundException('La empresa conectada ya no está disponible');
      return textResult(company);
    });

    if (identity.scopes.includes('erp:read') && can('products.read')) {
      server.registerTool('search_products', {
        title: 'Buscar productos',
        description: 'Busca productos activos por nombre o SKU. Devuelve hasta 50 coincidencias y sus categorías.',
        inputSchema: {
          query: z.string().trim().min(1).max(120).describe('Nombre o SKU a buscar'),
        },
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      }, async ({ query }) => {
        const products = await this.prisma.products.findMany({
          where: {
            deleted_at: null,
            active: true,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { sku: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 50,
          orderBy: { name: 'asc' },
          select: {
            id: true, name: true, sku: true, product_type: true, usage_type: true,
            manages_stock: true, current_cost: true, current_cost_currency_id: true,
            product_categories: {
              where: { deleted_at: null }, take: 5,
              select: { categories: { select: { id: true, name: true } } },
            },
          },
        });
        return textResult(products.map((product) => ({
          ...product,
          categories: product.product_categories.map((item) => item.categories),
          product_categories: undefined,
        })));
      });
    }

    if (identity.scopes.includes('erp:read') && can('stock.read')) {
      server.registerTool('get_stock', {
        title: 'Consultar existencias',
        description: 'Consulta existencias y reservas por depósito, con búsqueda acotada a 50 productos.',
        inputSchema: { query: z.string().trim().min(1).max(120).describe('Nombre o SKU del producto') },
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      }, async ({ query }) => {
        const rows = await this.prisma.warehouse_stock.findMany({
          where: {
            deleted_at: null,
            products: {
              deleted_at: null,
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } },
              ],
            },
            warehouses: { deleted_at: null, active: true },
          },
          take: 200,
          orderBy: [{ products: { name: 'asc' } }, { warehouses: { name: 'asc' } }],
          select: {
            quantity: true, reserved_quantity: true,
            products: { select: { id: true, name: true, sku: true } },
            warehouses: { select: { id: true, name: true, code: true } },
          },
        });
        return textResult(rows.map((row) => ({
          product: row.products,
          warehouse: row.warehouses,
          quantity: row.quantity,
          reservedQuantity: row.reserved_quantity,
          available: Number(row.quantity) - Number(row.reserved_quantity),
        })));
      });
    }

    if (identity.scopes.includes('erp:read') && can('business_parties.read')) {
      server.registerTool('search_parties', {
        title: 'Buscar clientes y proveedores',
        description: 'Busca terceros activos por nombre, razón social o CUIT. Devuelve hasta 50 coincidencias.',
        inputSchema: { query: z.string().trim().min(1).max(120).describe('Nombre, razón social o CUIT') },
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      }, async ({ query }) => {
        const parties = await this.prisma.business_parties.findMany({
          where: {
            deleted_at: null,
            active: true,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { business_names: { contains: query, mode: 'insensitive' } },
              { tax_id: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 50,
          orderBy: { name: 'asc' },
          select: { id: true, type: true, name: true, business_names: true, document_type: true, tax_id: true, vat_condition: true },
        });
        return textResult(parties);
      });
    }

    const purchaseReadCategories = await this.documentAccess.allowedCategories(identity.userId, identity.companyRole, 'purchases', 'read');
    if (identity.scopes.includes('erp:read') && (purchaseReadCategories === undefined || purchaseReadCategories.length > 0)) {
      server.registerTool('search_purchase_documents', {
        title: 'Buscar documentos de compra',
        description: 'Busca facturas, órdenes y otros documentos del circuito de compras que el usuario tenga permiso para leer.',
        inputSchema: {
          query: z.string().trim().max(120).optional().describe('Nombre del proveedor, descripción o referencia'),
          limit: z.number().int().min(1).max(50).optional().describe('Máximo de resultados; valor predeterminado 20'),
        },
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      }, async ({ query, limit }) => {
        const rows = await this.searchDocuments(-1, query, limit, purchaseReadCategories);
        return textResult(rows);
      });
    }

    const salesReadCategories = await this.documentAccess.allowedCategories(identity.userId, identity.companyRole, 'sales', 'read');
    if (identity.scopes.includes('erp:read') && (salesReadCategories === undefined || salesReadCategories.length > 0)) {
      server.registerTool('search_sales_documents', {
        title: 'Buscar documentos de venta',
        description: 'Busca facturas, órdenes y otros documentos del circuito de ventas que el usuario tenga permiso para leer.',
        inputSchema: {
          query: z.string().trim().max(120).optional().describe('Nombre del cliente, descripción o referencia'),
          limit: z.number().int().min(1).max(50).optional().describe('Máximo de resultados; valor predeterminado 20'),
        },
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      }, async ({ query, limit }) => {
        const rows = await this.searchDocuments(1, query, limit, salesReadCategories);
        return textResult(rows);
      });
    }

    if (identity.scopes.includes('intake:files.read') && can('intake.read') && can('media.read')) {
      server.registerTool('list_invoice_uploads', {
        title: 'Ver facturas cargadas para procesar',
        description: 'Lista capturas y archivos que el usuario creó o tiene asignados. Para que la IA lea un comprobante, usá read_invoice_file con el intake_id y file_id. El archivo se mantiene guardado en Asterisk Suite.',
        inputSchema: {
          query: z.string().trim().max(120).optional().describe('Texto para filtrar por título o notas'),
          limit: z.number().int().min(1).max(30).optional().describe('Máximo de capturas; valor predeterminado 20'),
        },
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      }, async ({ query, limit }) => textResult(await this.listInvoiceUploads(identity, query, limit)));

      server.registerTool('read_invoice_file', {
        title: 'Leer archivo de una factura cargada',
        description: 'Entrega el original de una captura accesible para que la IA pueda leerlo. Admite imágenes y PDF de hasta 5 MB; no altera el archivo ni la captura.',
        inputSchema: {
          intake_id: z.string().uuid().describe('ID de captura devuelto por list_invoice_uploads'),
          file_id: z.string().uuid().describe('ID del archivo adjunto a esa captura'),
        },
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      }, async ({ intake_id, file_id }) => {
        const { mimeType, fileName, buffer } = await this.readIntakeFile(identity, intake_id, file_id);
        const data = buffer.toString('base64');
        const uri = `asterisk://intakes/${intake_id}/files/${file_id}`;
        return {
          content: [
            { type: 'text', text: `Archivo original: ${fileName}. Extraé únicamente datos legibles y señalá cualquier duda.` },
            mimeType.startsWith('image/')
              ? { type: 'image', mimeType, data }
              : { type: 'resource', resource: { uri, mimeType, blob: data, _meta: { fileName } } },
          ],
        };
      });

      const template = new ResourceTemplate('asterisk://intakes/{intakeId}/files/{fileId}', { list: undefined });
      server.registerResource('invoice-upload-file', template, {
        description: 'Archivo original adjunto a una captura de la empresa conectada. Solo se entrega si el usuario tiene acceso a la captura.',
      }, async (uri, variables) => {
        const intakeId = String(variables.intakeId);
        const fileId = String(variables.fileId);
        const { mimeType, fileName, buffer } = await this.readIntakeFile(identity, intakeId, fileId);
        return {
          contents: [{ uri: uri.href, mimeType, blob: buffer.toString('base64'), _meta: { fileName } }],
        };
      });
    }

    const purchaseCreateCategories = await this.documentAccess.allowedCategories(identity.userId, identity.companyRole, 'purchases', 'create');
    const canCreateInvoice = identity.scopes.includes('purchases:drafts.write')
      && (purchaseCreateCategories === undefined || purchaseCreateCategories.includes('INVOICE'))
      && can('intake.process');
    if (canCreateInvoice) {
      server.registerTool('list_purchase_invoice_types', {
        title: 'Ver tipos de factura de compra',
        description: 'Lista tipos activos de factura de compra que el usuario puede crear.',
        inputSchema: {},
        annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      }, async () => {
        const types = await this.prisma.document_types.findMany({
          where: { direction: -1, category: 'INVOICE', active: true, deleted_at: null },
          select: { id: true, code: true, description: true, letter_type: true, document_sequences: { select: { id: true, name: true } } },
          orderBy: { description: 'asc' },
        });
        const allowed: typeof types = [];
        for (const type of types) {
          try {
            await this.documentAccess.assertDocumentType(identity.userId, identity.companyRole, 'purchases', type.id, 'create');
            allowed.push(type);
          } catch (error) {
            if (!(error instanceof ForbiddenException)) throw error;
          }
        }
        return textResult(allowed);
      });

      server.registerTool('create_purchase_invoice_draft', {
        title: 'Crear borrador de factura de compra',
      description: 'Crea una factura de compra en BORRADOR, adjunta los archivos de una captura y la marca como procesada. No confirma el comprobante ni genera pagos o movimientos de stock. Guarda el detalle completo leído en las notas de la captura, ya que los renglones del ERP se asocian a productos; revisá el borrador y el original antes de confirmar.',
        inputSchema: {
          intake_id: z.string().uuid().describe('ID de una captura propia o asignada, listada previamente por list_invoice_uploads'),
          document_type_id: z.string().uuid().describe('Tipo de factura devuelto por list_purchase_invoice_types'),
          supplier_id: z.string().uuid().describe('ID del proveedor devuelto por search_parties'),
          invoice_date: z.string().date().describe('Fecha de emisión YYYY-MM-DD'),
          invoice_number: z.string().trim().min(1).max(50).describe('Número que figura en la factura del proveedor'),
          currency_code: z.string().trim().min(3).max(10).default('ARS').describe('Moneda del comprobante, por ejemplo ARS o USD'),
          supplier_total: z.number().positive().optional().describe('Total final leído del comprobante; queda en borrador para revisar'),
          description: z.string().trim().max(500).optional().describe('Concepto breve extraído del comprobante'),
          items: z.array(z.object({
            product_id: z.string().uuid().optional().describe('Producto asociado, si se identificó con certeza'),
            description: z.string().trim().min(1).max(255).optional().describe('Descripción del renglón para guiar la revisión'),
            quantity: z.number().positive(),
            unit_price: z.number().min(0),
            discount_percentage: z.number().min(0).max(100).optional(),
          })).min(1).max(100).describe('Renglones extraídos. No inventes datos que no sean legibles.'),
        },
        annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
      }, async (input) => textResult(await this.createPurchaseInvoiceDraft(identity, input)));
    }

    return server;
  }

  private async searchDocuments(
    direction: number,
    query?: string,
    limit = 20,
    allowedCategories?: string[],
  ) {
    const take = Math.min(50, Math.max(1, limit ?? 20));
    return this.prisma.documents.findMany({
      where: {
        deleted_at: null,
        document_types: {
          direction,
          ...(allowedCategories === undefined ? {} : { category: { in: allowedCategories } }),
        },
        ...(query ? {
          OR: [
            { ref: { contains: query, mode: 'insensitive' } },
            { descrip: { contains: query, mode: 'insensitive' } },
            { business_parties: { name: { contains: query, mode: 'insensitive' } } },
            { business_parties: { business_names: { contains: query, mode: 'insensitive' } } },
          ],
        } : {}),
      },
      take,
      orderBy: [{ date: 'desc' }, { created_at: 'desc' }],
      select: {
        id: true, number: true, ref: true, date: true, status: true, currency_code: true,
        subtotal: true, total_taxes: true, total: true, paid_amount: true, descrip: true,
        document_types: { select: { code: true, description: true, category: true, direction: true } },
        business_parties: { select: { id: true, name: true, business_names: true, tax_id: true } },
      },
    });
  }

  private async listInvoiceUploads(identity: McpIdentity, query?: string, limit = 20) {
    const records = await this.prisma.intake_records.findMany({
      where: {
        deleted_at: null,
        AND: [
          { OR: [{ created_by: identity.userId }, { assigned_to: identity.userId }] },
          ...(query ? [{ OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { notes: { contains: query, mode: 'insensitive' as const } },
          ] }] : []),
        ],
      },
      take: Math.min(30, Math.max(1, limit ?? 20)),
      orderBy: { created_at: 'desc' },
      select: { id: true, title: true, notes: true, suggested_type: true, status: true, created_at: true },
    });
    const filtered = query
      ? records.filter((record) => `${record.title ?? ''} ${record.notes ?? ''}`.toLowerCase().includes(query.toLowerCase()))
      : records;
    if (!filtered.length) return [];
    const attachments = await this.prisma.entity_photos.findMany({
      where: { entity_type: 'intake', entity_id: { in: filtered.map((record) => record.id) }, deleted_at: null },
      select: { entity_id: true, file_id: true, photo_type: true, files: { select: { file_name: true, mime_type: true, file_size: true } } },
      take: Math.min(100, filtered.length * 10),
      orderBy: { created_at: 'desc' },
    });
    return filtered.map((record) => ({
      ...record,
      files: attachments.filter((file) => file.entity_id === record.id).map((file) => ({
        file_name: file.files.file_name,
        mime_type: file.files.mime_type,
        file_size: file.files.file_size,
        file_uri: `asterisk://intakes/${record.id}/files/${file.file_id}`,
      })),
    }));
  }

  private async readIntakeFile(identity: McpIdentity, intakeId: string, fileId: string) {
    if (this.activeFileReads >= MAX_CONCURRENT_MCP_FILE_READS) {
      throw new Error('Hay varias lecturas de comprobantes en curso; intentá de nuevo en unos segundos.');
    }
    this.activeFileReads += 1;
    try {
      const [intake, attachment] = await Promise.all([
        this.prisma.intake_records.findFirst({
          where: { id: intakeId, deleted_at: null, OR: [{ created_by: identity.userId }, { assigned_to: identity.userId }] },
          select: { id: true },
        }),
        this.prisma.entity_photos.findFirst({
          where: { entity_type: 'intake', entity_id: intakeId, file_id: fileId, deleted_at: null },
          select: { file_id: true },
        }),
      ]);
      if (!intake || !attachment) throw new NotFoundException('El archivo no está disponible en una captura a la que tengas acceso');
      const stored = await this.files.getStoredFile(fileId, 'original');
      if (!stored?.filePath) throw new NotFoundException('No se encontró el archivo original');
      const metadata = await stat(stored.filePath);
      if (metadata.size > MAX_MCP_FILE_BYTES) throw new Error('El archivo supera 5 MB. Subí una versión comprimida para poder leerla desde la conexión de IA.');
      const mimeType = stored.record.mime_type || 'application/octet-stream';
      if (mimeType !== 'application/pdf' && !mimeType.startsWith('image/')) {
        throw new Error('El archivo no es un PDF ni una imagen compatible.');
      }
      return { mimeType, fileName: stored.record.file_name || 'comprobante', buffer: await readFile(stored.filePath) };
    } finally {
      this.activeFileReads -= 1;
    }
  }

  private async createPurchaseInvoiceDraft(
    identity: McpIdentity,
    input: {
      intake_id: string;
      document_type_id: string;
      supplier_id: string;
      invoice_date: string;
      invoice_number: string;
      currency_code: string;
      supplier_total?: number;
      description?: string;
      items: Array<{ product_id?: string; description?: string; quantity: number; unit_price: number; discount_percentage?: number }>;
    },
  ) {
    await this.documentAccess.assertDocumentType(identity.userId, identity.companyRole, 'purchases', input.document_type_id, 'create');
    const [intake, supplier, attachments] = await Promise.all([
      this.prisma.intake_records.findFirst({ where: { id: input.intake_id, deleted_at: null }, select: { id: true, status: true, notes: true, created_by: true, assigned_to: true, target_type: true, target_id: true } }),
      this.prisma.business_parties.findFirst({ where: { id: input.supplier_id, deleted_at: null, active: true }, select: { id: true, type: true } }),
      this.prisma.entity_photos.findMany({ where: { entity_type: 'intake', entity_id: input.intake_id, deleted_at: null }, select: { file_id: true, photo_type: true } }),
    ]);
    if (!intake || (intake.created_by !== identity.userId && intake.assigned_to !== identity.userId)) {
      throw new NotFoundException('No se encontró una captura propia o asignada');
    }
    if (!supplier || !['SUPPLIER', 'SERVICE_PROVIDER'].includes(supplier.type)) {
      throw new NotFoundException('El tercero seleccionado no es un proveedor activo');
    }
    if (intake.status === 'COMPLETED' && intake.target_type === 'PURCHASE_DOCUMENT' && intake.target_id) {
      const existing = await this.prisma.documents.findFirst({ where: { id: intake.target_id, deleted_at: null }, select: { id: true, number: true, status: true, total: true, currency_code: true } });
      if (existing) return { already_created: true, document: existing };
    }
    if (!['DRAFT', 'SENT', 'IN_PROGRESS'].includes(intake.status)) throw new Error('La captura ya fue procesada o no está disponible.');
    if (!attachments.length) throw new Error('La captura no tiene ningún archivo adjunto.');

    const currencyCode = input.currency_code.trim().toUpperCase();
    const extractedLineDescriptions = input.items
      .map((item, index) => item.description?.trim() ? `${index + 1}) ${item.description.trim()} (${item.quantity} × ${item.unit_price})` : null)
      .filter((description): description is string => Boolean(description));
    const documentDescription = [
      (input.description?.trim() || `Factura de proveedor ${input.invoice_number}`).slice(0, 220),
      extractedLineDescriptions.length ? `Detalle OCR: ${extractedLineDescriptions.join('; ')}` : '',
    ].filter(Boolean).join(' · ').slice(0, 500);
    const fullExtractedDetails = input.items.map((item, index) => [
      `${index + 1}. ${item.description?.trim() || 'Renglón sin descripción legible'}`,
      `Cantidad: ${item.quantity}`,
      `Precio unitario: ${item.unit_price} ${currencyCode}`,
      item.discount_percentage ? `Descuento: ${item.discount_percentage}%` : '',
    ].filter(Boolean).join(' | ')).join('\n');
    const dto = {
      document_type_id: input.document_type_id,
      party_id: input.supplier_id,
      date: input.invoice_date,
      currency_code: currencyCode,
      ref: input.invoice_number,
      descrip: documentDescription,
      supplier_total: input.supplier_total,
      items: input.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_percentage: item.discount_percentage ?? 0,
      })),
    };

    const document = await this.prisma.$transaction(async (tx) => {
      const created = await this.purchases.create(dto, identity.userId, tx);
      await tx.entity_photos.createMany({
        data: attachments.map((attachment) => ({
          entity_type: 'document', entity_id: created.id, file_id: attachment.file_id,
          photo_type: attachment.photo_type, created_by: identity.userId,
        })),
      });
      const completed = await tx.intake_records.updateMany({
        where: { id: intake.id, status: { in: ['DRAFT', 'SENT', 'IN_PROGRESS'] }, deleted_at: null },
        data: {
          status: 'COMPLETED', target_type: 'PURCHASE_DOCUMENT', target_id: created.id,
          notes: [intake.notes?.trim(), `Detalle leído por IA para revisar:\n${fullExtractedDetails}`].filter(Boolean).join('\n\n'),
          completed_at: new Date(), completed_by: identity.userId, updated_by: identity.userId,
        },
      });
      if (completed.count !== 1) throw new Error('La captura cambió de estado; no se guardó la factura. Volvé a cargarla e intentá de nuevo.');
      return created;
    });
    return {
      already_created: false,
      document: { id: document.id, number: document.number, status: document.status, total: document.total, currency_code: document.currency_code },
      message: 'Borrador creado con los archivos originales asociados. El detalle completo leído por IA quedó en las notas de la captura; el documento conserva las líneas vinculadas a productos. Revisá proveedor, fecha, líneas, impuestos y original antes de confirmarlo.',
    };
  }
}
