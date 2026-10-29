import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { relocateTransitReservations } from './transit-reservations';

const TRANSIT_ENTRY_REFERENCE = 'intl_invoice_transit';
const TRANSIT_ORDER_REFERENCE = 'intl_order_transit';
const TRANSIT_RECEIPT_REFERENCE = 'intl_remito_receipt';
const TRANSIT_STOCK_STATUSES = new Set([
  'SHIPPED',
  'IN_TRANSIT',
  'ARRIVED',
  'CUSTOMS',
  'RELEASED',
  'RECEIVING',
]);

function quantitiesByProduct(
  items: Array<{ product_id: string | null; quantity: unknown; stock_quantity?: unknown }>,
) {
  const quantities = new Map<string, Prisma.Decimal>();
  for (const item of items) {
    if (!item.product_id) continue;
    const current = quantities.get(item.product_id) ?? new Prisma.Decimal(0);
    const stockQuantity = item.stock_quantity ?? item.quantity;
    quantities.set(item.product_id, current.add(new Prisma.Decimal(stockQuantity as any)));
  }
  return quantities;
}

async function getTransitWarehouse(tx: any, containerId: string) {
  const container = await tx.international_containers.findFirst({
    where: { id: containerId, deleted_at: null },
    select: { id: true, container_number: true, transit_warehouse_id: true, status: true },
  });
  if (!container) throw new BadRequestException('El contenedor asociado no existe');
  if (!container.transit_warehouse_id) {
    throw new BadRequestException(`El contenedor ${container.container_number} no tiene depósito de tránsito`);
  }
  return container;
}

export async function registerInternationalPurchaseInTransit(
  tx: any,
  documentId: string,
  containerId: string,
  userId?: string,
) {
  // Serialize family quantity checks so simultaneous OC/invoice confirmations
  // cannot register the same goods twice in this container.
  await tx.$queryRaw`SELECT id FROM tenant.international_containers WHERE id = ${containerId}::uuid FOR UPDATE`;

  const [container, document] = await Promise.all([
    getTransitWarehouse(tx, containerId),
    tx.documents.findUnique({
      where: { id: documentId },
      include: {
        document_types: { select: { category: true, direction: true } },
        parent_document: { select: { id: true, document_types: { select: { category: true } } } },
        document_items: {
          where: { deleted_at: null },
          select: { product_id: true, quantity: true, stock_quantity: true },
        },
      },
    }),
  ]);
  if (!TRANSIT_STOCK_STATUSES.has(container.status)) return false;
  if (!document) throw new BadRequestException('El comprobante asociado no existe');
  if (!['ORDER', 'INVOICE'].includes(document.document_types?.category) || document.document_types?.direction !== -1 || document.status !== 2 || document.deleted_at) return false;
  const rootId = document.document_types.category === 'INVOICE' && document.parent_document?.document_types?.category === 'ORDER'
    ? document.parent_document.id : document.id;
  const otherContainer = await tx.international_operation_documents.findFirst({
    where: { expense_type: 'MERCHANDISE', container_id: { not: containerId }, document: { document_types: { direction: -1, category: { in: ['ORDER', 'INVOICE'] } }, OR: [{ id: rootId }, { parent_document_id: rootId }] } },
    select: { container_id: true },
  });
  if (otherContainer) throw new BadRequestException('La OC y su factura de mercadería deben usar el mismo contenedor para no duplicar stock en tránsito');
  const family = await tx.international_operation_documents.findMany({
    where: {
      container_id: containerId, expense_type: 'MERCHANDISE',
      document: { document_types: { direction: -1, category: { in: ['ORDER', 'INVOICE'] } }, OR: [{ id: rootId }, { parent_document_id: rootId }] },
    },
    include: { document: { include: { document_items: { where: { deleted_at: null }, select: { product_id: true, quantity: true, stock_quantity: true } } } } },
  });
  if (!family.some((link: any) => link.document_id === documentId)) return false;
  const quantities = new Map<string, Prisma.Decimal>();
  for (const link of family) {
    if (link.document.deleted_at || link.document.status !== 2) continue;
    for (const [productId, quantity] of quantitiesByProduct(link.document.document_items)) {
      const previous = quantities.get(productId) ?? new Prisma.Decimal(0);
      if (quantity.greaterThan(previous)) quantities.set(productId, quantity);
    }
  }
  if (!quantities.size) throw new BadRequestException('El comprobante de mercadería no contiene productos para ingresar en tránsito');
  // Count historical inbound movements, including quantities already received.
  // Comparing with today's warehouse balance would re-enter consumed stock.
  const movements = await tx.warehouse_stock_movements.findMany({
    where: { warehouse_id: container.transit_warehouse_id, reference_type: { in: [TRANSIT_ORDER_REFERENCE, TRANSIT_ENTRY_REFERENCE] }, reference_id: { in: family.map((link: any) => link.document_id) }, direction: 'IN', deleted_at: null },
    select: { product_id: true, quantity: true },
  });
  const registered = quantitiesByProduct(movements);
  let changed = false;
  const isOrder = document.document_types.category === 'ORDER';
  for (const [productId, target] of quantities) {
    const quantity = target.sub(registered.get(productId) ?? new Prisma.Decimal(0));
    if (!quantity.greaterThan(0)) continue;
    changed = true;
    await tx.warehouse_stock_movements.create({
      data: {
        warehouse_id: container.transit_warehouse_id,
        product_id: productId,
        movement_type: 'INTL_TRANSIT',
        direction: 'IN',
        quantity,
        reference_type: isOrder ? TRANSIT_ORDER_REFERENCE : TRANSIT_ENTRY_REFERENCE,
        reference_id: documentId,
        notes: `Ingreso por ${isOrder ? 'OC' : 'factura'} internacional · contenedor ${container.container_number}`,
        created_by: userId,
      },
    });
    await tx.warehouse_stock.upsert({
      where: { warehouse_id_product_id: { warehouse_id: container.transit_warehouse_id, product_id: productId } },
      create: { warehouse_id: container.transit_warehouse_id, product_id: productId, quantity },
      update: { quantity: { increment: quantity }, updated_at: new Date() },
    });
  }
  return changed;
}

