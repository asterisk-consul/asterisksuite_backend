import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';

const TRANSIT_ENTRY_REFERENCE = 'intl_invoice_transit';
const TRANSIT_RECEIPT_REFERENCE = 'intl_remito_receipt';

function quantitiesByProduct(items: Array<{ product_id: string | null; quantity: unknown }>) {
  const quantities = new Map<string, Prisma.Decimal>();
  for (const item of items) {
    if (!item.product_id) continue;
    const current = quantities.get(item.product_id) ?? new Prisma.Decimal(0);
    quantities.set(item.product_id, current.add(new Prisma.Decimal(item.quantity as any)));
  }
  return quantities;
}

async function getTransitWarehouse(tx: any, containerId: string) {
  const container = await tx.international_containers.findFirst({
    where: { id: containerId, deleted_at: null },
    select: { id: true, container_number: true, transit_warehouse_id: true },
  });
  if (!container) throw new BadRequestException('El contenedor asociado no existe');
  if (!container.transit_warehouse_id) {
    throw new BadRequestException(`El contenedor ${container.container_number} no tiene depósito de tránsito`);
  }
  return container;
}

export async function registerInternationalInvoiceInTransit(
  tx: any,
  documentId: string,
  containerId: string,
  userId?: string,
) {
  const existing = await tx.warehouse_stock_movements.findFirst({
    where: {
      reference_type: TRANSIT_ENTRY_REFERENCE,
      reference_id: documentId,
      deleted_at: null,
    },
    select: { id: true },
  });
  if (existing) return false;

  const [container, document] = await Promise.all([
    getTransitWarehouse(tx, containerId),
    tx.documents.findUnique({
      where: { id: documentId },
      include: {
        document_types: { select: { category: true, direction: true } },
        document_items: { where: { deleted_at: null }, select: { product_id: true, quantity: true } },
      },
    }),
  ]);
  if (!document) throw new BadRequestException('La factura asociada no existe');
  if (document.document_types?.category !== 'INVOICE' || document.document_types?.direction !== -1) return false;

  const quantities = quantitiesByProduct(document.document_items);
  if (!quantities.size) throw new BadRequestException('La factura de mercadería no contiene productos para ingresar en tránsito');

  for (const [productId, quantity] of quantities) {
    await tx.warehouse_stock_movements.create({
      data: {
        warehouse_id: container.transit_warehouse_id,
        product_id: productId,
        movement_type: 'INTL_TRANSIT',
        direction: 'IN',
        quantity,
        reference_type: TRANSIT_ENTRY_REFERENCE,
        reference_id: documentId,
        notes: `Ingreso por factura internacional · contenedor ${container.container_number}`,
        created_by: userId,
      },
    });
    await tx.warehouse_stock.upsert({
      where: { warehouse_id_product_id: { warehouse_id: container.transit_warehouse_id, product_id: productId } },
      create: { warehouse_id: container.transit_warehouse_id, product_id: productId, quantity },
      update: { quantity: { increment: quantity }, updated_at: new Date() },
    });
  }
  return true;
}

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

    const quantity = new Prisma.Decimal(item.quantity);
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
  return Boolean(await tx.warehouse_stock_movements.findFirst({
    where: {
      reference_type: { in: [TRANSIT_ENTRY_REFERENCE, TRANSIT_RECEIPT_REFERENCE] },
      reference_id: documentId,
      deleted_at: null,
    },
    select: { id: true },
  }));
}
