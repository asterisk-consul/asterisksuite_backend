import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type { ExtendedPrismaClient } from '@/prisma/prisma.service';
import * as XLSX from 'xlsx';
import type { ExportSalesProductsReportDto, SalesProductsReportDetailDto, SalesProductsReportDto } from './dto/sales-products-report.dto';

const BATCH_SIZE = 100;
const DEFAULT_STATUSES = [1, 4, 5, 7];
const MAX_EXPORT_ROWS = 25_000;

const SALES_PRODUCTS_SELECT = {
  id: true,
  number: true,
  date: true,
  status: true,
  total: true,
  currency_code: true,
  business_parties: { select: { name: true } },
  document_sequences: { select: { point_of_sale: true, prefix: true } },
  document_items: {
    where: { deleted_at: null },
    orderBy: [{ created_at: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      product_id: true,
      variant_id: true,
      quantity: true,
      price: true,
      unit_price: true,
      currency_code: true,
      products: {
        select: {
          id: true,
          name: true,
          sku: true,
          product_categories: {
            where: { deleted_at: null, categories: { deleted_at: null } },
            select: { categories: { select: { id: true, name: true, parent_id: true } } },
          },
        },
      },
      product_variants: { select: { name: true } },
      document_item_taxes: { where: { deleted_at: null }, select: { tax_amount: true, taxes: { select: { tax_type: true } } } },
    },
  },
} satisfies Prisma.documentsSelect;

type SalesProductsDocument = Prisma.documentsGetPayload<{ select: typeof SALES_PRODUCTS_SELECT }>;
type CategoryNode = { id: string; name: string; parent_id: string | null };
type Range = { from: Date; to: Date };
type ProductAmounts = {
  key: string;
  product_key: string;
  product_id: string | null;
  product_name: string;
  sku: string;
  document_count: number;
  line_count: number;
  quantity: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  vat: Prisma.Decimal;
  line_total: Prisma.Decimal;
};
type GroupAmounts = {
  key: string;
  label: string;
  path: string;
  document_count: number;
  line_count: number;
  product_count: number;
  quantity: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  vat: Prisma.Decimal;
  line_total: Prisma.Decimal;
  products: Set<string>;
  product_rows: Map<string, ProductAmounts>;
};
type CurrencyAmounts = {
  currency_code: string;
  document_count: number;
  line_count: number;
  quantity: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  vat: Prisma.Decimal;
  line_total: Prisma.Decimal;
  document_total: Prisma.Decimal;
  categories: Map<string, GroupAmounts>;
  points_of_sale: Map<string, GroupAmounts>;
};
type CompanyAmounts = {
  company_id: string;
  company_name: string;
  subdomain: string;
  currencies: Map<string, CurrencyAmounts>;
};
type MovementRow = {
  id: string;
  company_id: string;
  company_name: string;
  currency_code: string;
  date: string;
  document_id: string;
  document_reference: string;
  document_status: number;
  party_name: string;
  point_of_sale: string;
  product_id: string | null;
  product_key: string;
  product_name: string;
  sku: string;
  category_key: string;
  category: string;
  category_path: string;
  quantity: string;
  unit_price: string;
  subtotal: string;
  vat: string;
  unit_price_with_vat: string;
  line_total: string;
};

@Injectable()
export class SalesProductsReportService {
  constructor(private readonly db: PrismaService) {}

  async getSummary(dto: SalesProductsReportDto, userId: string) {
    return this.buildSummary(dto, userId);
  }

  private async buildSummary(dto: SalesProductsReportDto, userId: string, onMovement?: (row: MovementRow) => void) {
    const range = this.parseRange(dto.date_from, dto.date_to);
    const memberships = await this.getMemberships(dto.company_ids, userId);
    const serializedCompanies: ReturnType<SalesProductsReportService['serializeCompany']>[] = [];
    const totals = new Map<string, CurrencyAmounts>();

    // Recorre cada tenant y cada lote en secuencia para mantener bajo el uso de pools y memoria.
    for (const membership of memberships) {
      const { id, name, subdomain } = membership.company;
      const company = await this.db.withTemporaryTenantClient(`${subdomain}_db`, client =>
        this.aggregateCompany(client, id, name, subdomain, range, dto.ov_statuses ?? DEFAULT_STATUSES, dto.search?.trim() ?? '', onMovement),
      );
      serializedCompanies.push(this.serializeCompany(company));
      this.mergeCompany(totals, company);
    }

    serializedCompanies.sort((a, b) => a.company_name.localeCompare(b.company_name, 'es'));
    return {
      generated_at: new Date().toISOString(),
      period: { from: dto.date_from, to: dto.date_to },
      criteria: {
        ov_statuses: dto.ov_statuses ?? DEFAULT_STATUSES,
        amount_basis: 'El neto corresponde a document_items.price. El IVA suma solo los impuestos de tipo IVA guardados en cada renglón; si no hay impuesto IVA registrado, se informa cero.',
        currency: 'Cada moneda se presenta por separado y no se convierte.',
        quantity: 'Se usa la cantidad del renglón de la OV, independientemente de lo entregado.',
      },
      companies: serializedCompanies,
      totals: this.serializeCurrencyRows(totals),
    };
  }

  async getDetail(dto: SalesProductsReportDetailDto, userId: string) {
    if (!dto.company_ids.includes(dto.company_id)) throw new BadRequestException('La empresa del detalle debe estar seleccionada en el reporte.');
    const range = this.parseRange(dto.date_from, dto.date_to);
    const [membership] = await this.getMemberships([dto.company_id], userId);
    return this.db.withTemporaryTenantClient(`${membership.company.subdomain}_db`, async client => {
      const categories = await this.getCategoryTree(client);
      const offset = (dto.page - 1) * dto.page_size;
      const rows: MovementRow[] = [];
      let total_rows = 0;
      const productFilter = dto.group_type === 'PRODUCT' ? this.productItemFilter(dto.group_key) : undefined;
      await this.visitDocuments(client, range, dto.ov_statuses ?? DEFAULT_STATUSES, async document => {
        const context = this.documentContext(document, categories);
        const { matched, directDocumentMatch } = this.matchDocument(document, context.pointOfSale, membership.company.name, dto.search?.trim() ?? '');
        const items = document.document_items.filter(item => directDocumentMatch || this.matchItem(item, context, dto.search?.trim() ?? ''));
        if (!matched && !items.length) return;
        for (const item of items) {
          const row = this.toMovement(document, item, context, membership.company.id, membership.company.name);
          if (row.currency_code !== dto.currency_code) continue;
          if (!this.matchesGroup(row, dto.group_type, dto.group_key)) continue;
          if (!directDocumentMatch && !this.matchItem(item, context, dto.search?.trim() ?? '')) continue;
          if (total_rows >= offset && rows.length < dto.page_size) rows.push(row);
          total_rows++;
        }
      }, productFilter);
      return {
        company: { id: membership.company.id, name: membership.company.name },
        group_type: dto.group_type,
        group_key: dto.group_key,
        currency_code: dto.currency_code,
        page: dto.page,
        page_size: dto.page_size,
        total_rows,
        items: rows,
      };
    });
  }

  async export(dto: ExportSalesProductsReportDto, userId: string) {
    const movementRows: Record<string, unknown>[] = [];
    const summary = await this.buildSummary(dto, userId, row => {
      if (movementRows.length >= MAX_EXPORT_ROWS) throw new BadRequestException(`El Excel supera ${MAX_EXPORT_ROWS.toLocaleString('es-AR')} renglones. Acotá el período o la búsqueda.`);
      movementRows.push({
        Empresa: row.company_name, Fecha: row.date, OV: row.document_reference, 'UUID OV': row.document_id,
        Cliente: row.party_name, Estado: row.document_status, Punto_de_venta: row.point_of_sale,
        Producto: row.product_name, SKU: row.sku, 'UUID renglón': row.id, Categoría: row.category_path,
        Cantidad: Number(row.quantity), Moneda: row.currency_code, 'Precio unitario neto': Number(row.unit_price),
        Neto: Number(row.subtotal), IVA: Number(row.vat), 'Precio unitario con IVA': Number(row.unit_price_with_vat),
        'Total renglón con IVA': Number(row.line_total),
      });
    });

    const workbook = XLSX.utils.book_new();
    const summaryRows = (summary.companies as Array<any>).flatMap(company => company.currencies.map((currency: any) => ({
      Empresa: company.company_name, Moneda: currency.currency_code, OVs: currency.document_count, Renglones: currency.line_count,
      Neto: Number(currency.subtotal), IVA: Number(currency.vat), 'Total de renglones': Number(currency.line_total),
      'Total de OV': Number(currency.document_total), Diferencia: Number(currency.document_difference),
    })));
    this.appendSheet(workbook, 'Resumen', summaryRows, [28, 12, 10, 12, 20, 18, 22, 20, 18]);
    const consolidatedRows = (summary.totals as Array<any>).map(currency => ({
      Moneda: currency.currency_code, OVs: currency.document_count, Renglones: currency.line_count,
      Neto: Number(currency.subtotal), IVA: Number(currency.vat), 'Total de renglones': Number(currency.line_total),
      'Total de OV': Number(currency.document_total), Diferencia: Number(currency.document_difference),
    }));
    this.appendSheet(workbook, 'Consolidado', consolidatedRows, [12, 10, 12, 20, 18, 22, 20, 18]);
    const categoryRows = (summary.companies as Array<any>).flatMap(company => company.currencies.flatMap((currency: any) => currency.categories.map((row: any) => ({
      Empresa: company.company_name, Moneda: currency.currency_code, Categoría: row.category, Ruta: row.category_path,
      Productos: row.product_count, OVs: row.document_count, Renglones: row.line_count, Unidades: Number(row.quantity),
      Neto: Number(row.subtotal), IVA: Number(row.vat), Total: Number(row.line_total), '%': Number(row.percent_of_company_total),
    }))));
    this.appendSheet(workbook, 'Categorías', categoryRows, [28, 12, 28, 48, 12, 10, 12, 15, 20, 18, 22, 12]);
    const pointRows = (summary.companies as Array<any>).flatMap(company => company.currencies.flatMap((currency: any) => currency.points_of_sale.map((row: any) => ({
      Empresa: company.company_name, Moneda: currency.currency_code, 'Punto de venta': row.point_of_sale,
      OVs: row.document_count, Renglones: row.line_count, Unidades: Number(row.quantity), Neto: Number(row.subtotal),
      IVA: Number(row.vat), Total: Number(row.line_total), '%': Number(row.percent_of_company_total),
    }))));
    this.appendSheet(workbook, 'Puntos de venta', pointRows, [28, 12, 18, 10, 12, 15, 20, 18, 22, 12]);
    this.appendSheet(workbook, 'Movimientos', movementRows, [28, 14, 24, 38, 32, 16, 16, 38, 18, 38, 38, 15, 12, 22, 20, 18, 24, 24]);
    const reconciliationRows = summaryRows.map(row => ({
      Empresa: row.Empresa, Moneda: row.Moneda, 'Total de cabeceras OV': row['Total de OV'],
      'Total de renglones': row['Total de renglones'], Diferencia: row.Diferencia,
      Criterio: 'Cabeceras únicas de OV menos suma de los renglones filtrados. Puede incluir IVA no detallado en el renglón, conceptos o renglones fuera de la búsqueda.',
    }));
    this.appendSheet(workbook, 'Conciliación', reconciliationRows, [28, 12, 22, 22, 18, 75]);
    const info = XLSX.utils.aoa_to_sheet([
      ['Reporte de productos vendidos por empresa'], ['Desde', dto.date_from], ['Hasta', dto.date_to],
      ['Estados de OV', (dto.ov_statuses ?? DEFAULT_STATUSES).join(', ')], ['Búsqueda', dto.search?.trim() || 'Sin filtro'],
      ['Cantidad', 'Tomada del renglón de la OV; no se usa lo entregado.'],
      ['Importes', 'Neto = document_items.price. IVA = impuestos de tipo IVA registrados en document_item_taxes; si no hay detalle, IVA = 0. No se infiere.'],
      ['Diferencia', 'Total de la OV menos el total de sus renglones según importes registrados.'],
      ['Monedas', 'Se mantienen separadas; no se convierten ni se mezclan.'],
    ]);
    info['!cols'] = [{ wch: 25 }, { wch: 100 }];
    XLSX.utils.book_append_sheet(workbook, info, 'Criterios');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
    return {
      filename: `productos-vendidos-empresas-${dto.date_from}-${dto.date_to}.xlsx`,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer,
    };
  }

  private async aggregateCompany(
    client: ExtendedPrismaClient,
    companyId: string,
    companyName: string,
    subdomain: string,
    range: Range,
    statuses: number[],
    search: string,
    onMovement?: (row: MovementRow) => void,
  ): Promise<CompanyAmounts> {
    const company: CompanyAmounts = { company_id: companyId, company_name: companyName, subdomain, currencies: new Map() };
    const categories = await this.getCategoryTree(client);
    await this.visitDocuments(client, range, statuses, async document => {
      const context = this.documentContext(document, categories);
      const { matched, directDocumentMatch } = this.matchDocument(document, context.pointOfSale, companyName, search);
      const items = document.document_items.filter(item => directDocumentMatch || this.matchItem(item, context, search));
      if (!matched && !items.length) return;

      const documentCurrency = this.currency(document.currency_code);
      const header = this.getCurrency(company, documentCurrency);
      header.document_count++;
      header.document_total = header.document_total.plus(document.total);
      const visitedCategories = new Set<string>();
      const visitedPoints = new Set<string>();
      const visitedProducts = new Set<ProductAmounts>();
      for (const item of items) {
        if (!directDocumentMatch && !this.matchItem(item, context, search)) continue;
        const currencyCode = this.currency(item.currency_code ?? document.currency_code);
        const currency = this.getCurrency(company, currencyCode);
        const row = this.toMovement(document, item, context, companyId, companyName);
        onMovement?.(row);
        const subtotal = new Prisma.Decimal(row.subtotal);
        const vat = new Prisma.Decimal(row.vat);
        const total = new Prisma.Decimal(row.line_total);
        const quantity = new Prisma.Decimal(row.quantity);
        currency.line_count++;
        currency.quantity = currency.quantity.plus(quantity);
        currency.subtotal = currency.subtotal.plus(subtotal);
        currency.vat = currency.vat.plus(vat);
        currency.line_total = currency.line_total.plus(total);

        const category = this.categoryFor(item, context.categories);
        const categoryGroup = this.getGroup(currency.categories, category.key, category.label, category.path);
        categoryGroup.line_count++;
        categoryGroup.quantity = categoryGroup.quantity.plus(quantity);
        categoryGroup.subtotal = categoryGroup.subtotal.plus(subtotal);
        categoryGroup.vat = categoryGroup.vat.plus(vat);
        categoryGroup.line_total = categoryGroup.line_total.plus(total);
        categoryGroup.products.add(row.product_key);
        const productGroup = this.getProductGroup(categoryGroup, row);
        productGroup.line_count++;
        productGroup.quantity = productGroup.quantity.plus(quantity);
        productGroup.subtotal = productGroup.subtotal.plus(subtotal);
        productGroup.vat = productGroup.vat.plus(vat);
        productGroup.line_total = productGroup.line_total.plus(total);
        visitedProducts.add(productGroup);
        visitedCategories.add(`${currencyCode}|${category.key}`);

        const pointKey = `POINT_OF_SALE:${context.pointOfSale || '__NO_POINT_OF_SALE__'}`;
        const pointGroup = this.getGroup(currency.points_of_sale, pointKey, context.pointOfSale || 'Sin punto de venta', context.pointOfSale || 'Sin punto de venta');
        pointGroup.line_count++;
        pointGroup.quantity = pointGroup.quantity.plus(quantity);
        pointGroup.subtotal = pointGroup.subtotal.plus(subtotal);
        pointGroup.vat = pointGroup.vat.plus(vat);
        pointGroup.line_total = pointGroup.line_total.plus(total);
        pointGroup.products.add(row.product_key);
        visitedPoints.add(`${currencyCode}|${pointKey}`);
      }
      for (const value of visitedCategories) {
        const [currencyCode, key] = value.split('|');
        const group = this.getCurrency(company, currencyCode).categories.get(key)!;
        group.document_count++;
        group.product_count = group.products.size;
      }
      for (const value of visitedPoints) {
        const [currencyCode, key] = value.split('|');
        const group = this.getCurrency(company, currencyCode).points_of_sale.get(key)!;
        group.document_count++;
      }
      for (const product of visitedProducts) product.document_count++;
    });
    return company;
  }

  private async visitDocuments(
    client: ExtendedPrismaClient,
    range: Range,
    statuses: number[],
    visitor: (document: SalesProductsDocument) => Promise<void>,
    productFilter?: { product_id?: string | null; variant_id?: string | null },
  ) {
    const where: Prisma.documentsWhereInput = {
      deleted_at: null,
      date: { gte: range.from, lt: range.to },
      status: { in: statuses },
      document_types: { category: 'ORDER', direction: 1 },
      ...(productFilter ? { document_items: { some: { deleted_at: null, ...productFilter } } } : {}),
    };
    let cursor: string | undefined;
    while (true) {
      const batch = await client.documents.findMany({
        where,
        select: SALES_PRODUCTS_SELECT,
        orderBy: [{ date: 'asc' }, { id: 'asc' }],
        take: BATCH_SIZE,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      if (!batch.length) break;
      for (const document of batch) await visitor(document);
      if (batch.length < BATCH_SIZE) break;
      cursor = batch[batch.length - 1].id;
    }
  }

  private productItemFilter(groupKey: string) {
    if (groupKey === 'PRODUCT:FREE:sin producto') return { product_id: null, variant_id: null };
    const match = /^(PRODUCT|VARIANT):([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(groupKey);
    if (!match) throw new BadRequestException('El artículo solicitado no tiene una clave válida. Volvé a generar el reporte.');
    return match[1] === 'PRODUCT' ? { product_id: match[2] } : { variant_id: match[2] };
  }

  private async getCategoryTree(client: ExtendedPrismaClient) {
    const rows = await client.categories.findMany({
      where: { deleted_at: null },
      select: { id: true, name: true, parent_id: true },
    });
    return new Map<string, CategoryNode>(rows.map(row => [row.id, row as CategoryNode] as const));
  }

  private documentContext(document: SalesProductsDocument, categories: Map<string, CategoryNode>) {
    return {
      pointOfSale: document.document_sequences?.point_of_sale?.trim() ?? '',
      categories,
    };
  }

  private categoryFor(item: SalesProductsDocument['document_items'][number], categories: Map<string, CategoryNode>) {
    if (!item.product_id || !item.products) return { key: 'CATEGORY:NO_PRODUCT', label: 'Sin producto', path: 'Sin producto' };
    const assigned = item.products.product_categories
      .map(row => row.categories)
      .filter((row): row is NonNullable<typeof row> => Boolean(row))
      .map(row => categories.get(row.id) ?? row);
    if (!assigned.length) return { key: 'CATEGORY:UNCATEGORIZED', label: 'Sin categoría', path: 'Sin categoría' };
    const paths = assigned.map(node => this.categoryPath(node, categories));
    if (paths.length === 1) {
      const node = paths[0][paths[0].length - 1];
      return { key: `CATEGORY:${node.id}`, label: node.name, path: paths[0].map(part => part.name).join(' / ') };
    }
    let commonLength = 0;
    while (paths.every(path => path[commonLength] && path[commonLength].id === paths[0][commonLength].id)) commonLength++;
    if (!commonLength) return { key: 'CATEGORY:REVIEW', label: 'Categoría por revisar', path: 'Categoría por revisar' };
    const common = paths[0].slice(0, commonLength);
    const node = common[common.length - 1];
    return { key: `CATEGORY:${node.id}`, label: node.name, path: common.map(part => part.name).join(' / ') };
  }

  private categoryPath(node: CategoryNode, categories: Map<string, CategoryNode>) {
    const path: CategoryNode[] = [];
    let current: CategoryNode | undefined = node;
    const seen = new Set<string>();
    while (current && !seen.has(current.id)) {
      seen.add(current.id);
      path.unshift(current);
      current = current.parent_id ? categories.get(current.parent_id) : undefined;
    }
    return path;
  }

  private matchDocument(document: SalesProductsDocument, pointOfSale: string, companyName: string, rawQuery: string) {
    const query = this.normalize(rawQuery);
    if (!query) return { matched: true, directDocumentMatch: true };
    const reference = this.documentReference(document);
    const total = new Prisma.Decimal(document.total ?? 0);
    const directDocumentMatch = this.includesAny(query, [
      companyName, document.id, String(document.number), reference, document.business_parties?.name,
      pointOfSale, document.currency_code, String(document.status), total.toFixed(2), this.formatAmount(total),
    ]);
    return { matched: directDocumentMatch, directDocumentMatch };
  }

  private matchItem(item: SalesProductsDocument['document_items'][number], context: { pointOfSale: string; categories: Map<string, CategoryNode> }, rawQuery: string) {
    const query = this.normalize(rawQuery);
    if (!query) return true;
    const row = this.toMovement({
      id: '', number: 0, date: new Date(0), status: 0, total: new Prisma.Decimal(0), currency_code: null,
      business_parties: null, document_sequences: null, document_items: [],
    } as unknown as SalesProductsDocument, item, context, '', '');
    return this.includesAny(query, [
      item.id, row.product_name, row.sku, row.category, row.category_path, row.currency_code,
      row.quantity, row.unit_price, row.subtotal, row.vat, row.unit_price_with_vat, row.line_total,
      this.formatAmount(new Prisma.Decimal(row.subtotal)), this.formatAmount(new Prisma.Decimal(row.vat)),
      this.formatAmount(new Prisma.Decimal(row.line_total)),
    ]);
  }

  private toMovement(
    document: SalesProductsDocument,
    item: SalesProductsDocument['document_items'][number],
    context: { pointOfSale: string; categories: Map<string, CategoryNode> },
    companyId: string,
    companyName: string,
  ): MovementRow {
    const currency = this.currency(item.currency_code ?? document.currency_code);
    const quantity = new Prisma.Decimal(item.quantity);
    const subtotal = new Prisma.Decimal(item.price);
    const vat = item.document_item_taxes.reduce((sum, tax) =>
      tax.taxes.tax_type?.toUpperCase() === 'IVA' ? sum.plus(tax.tax_amount) : sum,
    new Prisma.Decimal(0));
    const total = subtotal.plus(vat);
    const unitNet = quantity.isZero() ? new Prisma.Decimal(0) : subtotal.div(quantity);
    const unitGross = quantity.isZero() ? new Prisma.Decimal(0) : total.div(quantity);
    const category = this.categoryFor(item, context.categories);
    const productId = item.products?.id ?? item.product_id;
    const productName = item.products?.name ?? item.product_variants?.name ?? 'Sin producto';
    const productKey = productId
      ? `PRODUCT:${productId}`
      : item.variant_id
        ? `VARIANT:${item.variant_id}`
        : `PRODUCT:FREE:${this.normalize(productName)}`;
    return {
      id: item.id,
      company_id: companyId,
      company_name: companyName,
      currency_code: currency,
      date: document.date.toISOString().slice(0, 10),
      document_id: document.id,
      document_reference: this.documentReference(document),
      document_status: document.status,
      party_name: document.business_parties?.name ?? 'Sin cliente',
      point_of_sale: context.pointOfSale || 'Sin punto de venta',
      product_id: productId,
      product_key: productKey,
      product_name: productName,
      sku: item.products?.sku ?? '',
      category_key: category.key,
      category: category.label,
      category_path: category.path,
      quantity: quantity.toString(),
      unit_price: unitNet.toFixed(4),
      subtotal: subtotal.toFixed(2),
      vat: vat.toFixed(2),
      unit_price_with_vat: unitGross.toFixed(4),
      line_total: total.toFixed(2),
    };
  }

  private matchesGroup(row: MovementRow, groupType: SalesProductsReportDetailDto['group_type'], groupKey: string) {
    if (groupType === 'CATEGORY') return row.category_key === groupKey;
    if (groupType === 'PRODUCT') return row.product_key === groupKey;
    return `POINT_OF_SALE:${row.point_of_sale === 'Sin punto de venta' ? '__NO_POINT_OF_SALE__' : row.point_of_sale}` === groupKey;
  }

  private getCurrency(company: CompanyAmounts, currencyCode: string): CurrencyAmounts {
    let value = company.currencies.get(currencyCode);
    if (!value) {
      value = {
        currency_code: currencyCode,
        document_count: 0,
        line_count: 0,
        quantity: new Prisma.Decimal(0),
        subtotal: new Prisma.Decimal(0),
        vat: new Prisma.Decimal(0),
        line_total: new Prisma.Decimal(0),
        document_total: new Prisma.Decimal(0),
        categories: new Map(),
        points_of_sale: new Map(),
      };
      company.currencies.set(currencyCode, value);
    }
    return value;
  }

  private getGroup(target: Map<string, GroupAmounts>, key: string, label: string, path: string) {
    let group = target.get(key);
    if (!group) {
      group = {
        key, label, path, document_count: 0, line_count: 0, product_count: 0,
        quantity: new Prisma.Decimal(0), subtotal: new Prisma.Decimal(0), vat: new Prisma.Decimal(0),
        line_total: new Prisma.Decimal(0), products: new Set(), product_rows: new Map(),
      };
      target.set(key, group);
    }
    return group;
  }

  private getProductGroup(category: GroupAmounts, row: MovementRow) {
    let product = category.product_rows.get(row.product_key);
    if (!product) {
      product = {
        key: row.product_key,
        product_key: row.product_key,
        product_id: row.product_id,
        product_name: row.product_name,
        sku: row.sku,
        document_count: 0,
        line_count: 0,
        quantity: new Prisma.Decimal(0),
        subtotal: new Prisma.Decimal(0),
        vat: new Prisma.Decimal(0),
        line_total: new Prisma.Decimal(0),
      };
      category.product_rows.set(row.product_key, product);
    }
    return product;
  }

  private serializeCompany(company: CompanyAmounts) {
    return {
      company_id: company.company_id,
      company_name: company.company_name,
      subdomain: company.subdomain,
      currencies: this.serializeCurrencyRows(company.currencies),
    };
  }

  private serializeCurrencyRows(currencies: Map<string, CurrencyAmounts>) {
    return [...currencies.values()].sort((a, b) => a.currency_code.localeCompare(b.currency_code)).map(currency => {
      const toAmount = (value: Prisma.Decimal) => value.toFixed(2);
      const percent = (amount: Prisma.Decimal) => currency.line_total.isZero() ? '0.00' : amount.div(currency.line_total).mul(100).toFixed(2);
      const serializeGroup = (group: GroupAmounts, includeProducts = false) => ({
        key: group.key, category: group.label, category_path: group.path, point_of_sale: group.label,
        document_count: group.document_count, line_count: group.line_count, product_count: group.products.size,
        quantity: group.quantity.toString(), subtotal: toAmount(group.subtotal), vat: toAmount(group.vat),
        line_total: toAmount(group.line_total), percent_of_company_total: percent(group.line_total),
        ...(includeProducts ? {
          products: [...group.product_rows.values()]
            .sort((a, b) => b.line_total.comparedTo(a.line_total))
            .map(product => ({
              key: product.key,
              product_key: product.product_key,
              product_id: product.product_id,
              product_name: product.product_name,
              sku: product.sku,
              document_count: product.document_count,
              line_count: product.line_count,
              quantity: product.quantity.toString(),
              subtotal: toAmount(product.subtotal),
              vat: toAmount(product.vat),
              line_total: toAmount(product.line_total),
            })),
        } : {}),
      });
      const lineTotal = currency.line_total;
      return {
        currency_code: currency.currency_code,
        document_count: currency.document_count,
        line_count: currency.line_count,
        quantity: currency.quantity.toString(),
        subtotal: toAmount(currency.subtotal),
        vat: toAmount(currency.vat),
        line_total: toAmount(currency.line_total),
        document_total: toAmount(currency.document_total),
        document_difference: toAmount(currency.document_total.minus(lineTotal)),
        categories: [...currency.categories.values()].sort((a, b) => b.line_total.comparedTo(a.line_total)).map(group => serializeGroup(group, true)),
        points_of_sale: [...currency.points_of_sale.values()].sort((a, b) => b.line_total.comparedTo(a.line_total)).map(group => serializeGroup(group)),
      };
    });
  }

  private mergeCompany(merged: Map<string, CurrencyAmounts>, company: CompanyAmounts) {
    for (const [code, source] of company.currencies) {
      let target = merged.get(code);
      if (!target) {
        target = {
          currency_code: code, document_count: 0, line_count: 0,
          quantity: new Prisma.Decimal(0), subtotal: new Prisma.Decimal(0), vat: new Prisma.Decimal(0),
          line_total: new Prisma.Decimal(0), document_total: new Prisma.Decimal(0), categories: new Map(), points_of_sale: new Map(),
        };
        merged.set(code, target);
      }
      target.document_count += source.document_count;
      target.line_count += source.line_count;
      target.quantity = target.quantity.plus(source.quantity);
      target.subtotal = target.subtotal.plus(source.subtotal);
      target.vat = target.vat.plus(source.vat);
      target.line_total = target.line_total.plus(source.line_total);
      target.document_total = target.document_total.plus(source.document_total);
    }
  }

  private documentReference(document: Pick<SalesProductsDocument, 'number' | 'document_sequences'>) {
    const number = String(document.number).padStart(8, '0');
    const pos = document.document_sequences?.point_of_sale?.trim();
    const prefix = document.document_sequences?.prefix?.trim();
    return `${prefix ? `${prefix} ` : ''}${pos ? `${pos.padStart(4, '0')}-` : ''}${number}`;
  }

  private formatAmount(value: Prisma.Decimal) {
    return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value.toString()));
  }

  private includesAny(query: string, values: Array<string | null | undefined>) {
    return values.some(value => value != null && this.normalize(String(value)).includes(query));
  }

  private normalize(value: string) {
    return value.trim().toLocaleLowerCase('es-AR');
  }

  private currency(value: string | null | undefined) {
    return value?.trim().toUpperCase() || 'ARS';
  }

  private parseRange(dateFrom: string, dateTo: string): Range {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateFrom) || !/^\d{4}-\d{2}-\d{2}$/.test(dateTo) || dateFrom > dateTo) {
      throw new BadRequestException('Ingresá un período válido: Desde debe ser anterior o igual a Hasta.');
    }
    const from = new Date(`${dateFrom}T00:00:00.000Z`);
    const to = new Date(`${dateTo}T00:00:00.000Z`);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from.toISOString().slice(0, 10) !== dateFrom || to.toISOString().slice(0, 10) !== dateTo) {
      throw new BadRequestException('Ingresá fechas válidas para el período.');
    }
    to.setUTCDate(to.getUTCDate() + 1);
    return { from, to };
  }

  private async getMemberships(companyIds: string[], userId: string) {
    const uniqueIds = [...new Set(companyIds)];
    if (!uniqueIds.length || uniqueIds.length > 20) throw new BadRequestException('Seleccioná entre 1 y 20 empresas.');
    const memberships = await this.db.getDefaultClient().company_users.findMany({
      where: { user_id: userId, company_id: { in: uniqueIds }, company: { deleted_at: null, subdomain: { not: null } } },
      select: { role: true, company: { select: { id: true, name: true, subdomain: true } } },
    });
    if (memberships.length !== uniqueIds.length || memberships.some(row => !row.company.subdomain)) {
      throw new ForbiddenException('Una o más empresas no están disponibles para este usuario.');
    }
    return memberships as Array<{ role: string; company: { id: string; name: string; subdomain: string } }>;
  }

  private appendSheet(workbook: XLSX.WorkBook, name: string, rows: Record<string, unknown>[], widths: number[]) {
    const sheet = XLSX.utils.json_to_sheet(rows);
    sheet['!cols'] = widths.map(wch => ({ wch }));
    XLSX.utils.book_append_sheet(workbook, sheet, name);
  }
}