// Keep compatibility for callers outside the international module.
export const registerInternationalInvoiceInTransit = registerInternationalPurchaseInTransit;

export async function receiveInternationalRemitoFromTransit(
  tx: any,
  document: any,
  containerId: string,
  userId?: string,
) {
  const existing = await tx.warehouse_stock_movements.findFirst({
    where: {
      reference_type: TRANSIT_RECEIPT_REFERENCE,
      reference_id: document.id,
      deleted_at: null,
    },
    select: { id: true },
  });
  if (existing) return false;

  const container = await getTransitWarehouse(tx, containerId);
  for (const item of document.document_items) {
    if (!item.product_id) continue;
    const destinationWarehouseId = item.warehouse_id ?? document.warehouse_id;
    if (!destinationWarehouseId) {
      throw new BadRequestException('Seleccioná el depósito real de destino para cada producto del remito');
    }
    if (destinationWarehouseId === container.transit_warehouse_id) {
      throw new BadRequestException('El depósito receptor debe ser distinto al depósito de tránsito');
    }
    const destination = await tx.warehouses.findFirst({
      where: { id: destinationWarehouseId, active: true, deleted_at: null, is_virtual: false },
      select: { id: true },
    });
    if (!destination) {
      throw new BadRequestException('El depósito real seleccionado no existe o está inactivo');
    }

    const quantity = new Prisma.Decimal(item.stock_quantity ?? item.quantity);
    const transitStock = await tx.warehouse_stock.findUnique({
      where: {
        warehouse_id_product_id: {
          warehouse_id: container.transit_warehouse_id,
          product_id: item.product_id,
        },
      },
      select: { quantity: true },
    });
    if (!transitStock || transitStock.quantity.lessThan(quantity)) {
      throw new BadRequestException('El remito supera la cantidad disponible en tránsito para uno de sus productos');
    }

    await tx.warehouse_stock_movements.create({
      data: {
        warehouse_id: container.transit_warehouse_id,
        product_id: item.product_id,
        movement_type: 'INTL_RECEIPT',
        direction: 'OUT',
        quantity,
        reference_type: TRANSIT_RECEIPT_REFERENCE,
        reference_id: document.id,
        notes: `Recepción de contenedor ${container.container_number}`,
        created_by: userId,
      },
    });
    await tx.warehouse_stock.update({
      where: {
        warehouse_id_product_id: {
          warehouse_id: container.transit_warehouse_id,
          product_id: item.product_id,
        },
      },
      data: { quantity: { decrement: quantity }, updated_at: new Date() },
    });
    await tx.warehouse_stock_movements.create({
      data: {
        warehouse_id: destinationWarehouseId,
        product_id: item.product_id,
        movement_type: 'INTL_RECEIPT',
        direction: 'IN',
        quantity,
        reference_type: TRANSIT_RECEIPT_REFERENCE,
        reference_id: document.id,
        notes: `Ingreso desde contenedor ${container.container_number}`,
        created_by: userId,
      },
    });
    await tx.warehouse_stock.upsert({
      where: { warehouse_id_product_id: { warehouse_id: destinationWarehouseId, product_id: item.product_id } },
      create: { warehouse_id: destinationWarehouseId, product_id: item.product_id, quantity },
      update: { quantity: { increment: quantity }, updated_at: new Date() },
    });
    await relocateTransitReservations(
      tx,
      container.transit_warehouse_id,
      destinationWarehouseId,
      item.product_id,
      quantity,
      userId,
    );
  }

  const remainingProducts = await tx.warehouse_stock.count({
    where: {
      warehouse_id: container.transit_warehouse_id,
      deleted_at: null,
      quantity: { gt: 0 },
    },
  });
  if (remainingProducts === 0) {
    await tx.international_containers.update({
      where: { id: container.id },
      data: { status: 'DELIVERED', actual_arrival_date: new Date(), updated_at: new Date() },
    });
  }
  return true;
}

export async function hasInternationalTransitMovements(tx: any, documentId: string) {
  const direct = await tx.warehouse_stock_movements.findFirst({
    where: {
      reference_type: { in: [TRANSIT_ORDER_REFERENCE, TRANSIT_ENTRY_REFERENCE, TRANSIT_RECEIPT_REFERENCE] },
      reference_id: documentId,
      deleted_at: null,
    },
    select: { id: true },
  });
  if (direct) return true;
  const document = await tx.documents.findUnique({ where: { id: documentId }, select: { document_types: { select: { category: true } } } });
  if (!['ORDER', 'INVOICE'].includes(document?.document_types?.category)) return false;
  const descendants = await tx.documents.findMany({
    where: { document_types: { category: { in: ['INVOICE', 'REMITO'] } }, OR: [{ parent_document_id: documentId }, { parent_document: { parent_document_id: documentId } }] },
    select: { id: true },
  });
  if (!descendants.length) return false;
  return Boolean(await tx.warehouse_stock_movements.findFirst({
    where: { reference_type: { in: [TRANSIT_ORDER_REFERENCE, TRANSIT_ENTRY_REFERENCE, TRANSIT_RECEIPT_REFERENCE] }, reference_id: { in: descendants.map((child: any) => child.id) }, deleted_at: null },
    select: { id: true },
  }));
}
