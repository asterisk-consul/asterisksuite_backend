import { Prisma } from '@/generated/prisma/client';

export async function relocateTransitReservations(
  tx: any,
  originWarehouseId: string,
  destinationWarehouseId: string,
  productId: string,
  movedQuantity: Prisma.Decimal,
  userId?: string,
) {
  let capacity = new Prisma.Decimal(movedQuantity);
  if (capacity.lessThanOrEqualTo(0)) return;

  const reservations = await tx.stock_reservations.findMany({
    where: {
      warehouse_id: originWarehouseId,
      product_id: productId,
      status: { in: ['ACTIVE', 'PARTIALLY_CONSUMED'] },
      deleted_at: null,
    },
    orderBy: { created_at: 'asc' },
  });

  for (const reservation of reservations) {
    if (capacity.lessThanOrEqualTo(0)) break;
    const pending = new Prisma.Decimal(reservation.quantity_reserved)
      .minus(reservation.quantity_consumed)
      .minus(reservation.quantity_released);
    const relocate = Prisma.Decimal.min(pending, capacity);
    if (relocate.lessThanOrEqualTo(0)) continue;

    await tx.stock_reservations.update({
      where: { id: reservation.id },
      data: {
        quantity_released: { increment: relocate },
        status: relocate.equals(pending)
          ? 'TRANSFERRED'
          : (new Prisma.Decimal(reservation.quantity_consumed).greaterThan(0) ? 'PARTIALLY_CONSUMED' : 'ACTIVE'),
        updated_by: userId,
      },
    });
    await tx.stock_reservations.create({
      data: {
        warehouse_id: destinationWarehouseId,
        product_id: reservation.product_id,
        quantity_reserved: relocate,
        reservation_type: reservation.reservation_type,
        source_type: reservation.source_type,
        source_id: reservation.source_id,
        source_item_id: reservation.source_item_id,
        party_id: reservation.party_id,
        reason: `${reservation.reason ?? 'Reserva'} · trasladada desde tránsito`,
        expires_at: reservation.expires_at,
        created_by: userId ?? reservation.created_by,
      },
    });
    await tx.warehouse_stock.update({
      where: { warehouse_id_product_id: { warehouse_id: originWarehouseId, product_id: productId } },
      data: { reserved_quantity: { decrement: relocate }, updated_at: new Date() },
    });
    await tx.warehouse_stock.update({
      where: { warehouse_id_product_id: { warehouse_id: destinationWarehouseId, product_id: productId } },
      data: { reserved_quantity: { increment: relocate }, updated_at: new Date() },
    });
    if (reservation.source_item_id) {
      await tx.document_items.updateMany({
        where: { id: reservation.source_item_id, warehouse_id: originWarehouseId },
        data: { warehouse_id: destinationWarehouseId },
      });
    }
    capacity = capacity.minus(relocate);
  }
}
